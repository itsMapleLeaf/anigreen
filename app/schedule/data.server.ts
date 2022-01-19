import { startOfDay, startOfToday } from "date-fns"
import { anilistClient } from "~/anilist-client.server"
import { ScheduleDocument } from "~/graphql.out"
import { mapGetWithFallback } from "~/helpers/map-get-with-fallback"

export type ScheduleData = Awaited<ReturnType<typeof loadScheduleData>>

export async function loadScheduleData(page: number) {
  const data = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page,
      startDate: startOfToday().getTime() / 1000,
    },
  })

  const itemsByDay = new Map<number, Array<{ id: number; title: string }>>()
  for (const schedule of data.Page?.airingSchedules ?? []) {
    if (!schedule) continue
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
      title: titleText,
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
