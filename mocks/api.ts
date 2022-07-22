import { graphql } from "msw"
import { setupServer } from "msw/node"
import type {
  ScheduleQuery,
  ScheduleQueryVariables,
} from "../app/generated/anilist-graphql"
import schedule from "./fixtures/schedule.json"

const anilistApiMockServer = setupServer(
  graphql.query<ScheduleQuery, ScheduleQueryVariables>(
    "Schedule",
    (request, response, context) => {
      const page = schedule.pages[request.variables.page - 1]
      if (!page) {
        return response(
          context.errors([{ message: "Page not found", path: ["page"] }]),
          context.status(404),
        )
      }
      return response(context.data(page as unknown as ScheduleQuery))
    },
  ),
)

if (process.env.NODE_ENV === "test") {
  anilistApiMockServer.listen()
}
