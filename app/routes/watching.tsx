import type { DataFunctionArgs } from "@remix-run/server-runtime"
import {} from "remix"
import { anilistClient } from "~/anilist/anilist-client.server"
import { ViewerDocument, WatchingDocument } from "~/anilist/graphql.out"
import { getSession } from "~/auth/session.server"
import { getTimezone } from "~/dates/timezone-cookie.server"
import { promiseAllObject } from "~/helpers/promise-all-object"
import type { MediaResource } from "~/media/media"
import { createMediaResource } from "~/media/media"
import { MediaCard } from "~/media/media-card"
import { responseTyped, useLoaderDataTyped } from "~/remix-typed"
import { GridSection } from "~/ui/grid-section"
import { WeekdaySectionedList } from "~/ui/weekday-sectioned-list"

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)
  if (!session) {
    throw responseTyped("", { status: 401, statusText: "not logged in" })
  }

  const viewer = await anilistClient.request({
    document: ViewerDocument,
    accessToken: session.accessToken,
  })

  const userId = viewer.Viewer?.id
  if (!userId) {
    throw responseTyped("", { status: 500, statusText: "user id not found" })
  }

  const results = await promiseAllObject({
    timezone: getTimezone(request),
    watching: anilistClient.request({
      document: WatchingDocument,
      variables: { userId },
      accessToken: session.accessToken,
    }),
  })

  return {
    timezone: results.timezone,
    watchingItems:
      results.watching.MediaListCollection?.lists
        ?.flatMap((list) => list?.entries ?? [])
        .flatMap((entry) =>
          entry?.media ? createMediaResource(entry.media, entry) : [],
        ) ?? [],
  }
}

export default function WatchingPage() {
  const data = useLoaderDataTyped<typeof loader>()

  return (
    <>
      <GridSection title="In progress" subtitle="Catch up on the leftovers">
        {data.watchingItems.filter(isInProgress).map((media) => (
          <MediaCard key={media.id} media={media} hideWatchingStatus />
        ))}
      </GridSection>
      <WeekdaySectionedList
        items={data.watchingItems}
        timezone={data.timezone}
        getItemKey={(media) => media.id}
        getItemDate={(media) => media.nextAiringEpisode?.airingAtMs}
        renderItem={(media) => <MediaCard media={media} hideWatchingStatus />}
      />
    </>
  )
}

function isInProgress(media: MediaResource) {
  // if it's endless, it's always in progress (conan pls)
  if (media.episodeCount == undefined) return true

  const progress = media.watchListInfo?.progress ?? 0

  const currentEpisode = media.nextAiringEpisode
    ? media.nextAiringEpisode.episode - 1
    : media.episodeCount

  return progress < currentEpisode
}
