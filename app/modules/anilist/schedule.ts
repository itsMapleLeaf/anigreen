import { ScheduleDocument } from "~/modules/anilist/graphql"
import { startOfDayZoned } from "~/modules/dates/start-of-day-zoned"
import type { AnilistMedia } from "~/modules/media/media-data"
import { extractMediaData } from "~/modules/media/media-data"
import { anilistRequest } from "./request.server"

export type AnilistSchedule = {
  items: AnilistScheduleItem[]
  nextPage?: number
  previousPage?: number
}

export type AnilistScheduleItem = {
  id: number
  media: AnilistMedia
  airingDayMs: number
  episode: number
}

export async function loadSchedule({
  accessToken,
  page,
  timezone,
}: {
  accessToken?: string
  page: number
  timezone: string
}): Promise<AnilistSchedule> {
  const data = await anilistRequest({
    document: ScheduleDocument,
    variables: {
      page,
      startDate: startOfDayZoned(new Date(), timezone).getTime() / 1000,
    },
    accessToken,
  })

  const items: AnilistScheduleItem[] = (
    data.Page?.airingSchedules ?? []
  ).flatMap((schedule) => {
    if (!schedule?.media) return []
    return {
      id: schedule.id,
      episode: schedule.episode,
      airingDayMs: startOfDayZoned(
        schedule.airingAt * 1000,
        timezone,
      ).getTime(),
      media: extractMediaData(schedule.media, schedule.media?.mediaListEntry),
    }
  })

  const pageInfo = { currentPage: 1, ...data.Page?.pageInfo }
  const previousPage =
    pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : undefined
  const nextPage = pageInfo.hasNextPage ? pageInfo.currentPage + 1 : undefined

  return {
    items,
    nextPage,
    previousPage,
  }
}
