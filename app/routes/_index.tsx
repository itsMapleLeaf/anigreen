import { Await, useLoaderData } from "@remix-run/react"
import { defer } from "@vercel/remix"
import { Suspense } from "react"
import { anilistRequest } from "../anilist"
import {
  type MediaSeason,
  type ScheduleQuery,
  type ScheduleQueryVariables,
} from "../anilist-graphql"

function getCurrentSeason(): MediaSeason {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return "SPRING"
  if (month >= 6 && month <= 8) return "SUMMER"
  if (month >= 9 && month <= 11) return "FALL"
  return "WINTER"
}

export function loader() {
  const season = getCurrentSeason()
  const year = new Date().getFullYear()

  const data = anilistRequest<ScheduleQuery, ScheduleQueryVariables>({
    query: /* GraphQL */ `
      query Schedule($season: MediaSeason, $year: Int) {
        Page(page: 1, perPage: 10) {
          pageInfo {
            hasNextPage
          }
          media(
            type: ANIME
            format_in: [TV, TV_SHORT, MOVIE]
            season: $season
            seasonYear: $year
            sort: POPULARITY_DESC
          ) {
            id
            title {
              english
              native
              romaji
            }
          }
        }
      }
    `,
    variables: {
      season,
      year,
    },
  })
  return defer({ data })
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>()
  return (
    <main>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={data}>
          {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
        </Await>
      </Suspense>
    </main>
  )
}
