import { SearchIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/node"
import { defer } from "@remix-run/node"
import { Await, Form, useLoaderData, useNavigate } from "@remix-run/react"
import { Suspense } from "react"
import type { NavigateOptions, To } from "react-router"
import { $path } from "remix-routes"
import type {
  MediaListEntryFragment,
  SearchQuery,
  SearchQueryVariables,
  SearchWatchingQuery,
  SearchWatchingQueryVariables,
} from "~/generated/anilist-graphql"
import { resolvePageInfo, resolvePageParam } from "~/modules/anilist/paging"
import { anilistRequest } from "~/modules/anilist/request.server"
import { loadViewerUser } from "~/modules/anilist/user"
import { getSession } from "~/modules/auth/session.server"
import { MediaCard } from "~/modules/media/media-card"
import type { AnilistMedia } from "~/modules/media/media-data"
import {
  extractMediaData,
  mediaFragment,
  mediaListEntryFragment,
} from "~/modules/media/media-data"
import { shouldDefer } from "~/modules/remix/no-defer"
import { useDebouncedCallback } from "~/modules/state/use-debounced-callback"
import { GridSection } from "~/modules/ui/grid-section"
import { GridSkeleton } from "~/modules/ui/grid-skeleton"

async function loadSearchResults(
  query: string,
  page: number,
  accessToken: string | undefined,
) {
  const searchResult = await anilistRequest<SearchQuery, SearchQueryVariables>({
    query: /* GraphQL */ `
      query Search($query: String!, $page: Int!) {
        Page(page: $page, perPage: 30) {
          pageInfo {
            currentPage
            hasNextPage
          }
          media(search: $query, type: ANIME, isAdult: false) {
            ...media
            mediaListEntry {
              ...mediaListEntry
            }
          }
        }
      }
      ${mediaFragment}
      ${mediaListEntryFragment}
    `,
    variables: { page, query },
  })

  const user = accessToken ? await loadViewerUser(accessToken) : undefined

  // search doesn't include watch list info, so we have to query it separately
  const searchWatchingResult =
    user && accessToken
      ? await anilistRequest<SearchWatchingQuery, SearchWatchingQueryVariables>(
          {
            query: /* GraphQL */ `
              query SearchWatching($userId: Int!) {
                MediaListCollection(
                  userId: $userId
                  type: ANIME
                  forceSingleCompletedList: true
                  status: CURRENT
                ) {
                  lists {
                    entries {
                      ...mediaListEntry
                      mediaId
                    }
                  }
                }
              }
              ${mediaListEntryFragment}
            `,
            variables: { userId: user.id },
            accessToken,
          },
        )
      : undefined

  const mediaListEntriesByMediaId = new Map<number, MediaListEntryFragment>()
  for (const list of searchWatchingResult?.MediaListCollection?.lists ?? []) {
    for (const entry of list?.entries ?? []) {
      if (!entry?.mediaId) continue
      mediaListEntriesByMediaId.set(entry.mediaId, entry)
    }
  }

  const items: AnilistMedia[] = (searchResult.Page?.media ?? []).flatMap(
    (media) => {
      if (!media) return []
      return extractMediaData(media, mediaListEntriesByMediaId.get(media.id))
    },
  )

  return {
    items,
    ...resolvePageInfo(searchResult.Page?.pageInfo ?? {}),
  }
}

export async function loader({ request }: DataFunctionArgs) {
  const params = Object.fromEntries(new URL(request.url).searchParams)

  // eslint-disable-next-line unicorn/no-null
  let results = null
  if (params.query) {
    const session = await getSession(request)
    results = loadSearchResults(
      params.query,
      resolvePageParam(params.page || "1"),
      session?.accessToken,
    )
  }

  return defer({
    query: params.query,
    search: Promise.resolve(shouldDefer(request) ? results : await results),
  })
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<GridSkeleton />}>
      <Await resolve={data.search}>
        {(search) =>
          search ? (
            <GridSection title={`Results for "${data.query}"`}>
              {search.items.map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </GridSection>
          ) : (
            <p className="text-xl opacity-50 italic font-light text-center">
              Enter a search term to get started!
            </p>
          )
        }
      </Await>
    </Suspense>
  )
}

export function SearchInput() {
  const navigate = useNavigate()

  const navigateDebounced =
    // it infers the wrong overload by default
    useDebouncedCallback<(to: To, options?: NavigateOptions) => void>(navigate)

  return (
    <Form className="contents" method="get" action="/search">
      <input
        type="search"
        name="query"
        className="bg-black/50 leading-none pr-3 py-3 pl-10 rounded w-full font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Search..."
        onChange={(event) => {
          const query = event.target.value.trim()
          if (query) {
            navigateDebounced($path("/search", { query }), {
              replace: true,
            })
          } else {
            navigateDebounced.cancel()
          }
        }}
        onKeyDown={(event) => {
          // prevent a double navigation
          if (event.key === "Enter") {
            navigateDebounced.cancel()
          }
        }}
      />
      <SearchIcon className="w-5 absolute left-3 top-3" />
    </Form>
  )
}
