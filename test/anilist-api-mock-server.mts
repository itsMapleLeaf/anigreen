import { graphql } from "msw"
import { setupServer } from "msw/node"
import type {
  ScheduleQuery,
  ScheduleQueryVariables,
} from "~/generated/anilist-graphql"

export const anilistApiMockServer = setupServer(
  graphql.query<ScheduleQuery, ScheduleQueryVariables>(
    "Schedule",
    (request, response, context) => {
      return response(context.data({ Page: { airingSchedules: [] } }))
    },
  ),
)
