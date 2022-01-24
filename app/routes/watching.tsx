import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { getSession } from "~/modules/auth/session.server"
import { promiseAllObject } from "~/modules/common/promise-all-object"
import { getTimezone } from "~/modules/dates/timezone-cookie.server"
import { MediaCard } from "~/modules/media/media-card"
import type { AnilistMedia } from "~/modules/media/media-data"
import { loadCurrentMedia } from "~/modules/media/media-data"
import { getAppTitle } from "~/modules/meta"
import { responseTyped, useLoaderDataTyped } from "~/modules/remix-typed"
import { GridSection } from "~/modules/ui/grid-section"
import { WeekdaySectionedList } from "~/modules/ui/weekday-sectioned-list"

export const meta = () => ({
  title: getAppTitle("Watching"),
})

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)
  if (!session) {
    throw responseTyped("", { status: 401, statusText: "not logged in" })
  }

  return promiseAllObject({
    timezone: getTimezone(request),
    watchingItems: loadCurrentMedia(session.accessToken),
  })
}

export default function WatchingPage() {
  const data = useLoaderDataTyped<typeof loader>()
  return (
    <>
      <GridSection title="In progress" subtitle="Catch up on some leftovers">
        {data.watchingItems.filter(isInProgress).map((media) => (
          <MediaCard key={media.id} media={media} hideWatchingStatus />
        ))}
      </GridSection>
      <WeekdaySectionedList
        items={data.watchingItems}
        timezone={data.timezone}
        getItemKey={(media) => media.id}
        getItemDate={(media) => media.nextEpisodeAiringTime}
        renderItem={(media) => <MediaCard media={media} hideWatchingStatus />}
      />
    </>
  )
}

function isInProgress(media: AnilistMedia) {
  return (
    media.currentEpisode == undefined || // if it's endless, it's always in progress (conan pls)
    (media.watchListEntry?.progress ?? 0) < media.currentEpisode
  )
}
