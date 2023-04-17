import { redirect, type LoaderArgs } from "@vercel/remix"
import { createAnilistSession } from "../anilist-session"

export async function loader({ request }: LoaderArgs) {
  return redirect("/", {
    headers: {
      "Set-Cookie": await createAnilistSession(request.url),
    },
  })
}
