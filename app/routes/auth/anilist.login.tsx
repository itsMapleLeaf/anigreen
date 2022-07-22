import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { env } from "~/modules/env.server"

export const loader: ActionFunction = () => {
  const params = new URLSearchParams({
    client_id: env.ANILIST_CLIENT_ID,
    redirect_uri: env.ANILIST_REDIRECT_URI,
    response_type: "code",
  })
  return redirect(`https://anilist.co/api/v2/oauth/authorize?${params}`)
}
