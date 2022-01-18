import { startOfToday } from "date-fns"
import type { LoaderFunction, MetaFunction } from "remix"
import { useLoaderData } from "remix"
import { anilistClient } from "../anilist-client.server"
import type { ScheduleQuery } from "../graphql.out"
import { ScheduleDocument } from "../graphql.out"
import { getAppTitle } from "../meta"

export const meta: MetaFunction = () => ({
  title: getAppTitle("Schedule"),
})

type LoaderData = {
  schedule: ScheduleQuery
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const schedule = await anilistClient.request({
    document: ScheduleDocument,
    variables: {
      page: 1,
      startDate: startOfToday().getTime() / 1000,
    },
  })
  return { schedule }
}

export default function Schedule() {
  const data = useLoaderData<LoaderData>()
  return (
    <>
      <pre className="overflow-x-auto">
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </>
  )
}
