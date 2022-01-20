import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { redirect } from "remix"
import { anilistClient } from "~/anilist/anilist-client.server"
import {
  DeleteMediaListEntryDocument,
  MediaListStatus,
  SetMediaListStatusDocument,
} from "~/anilist/graphql.out"
import { getSession } from "~/auth/session.server"
import { raise } from "~/helpers/errors"
import { includes } from "~/helpers/includes"

export function loader() {
  return redirect("/schedule", 303)
}

export async function action({ request, params }: DataFunctionArgs) {
  const session = await getSession(request)
  if (!session) {
    return new Response("", { status: 401 })
  }

  const method = request.method.toLowerCase()
  const body = await request.formData()

  if (method === "put") {
    const status = body.get("status")

    const allowedStatuses = [
      MediaListStatus.Current,
      MediaListStatus.Paused,
      MediaListStatus.Dropped,
    ]

    if (!includes(allowedStatuses, status)) {
      return new Response("", {
        status: 400,
        statusText: `Status not allowed: ${status}`,
      })
    }

    await anilistClient.request({
      document: SetMediaListStatusDocument,
      variables: {
        mediaId: Number(params.id),
        status,
      },
      accessToken: session.accessToken,
    })

    return redirect("/schedule", 303)
  }

  if (method === "delete") {
    const mediaListId =
      Number(body.get("mediaListId")) ??
      raise(
        new Response("", {
          status: 400,
          statusText: `medialistId not defined`,
        }),
      )

    await anilistClient.request({
      document: DeleteMediaListEntryDocument,
      variables: { id: mediaListId },
      accessToken: session.accessToken,
    })

    return redirect("/schedule", 303)
  }

  return new Response("", { status: 405 })
}
