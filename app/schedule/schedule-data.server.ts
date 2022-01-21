import { startOfDay } from "date-fns"
import { anilistClient } from "~/anilist/anilist-client.server"
import { ScheduleDocument } from "~/anilist/graphql.out"
import { startOfDayZoned } from "~/dates/start-of-day-zoned"
import { isTruthy } from "~/helpers/is-truthy"
import { mapGetWithFallback } from "~/helpers/map-get-with-fallback"
import type { MediaResource } from "~/media/media"

export type ScheduleData = Awaited<ReturnType<typeof loadScheduleData>>

export type ScheduleItem = {
  id: number
  media: MediaResource
  episode: number
}

export async function loadScheduleData(
  page: number,
  timezone: string,
  accessToken?: string,
) {
  const data = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page,
      startDate: startOfDayZoned(new Date(), timezone).getTime() / 1000,
    },
    accessToken,
  })

  const itemsByDay = new Map<number, ScheduleItem[]>()
  for (const schedule of data.Page?.airingSchedules ?? []) {
    if (!schedule || !schedule.media) continue

    const day = startOfDay(schedule.airingAt * 1000).getTime()
    const { title } = schedule.media ?? {}

    const titleText =
      title?.userPreferred ||
      title?.english ||
      title?.romaji ||
      title?.native ||
      "Unknown Title"

    mapGetWithFallback(itemsByDay, day, []).push({
      id: schedule.id,
      episode: schedule.episode,
      media: {
        id: schedule.media.id,
        title: titleText,
        format: schedule.media.format?.replace(/[^A-Za-z]+/g, " "),
        episodeCount: schedule.media.episodes,
        bannerImageUrl: schedule.media.bannerImage,
        coverImageUrl: schedule.media.coverImage?.medium,
        coverColor: schedule.media.coverImage?.color,
        watchListInfo: schedule.media.mediaListEntry?.status && {
          mediaListId: schedule.media.mediaListEntry.id,
          status: schedule.media.mediaListEntry.status,
          progress: schedule.media.mediaListEntry.progress ?? 0,
        },
        externalLinks: schedule.media.externalLinks?.filter(isTruthy) ?? [],
      },
    })
  }

  const dayLists = [...itemsByDay.entries()]
    .map(([day, items]) => ({ day, items }))
    .sort((a, b) => a.day - b.day)

  const pageInfo = { currentPage: 1, ...data.Page?.pageInfo }
  const previousPage =
    pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : undefined
  const nextPage = pageInfo.hasNextPage ? pageInfo.currentPage + 1 : undefined

  return {
    dayLists,
    previousPage,
    nextPage,
  }
}
