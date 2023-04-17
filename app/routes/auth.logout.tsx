import { redirect } from "@remix-run/node"
import { destroyAnilistSession } from "../anilist-session"

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroyAnilistSession(),
    },
  })
}
