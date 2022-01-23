import type { DataFunctionArgs } from "@remix-run/server-runtime"
import {} from "remix"
import { anilistClient } from "~/anilist/anilist-client.server"
import { ViewerDocument, WatchingDocument } from "~/anilist/graphql.out"
import { getSession } from "~/auth/session.server"
import { getTimezone } from "~/dates/timezone-cookie.server"
import { createMediaResource } from "~/media/media"
import { MediaCard } from "~/media/media-card"
import { responseTyped, useLoaderDataTyped } from "~/remix-typed"
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

  const data = await anilistClient.request({
    document: WatchingDocument,
    variables: { userId },
    accessToken: session.accessToken,
  })

  const timezone = await getTimezone(request)

  return {
    timezone,
    mediaItems:
      data.MediaListCollection?.lists
        ?.flatMap((list) => list?.entries ?? [])
        .flatMap((entry) =>
          entry?.media ? createMediaResource(entry.media, entry) : [],
        ) ?? [],
  }
}

export default function WatchingPage() {
  const data = useLoaderDataTyped<typeof loader>()
  return (
    <WeekdaySectionedList
      items={data.mediaItems}
      timezone={data.timezone}
      getItemKey={(media) => media.id}
      getItemDate={(media) => media.nextAiringEpisode?.airingAtMs}
      renderItem={(media) => <MediaCard media={media} hideWatchingStatus />}
    />
  )
}
