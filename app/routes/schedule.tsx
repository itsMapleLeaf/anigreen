import { startOfDay, startOfToday } from "date-fns"
import { Fragment } from "react"
import type { LoaderFunction, MetaFunction } from "remix"
import { useLoaderData } from "remix"
import { anilistClient } from "~/anilist-client.server"
import { DateTime } from "~/dom/date-time"
import type { ScheduleQuery } from "~/graphql.out"
import { ScheduleDocument } from "~/graphql.out"
import { getAppTitle } from "~/meta"

export const meta: MetaFunction = () => ({
  title: getAppTitle("Schedule"),
})

type LoaderData = {
  schedule: ScheduleQuery
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const schedule = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page: 1,
      startDate: startOfToday().getTime() / 1000,
    },
  })
  return { schedule }
}

export default function Schedule() {
  const data = useLoaderData<LoaderData>()

  const itemsByDay = new Map<number, Array<{ id: number; title: string }>>()
  for (const schedule of data.schedule.Page?.airingSchedules ?? []) {
    if (!schedule) continue
    const day = startOfDay(schedule.airingAt * 1000).getTime()
    const { title } = schedule.media ?? {}

    const titleText =
      title?.userPreferred ||
      title?.english ||
      title?.romaji ||
      title?.native ||
      "Unknown Title"

    const items = mapGetWithFallback(itemsByDay, day, [])
    items.push({ id: schedule.id, title: titleText })
  }

  const dayLists = [...itemsByDay.entries()]
    .map(([day, items]) => ({ day, items }))
    .sort((a, b) => a.day - b.day)

  return (
    <>
      {dayLists.map(({ day, items }) => (
        <Fragment key={day}>
          <h2 className="mb-4">
            <div className="text-2xl font-light leading-tight block">
              <DateTime date={day} weekday="long" />
            </div>
            <div className="text-sm opacity-60 block">
              <DateTime date={day} dateStyle="long" />
            </div>
          </h2>
          <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] mb-6">
            {items.map(({ id, title }) => (
              <li key={id}>{title}</li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  )
}

function mapGetWithFallback<Key, Value>(
  map: Map<Key, Value>,
  key: Key,
  fallback: Value,
): Value {
  let value = map.get(key)
  if (value === undefined) {
    value = fallback
    map.set(key, value)
  }
  return value
}
