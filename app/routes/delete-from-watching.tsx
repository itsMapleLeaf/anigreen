import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { z } from "zod"
import { requireSession } from "~/modules/auth/require-session"
import { parsePositiveInteger } from "~/modules/common/parse-positive-integer"
import { deleteMediaListEntry } from "~/modules/media/media-data"
import { requireValidBody } from "~/modules/network/require-valid-body"

const bodySchema = z.object({
  mediaListId: z.string().transform(parsePositiveInteger),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = await requireValidBody(request, bodySchema)

  await deleteMediaListEntry({
    accessToken: session.accessToken,
    mediaListId: body.mediaListId,
  })

  return ""
}
