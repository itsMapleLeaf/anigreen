import { redirect } from "@vercel/remix"
import { destroyAnilistSession } from "../anilist-session"

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroyAnilistSession(),
    },
  })
}
