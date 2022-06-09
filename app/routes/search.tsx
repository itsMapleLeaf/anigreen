import { SearchIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
import type {
  SearchQuery,
  SearchQueryVariables,
} from "~/generated/anilist-graphql"
import { resolvePageInfo, resolvePageParam } from "~/modules/anilist/paging"
import { anilistRequest } from "~/modules/anilist/request.server"
import { MediaCard } from "~/modules/media/media-card"
import type { AnilistMedia } from "~/modules/media/media-data"
import {
  extractMediaData,
  mediaFragment,
  mediaListEntryFragment,
} from "~/modules/media/media-data"
import { jsonTyped, useLoaderDataTyped } from "~/modules/remix-typed"
import { GridSection } from "~/modules/ui/grid-section"

export async function loader({ request }: DataFunctionArgs) {
  const params = Object.fromEntries(new URL(request.url).searchParams)
  if (!params.query) {
    return jsonTyped({ search: undefined, query: undefined })
  }

  const data = await anilistRequest<SearchQuery, SearchQueryVariables>({
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
    variables: {
      page: resolvePageParam(params.page || "1"),
      query: params.query,
    },
  })

  const items: AnilistMedia[] = (data.Page?.media ?? []).flatMap((media) => {
    if (!media) return []
    return extractMediaData(media, media?.mediaListEntry)
  })

  return jsonTyped({
    search: {
      items,
      ...resolvePageInfo(data.Page?.pageInfo ?? {}),
    },
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
    <GridSection title={`Results for "${query}"`}>
      {search.items.map((item) => (
        <MediaCard key={item.id} media={item} />
      ))}
    </GridSection>
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
