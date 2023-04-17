import { redirect, type LoaderArgs } from "@remix-run/node"
import { createAnilistSession } from "../anilist-session"

export async function loader({ request }: LoaderArgs) {
  return redirect("/", {
    headers: {
      "Set-Cookie": await createAnilistSession(request.url),
    },
  })
}
