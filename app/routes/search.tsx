import { SearchIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
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
import {
  DeferredTyped,
  deferredTyped,
  jsonTyped,
  useLoaderDataTyped,
} from "~/modules/remix-typed"
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
  if (!params.query) {
    return jsonTyped({ search: undefined, query: undefined })
  }

  const session = await getSession(request)

  return deferredTyped({
    search: loadSearchResults(
      params.query,
      resolvePageParam(params.page || "1"),
      session?.accessToken,
    ),
    query: params.query,
  })
}

export default function SearchPage() {
  const { query, search } = useLoaderDataTyped<typeof loader>()

  if (search === undefined) {
    return (
      <p className="text-xl opacity-50 italic font-light text-center">
        enter a search term to get started!
      </p>
    )
  }

  return (
    <DeferredTyped data={search} fallback={<GridSkeleton />}>
      {(search) => (
        <GridSection title={`Results for "${query}"`}>
          {search.items.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </GridSection>
      )}
    </DeferredTyped>
  )
}

export function SearchInput() {
  return (
    <Form className="contents" method="get" action="/search">
      <input
        type="search"
        name="query"
        className="bg-black/50 leading-none pr-3 py-3 pl-10 rounded w-full font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Search..."
      />
      <SearchIcon className="w-5 absolute left-3 top-3" />
    </Form>
  )
}
