import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { z } from "zod"
import { MediaListStatus } from "~/modules/anilist/graphql"
import { requireSession } from "~/modules/auth/require-session"
import { parsePositiveInteger } from "~/modules/common/parse-positive-integer"
import { setMediaListEntryStatus } from "~/modules/media/media-data"
import { requireValidBody } from "~/modules/network/require-valid-body"

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
  await setMediaListEntryStatus({ ...body, accessToken: session.accessToken })
  return ""
}
