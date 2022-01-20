import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { z } from "zod"
import { anilistClient } from "~/anilist/anilist-client.server"
import {
  MediaListStatus,
  SetWatchingStatusDocument,
} from "~/anilist/graphql.out"
import { requireSession } from "~/auth/require-session"
import { parsePositiveInteger } from "~/helpers/parse-positive-integer"
import { requireValidBody } from "~/network/require-valid-body"

const bodySchema = z.object({
  mediaId: z.string().transform(parsePositiveInteger),
  status: z.union([
    z.literal(MediaListStatus.Current),
    z.literal(MediaListStatus.Paused),
    z.literal(MediaListStatus.Dropped),
  ]),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = await requireValidBody(request, bodySchema)

  await anilistClient.request({
    document: SetWatchingStatusDocument,
    variables: body,
    accessToken: session.accessToken,
  })

  return ""
}
