import { Link } from ".pnpm/react-router-dom@6.2.1_react-dom@17.0.2+react@17.0.2/node_modules/react-router-dom"
import { startOfDay, startOfToday } from "date-fns"
import { Fragment } from "react"
import type { LoaderFunction, MetaFunction } from "remix"
import { useLoaderData } from "remix"
import { anilistClient } from "~/anilist-client.server"
import { buttonClass } from "~/components"
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

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  let page = Number(new URL(request.url).searchParams.get("page"))
  if (!Number.isFinite(page) || page < 1) {
    page = 1
  }

  const schedule = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page,
      startDate: startOfToday().getTime() / 1000,
    },
  })

  return { schedule }
}

export default function Schedule() {
  return (
    <>
      <ScheduleItems />
      <Pagination />
    </>
  )
}

function ScheduleItems() {
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
            <div className="text-2xl font-light leading-tight">
              <DateTime date={day} weekday="long" />
            </div>
            <div className="text-sm opacity-60">
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

function Pagination() {
  const data = useLoaderData<LoaderData>()
  const pageInfo = { currentPage: 1, ...data.schedule.Page?.pageInfo }
  const previousPage =
    pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : undefined
  const nextPage = pageInfo.hasNextPage ? pageInfo.currentPage + 1 : undefined

  return (
    <div className="flex items-center justify-center gap-4">
      {previousPage != undefined ? (
        <Link
          to={`?page=${previousPage}`}
          className={buttonClass({ variant: "clear" })}
        >
          Previous Page
        </Link>
      ) : undefined}
      {nextPage != undefined ? (
        <Link
          to={`?page=${nextPage}`}
          className={buttonClass({ variant: "clear" })}
        >
          Next Page
        </Link>
      ) : undefined}
    </div>
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
