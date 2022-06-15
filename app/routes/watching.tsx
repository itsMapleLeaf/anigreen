import type { DataFunctionArgs, MetaFunction } from "@remix-run/node"
import { DeferredTyped, deferredTyped, useLoaderDataTyped } from "remix-typed"
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

  return deferredTyped({
    data: shouldDefer(request) ? result : await result,
  })
}

export default function WatchingPage() {
  const { data } = useLoaderDataTyped<typeof loader>()

  return (
    <DeferredTyped data={data} fallback={<GridSkeleton />}>
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
    </DeferredTyped>
  )
}

function isInProgress(media: AnilistMedia) {
  return (
    media.currentEpisode == undefined || // if it's endless, it's always in progress (conan pls)
    (media.watchListEntry?.progress ?? 0) < media.currentEpisode
  )
}
