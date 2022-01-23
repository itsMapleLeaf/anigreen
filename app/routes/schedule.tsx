import { ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { useDeferredValue } from "react"
import type { MetaFunction } from "remix"
import { Link, useNavigate } from "remix"
import { anilistClient } from "~/anilist/anilist-client.server"
import { ScheduleDocument } from "~/anilist/graphql.out"
import { getSession } from "~/auth/session.server"
import { startOfDayZoned } from "~/dates/start-of-day-zoned"
import { getTimezone } from "~/dates/timezone-cookie.server"
import { useWindowEvent } from "~/dom/use-event"
import type { MediaResource } from "~/media/media"
import { createMediaResource } from "~/media/media"
import { MediaCard } from "~/media/media-card"
import { getAppTitle } from "~/meta"
import { useLoaderDataTyped } from "~/remix-typed"
import { clearButtonClass } from "~/ui/button-style"
import { LoadingIcon } from "~/ui/loading-icon"
import { WeekdaySectionedList } from "~/ui/weekday-sectioned-list"
import { KeyboardKey } from "../ui/keyboard-key"

export type ScheduleItem = {
  id: number
  media: MediaResource
  airingDayMs: number
  episode: number
}

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

  const data = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page,
      startDate: startOfDayZoned(new Date(), timezone).getTime() / 1000,
    },
    accessToken: session?.accessToken,
  })

  const scheduleItems: ScheduleItem[] = (
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
      media: createMediaResource(
        schedule.media,
        schedule.media?.mediaListEntry,
      ),
    }
  })

  const pageInfo = { currentPage: 1, ...data.Page?.pageInfo }
  const previousPage =
    pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : undefined
  const nextPage = pageInfo.hasNextPage ? pageInfo.currentPage + 1 : undefined

  return {
    scheduleItems,
    timezone,
    nextPage,
    previousPage,
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
        items={deferredData.scheduleItems}
        timezone={deferredData.timezone}
        getItemDate={(item) => item.airingDayMs}
        getItemKey={(item) => item.id}
        renderItem={(item) => (
          <MediaCard media={item.media} scheduleEpisode={item.episode} />
        )}
      />
    </>
  )
}

function Pagination() {
  const { previousPage, nextPage } = useLoaderDataTyped<typeof loader>()

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
