import { ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs, MetaFunction } from "@remix-run/node"
import { deferred } from "@remix-run/node"
import { Deferred, Link, useNavigate } from "@remix-run/react"
import { useLoaderDataTyped } from "remix-typed"
import type {
  ScheduleQuery,
  ScheduleQueryVariables,
} from "~/generated/anilist-graphql"
import { resolvePageInfo, resolvePageParam } from "~/modules/anilist/paging"
import { anilistRequest } from "~/modules/anilist/request.server"
import { getSession } from "~/modules/auth/session.server"
import { startOfDayZoned } from "~/modules/dates/start-of-day-zoned"
import { getTimezone } from "~/modules/dates/timezone-cookie.server"
import { useWindowEvent } from "~/modules/dom/use-event"
import { MediaCard } from "~/modules/media/media-card"
import type { AnilistMedia } from "~/modules/media/media-data"
import {
  extractMediaData,
  mediaFragment,
  mediaListEntryFragment,
} from "~/modules/media/media-data"
import { getAppMeta } from "~/modules/meta"
import { shouldDefer } from "~/modules/remix/no-defer"
import { clearButtonClass } from "~/modules/ui/button-style"
import { GridSkeleton } from "~/modules/ui/grid-skeleton"
import { WeekdaySectionedList } from "~/modules/ui/weekday-sectioned-list"
import { KeyboardKey } from "../modules/ui/keyboard-key"

type ScheduleData = {
  items: ScheduleItem[]
  nextPage?: number
  previousPage?: number
  timezone: string
}

type ScheduleItem = {
  id: number
  media: AnilistMedia
  airingDayMs: number
  episode: number
}

async function loadSchedule({
  accessToken,
  page,
  timezone,
}: {
  accessToken?: string
  page: number
  timezone: string
}): Promise<ScheduleData> {
  const data = await anilistRequest<ScheduleQuery, ScheduleQueryVariables>({
    query: /* GraphQL */ `
      query Schedule($startDate: Int!, $page: Int!) {
        Page(page: $page, perPage: 30) {
          pageInfo {
            currentPage
            hasNextPage
          }
          airingSchedules(airingAt_greater: $startDate, sort: TIME) {
            id
            episode
            airingAt
            media {
              ...media
              mediaListEntry {
                ...mediaListEntry
              }
            }
          }
        }
      }
      ${mediaFragment}
      ${mediaListEntryFragment}
    `,
    variables: {
      page,
      startDate: startOfDayZoned(new Date(), timezone).getTime() / 1000,
    },
    accessToken,
  })

  const items: ScheduleItem[] = (data.Page?.airingSchedules ?? []).flatMap(
    (schedule) => {
      if (!schedule?.media) return []
      if (schedule.media.isAdult) return []
      return {
        id: schedule.id,
        episode: schedule.episode,
        airingDayMs: startOfDayZoned(
          schedule.airingAt * 1000,
          timezone,
        ).getTime(),
        media: extractMediaData(schedule.media, schedule.media?.mediaListEntry),
      }
    },
  )

  return {
    ...resolvePageInfo(data.Page?.pageInfo ?? {}),
    items,
    timezone,
  }
}

export const meta: MetaFunction = () => getAppMeta("Schedule")

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)
  const timezone = await getTimezone(request)

  const schedule = loadSchedule({
    page: resolvePageParam(
      new URL(request.url).searchParams.get("page") ?? "1",
    ),
    timezone,
    accessToken: session?.accessToken,
  })

  return deferred({
    schedule: shouldDefer(request) ? schedule : await schedule,
  })
}

export default function Schedule() {
  const { schedule } = useLoaderDataTyped<typeof loader>()
  return (
    <Deferred<ScheduleData> value={schedule} fallback={<GridSkeleton />}>
      {(data) => (
        <>
          <ScheduleItems schedule={data} />
          <Pagination schedule={data} />
        </>
      )}
    </Deferred>
  )
}

function ScheduleItems({ schedule }: { schedule: ScheduleData }) {
  return (
    <WeekdaySectionedList
      items={schedule.items}
      timezone={schedule.timezone}
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
  )
}

function Pagination({ schedule }: { schedule: ScheduleData }) {
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
          data-testid="schedule-pagination-previous"
          prefetch="intent"
        >
          <KeyboardKey label="Left arrow">
            <ArrowSmLeftIcon className="w-5" />
          </KeyboardKey>
          Previous Page
        </Link>
      ) : undefined}
      {schedule.nextPage != undefined ? (
        <Link
          to={`?page=${schedule.nextPage}`}
          className={clearButtonClass}
          data-testid="schedule-pagination-next"
          prefetch="intent"
        >
          <KeyboardKey label="Right arrow">
            <ArrowSmRightIcon className="w-5" />
          </KeyboardKey>
          Next Page
        </Link>
      ) : undefined}
    </div>
  )
}
