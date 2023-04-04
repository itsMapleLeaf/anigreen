import type { ActionFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
import { raise } from "~/modules/common/errors"

export const loader: ActionFunction = () => {
  const params = new URLSearchParams({
    client_id:
      process.env.ANILIST_CLIENT_ID ?? raise("ANILIST_CLIENT_ID not defined"),
    redirect_uri:
      process.env.ANILIST_REDIRECT_URI ??
      raise("ANILIST_REDIRECT_URI not defined"),
    response_type: "code",
  })
  return redirect(
    `https://anilist.co/api/v2/oauth/authorize?${params.toString()}`,
  )
}
