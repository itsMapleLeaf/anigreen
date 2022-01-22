import { startOfDay } from "date-fns"
import { anilistClient } from "~/anilist/anilist-client.server"
import { ScheduleDocument } from "~/anilist/graphql.out"
import { startOfDayZoned } from "~/dates/start-of-day-zoned"
import { mapGetWithFallback } from "~/helpers/map-get-with-fallback"
import type { MediaResource } from "~/media/media"
import { createMediaResource } from "~/media/media"

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

    mapGetWithFallback(itemsByDay, day, []).push({
      id: schedule.id,
      episode: schedule.episode,
      media: createMediaResource(schedule.media, schedule.media.mediaListEntry),
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
