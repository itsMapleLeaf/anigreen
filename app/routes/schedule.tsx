import { ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { Fragment, useDeferredValue } from "react"
import type { MetaFunction } from "remix"
import { Link, useNavigate } from "remix"
import { getSession } from "~/auth/session.server"
import { DateTime } from "~/dates/date-time"
import { getTimezone } from "~/dates/timezone-cookie.server"
import { useWindowEvent } from "~/dom/use-event"
import { MediaCard } from "~/media/media-card"
import { getAppTitle } from "~/meta"
import { useLoaderDataTyped } from "~/remix-typed"
import { loadScheduleData } from "~/schedule/schedule-data.server"
import { clearButtonClass } from "~/ui/button-style"
import { LoadingIcon } from "~/ui/loading-icon"
import { KeyboardKey } from "../ui/keyboard-key"

export const meta: MetaFunction = () => ({
  title: getAppTitle("Schedule"),
})

export async function loader({ request }: DataFunctionArgs) {
  let page = Number(new URL(request.url).searchParams.get("page"))
  if (!Number.isFinite(page) || page < 1) {
    page = 1
  }

  const session = await getSession(request)
  const timezone = await getTimezone(request)

  return {
    schedule: await loadScheduleData(page, timezone, session?.accessToken),
    timezone,
  }
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
  const data = useLoaderDataTyped<typeof loader>()
  const deferredData = useDeferredValue(data)

  return (
    <>
      {data !== deferredData && (
        <div className="grid place-items-center my-4">
          <LoadingIcon size="large" />
        </div>
      )}
      {deferredData.schedule.dayLists.map(({ day, items }) => (
        <Fragment key={day}>
          <h2 className="my-4">
            <div className="text-2xl font-light leading-tight">
              <DateTime date={day} weekday="long" />
            </div>
            <div className="text-sm opacity-60">
              <DateTime date={day} dateStyle="long" />
            </div>
          </h2>
          <ul className="grid gap-4 my-6 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
            {items.map((item) => (
              <li key={item.id}>
                <MediaCard media={item.media} scheduleEpisode={item.episode} />
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  )
}

function Pagination() {
  const { schedule } = useLoaderDataTyped<typeof loader>()
  const { previousPage, nextPage } = schedule

  const navigate = useNavigate()
  useWindowEvent("keydown", (event) => {
    if (event.key === "ArrowLeft" && previousPage != undefined) {
      event.preventDefault()
      navigate(`?page=${previousPage}`)
    }
    if (event.key === "ArrowRight" && nextPage != undefined) {
      event.preventDefault()
      navigate(`?page=${nextPage}`)
    }
  })

  return (
    <div className="flex items-center justify-center gap-4">
      {previousPage != undefined ? (
        <Link to={`?page=${previousPage}`} className={clearButtonClass}>
          <KeyboardKey label="Left arrow">
            <ArrowSmLeftIcon className="w-5" />
          </KeyboardKey>
          Previous Page
        </Link>
      ) : undefined}
      {nextPage != undefined ? (
        <Link to={`?page=${nextPage}`} className={clearButtonClass}>
          <KeyboardKey label="Right arrow">
            <ArrowSmRightIcon className="w-5" />
          </KeyboardKey>
          Next Page
        </Link>
      ) : undefined}
    </div>
  )
}
