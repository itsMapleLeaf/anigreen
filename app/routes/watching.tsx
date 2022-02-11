import type { DataFunctionArgs } from "@remix-run/server-runtime"
import gql from "graphql-tag"
import { useLoaderDataTyped } from "remix-typed"
import type {
  WatchingQuery,
  WatchingQueryVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { loadViewerUser } from "~/modules/anilist/user"
import { getSession } from "~/modules/auth/session.server"
import { promiseAllObject } from "~/modules/common/promise-all-object"
import { getTimezone } from "~/modules/dates/timezone-cookie.server"
import { MediaCard } from "~/modules/media/media-card"
import type { AnilistMedia } from "~/modules/media/media-data"
import {
  extractMediaData,
  mediaFragment,
  mediaListEntryFragment,
} from "~/modules/media/media-data"
import { getAppTitle } from "~/modules/meta"
import { GridSection } from "~/modules/ui/grid-section"
import { SystemMessage } from "~/modules/ui/system-message"
import { WeekdaySectionedList } from "~/modules/ui/weekday-sectioned-list"

export const meta = () => ({
  title: getAppTitle("Watching"),
})

async function loadInProgressItems(
  accessToken: string,
): Promise<AnilistMedia[]> {
  const user = await loadViewerUser(accessToken)

  const data = await anilistRequest<WatchingQuery, WatchingQueryVariables>({
    document: gql`
      query Watching($userId: Int!) {
        MediaListCollection(
          userId: $userId
          type: ANIME
          forceSingleCompletedList: true
          status: CURRENT
        ) {
          lists {
            entries {
              ...mediaListEntry
              media {
                ...media
              }
            }
          }
        }
      }
      ${mediaFragment}
      ${mediaListEntryFragment}
    `,
    variables: { userId: user.id },
    accessToken,
  })

  const items: AnilistMedia[] = []
  for (const list of data.MediaListCollection?.lists ?? []) {
    for (const entry of list?.entries ?? []) {
      if (!entry?.media) continue
      items.push(extractMediaData(entry.media, entry))
    }
  }

  return items
}

async function loadRecentlyAiredItems() {
  const query = gql`
    query RecentlyAired($startDate: Int!, $endDate: Int!) {
      Page(perPage: 50) {
        airingSchedules(
          airingAt_greater: $startDate
          airingAt_lesser: $endDate
        ) {
          media {
            ...media
            mediaListEntry {
              ...mediaListEntry
            }
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  `
}

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)
  if (!session) {
    return { loggedIn: false as const }
  }

  return promiseAllObject({
    loggedIn: true as const,
    timezone: getTimezone(request),
    watchingItems: loadInProgressItems(session.accessToken),
  })
}

export default function WatchingPage() {
  const data = useLoaderDataTyped<typeof loader>()

  if (!data.loggedIn) {
    return (
      <SystemMessage>
        <p>you need to be logged in to see this page, sorry!</p>
      </SystemMessage>
    )
  }

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
