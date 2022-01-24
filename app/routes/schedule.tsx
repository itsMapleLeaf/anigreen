import { ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { useDeferredValue } from "react"
import type { MetaFunction } from "remix"
import { Link, useNavigate } from "remix"
import { loadSchedule } from "~/modules/anilist/schedule"
import { getSession } from "~/modules/auth/session.server"
import { getTimezone } from "~/modules/dates/timezone-cookie.server"
import { useWindowEvent } from "~/modules/dom/use-event"
import { MediaCard } from "~/modules/media/media-card"
import { getAppTitle } from "~/modules/meta"
import { useLoaderDataTyped } from "~/modules/remix-typed"
import { clearButtonClass } from "~/modules/ui/button-style"
import { LoadingIcon } from "~/modules/ui/loading-icon"
import { WeekdaySectionedList } from "~/modules/ui/weekday-sectioned-list"
import { KeyboardKey } from "../modules/ui/keyboard-key"

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
    timezone,
    schedule: await loadSchedule({
      page,
      timezone,
      accessToken: session?.accessToken,
    }),
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
      <WeekdaySectionedList
        items={deferredData.schedule.items}
        timezone={deferredData.timezone}
        getItemDate={(item) => item.airingDayMs}
        getItemKey={(item) => item.id}
        renderItem={(item) => (
          <MediaCard
            media={item.media}
            scheduleEpisode={item.episode}
            hideProgress
          />
        )}
      />
    </>
  )
}

function Pagination() {
  const { schedule } = useLoaderDataTyped<typeof loader>()

  const navigate = useNavigate()
  useWindowEvent("keydown", (event) => {
    if (event.key === "ArrowLeft" && schedule.previousPage != undefined) {
      event.preventDefault()
      navigate(`?page=${schedule.previousPage}`)
    }
    if (event.key === "ArrowRight" && schedule.nextPage != undefined) {
      event.preventDefault()
      navigate(`?page=${schedule.nextPage}`)
    }
  })

  return (
    <div className="flex items-center justify-center gap-4">
      {schedule.previousPage != undefined ? (
        <Link
          to={`?page=${schedule.previousPage}`}
          className={clearButtonClass}
        >
          <KeyboardKey label="Left arrow">
            <ArrowSmLeftIcon className="w-5" />
          </KeyboardKey>
          Previous Page
        </Link>
      ) : undefined}
      {schedule.nextPage != undefined ? (
        <Link to={`?page=${schedule.nextPage}`} className={clearButtonClass}>
          <KeyboardKey label="Right arrow">
            <ArrowSmRightIcon className="w-5" />
          </KeyboardKey>
          Next Page
        </Link>
      ) : undefined}
    </div>
  )
}
