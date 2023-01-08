import type { DataFunctionArgs, MetaFunction } from "@remix-run/node"
import { defer } from "@remix-run/node"
import { Await, useLoaderData } from "@remix-run/react"
import { Suspense } from "react"
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
import { getAppMeta } from "~/modules/meta"
import { shouldDefer } from "~/modules/remix/no-defer"
import { GridSection } from "~/modules/ui/grid-section"
import { GridSkeleton } from "~/modules/ui/grid-skeleton"
import { SystemMessage } from "~/modules/ui/system-message"
import { WeekdaySectionedList } from "~/modules/ui/weekday-sectioned-list"

export const meta: MetaFunction = () => getAppMeta("Watching")

async function loadWatchingItems(accessToken: string): Promise<AnilistMedia[]> {
  const user = await loadViewerUser(accessToken)

  const data = await anilistRequest<WatchingQuery, WatchingQueryVariables>({
    query: /* GraphQL */ `
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

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)

  const result = promiseAllObject({
    timezone: getTimezone(request),
    watchingItems: session && loadWatchingItems(session.accessToken),
  })

  return defer({
    data: Promise.resolve(shouldDefer(request) ? result : await result),
  })
}

export default function WatchingPage() {
  const { data } = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<GridSkeleton />}>
      <Await resolve={data}>
        {(data) =>
          data.watchingItems ? (
            <>
              <GridSection
                title="In progress"
                subtitle="Catch up on some leftovers"
              >
                {data.watchingItems.filter(isInProgress).map((media) => (
                  <MediaCard key={media.id} media={media} hideWatchingStatus />
                ))}
              </GridSection>
              <WeekdaySectionedList
                items={data.watchingItems}
                timezone={data.timezone}
                getItemKey={(media) => media.id}
                getItemDate={(media) => media.nextEpisodeAiringTime}
                renderItem={(media) => (
                  <MediaCard media={media} hideWatchingStatus />
                )}
              />
            </>
          ) : (
            <SystemMessage>
              <p>you need to be logged in to see this page, sorry!</p>
            </SystemMessage>
          )
        }
      </Await>
    </Suspense>
  )
}

function isInProgress(media: AnilistMedia) {
  // no currentEpisode could mean the anime is not airing yet, or that it's unending
  // but we won't account for unending anime for now
  if (media.currentEpisode == undefined) return false
  return (media.watchListEntry?.progress ?? 0) < media.currentEpisode
}
