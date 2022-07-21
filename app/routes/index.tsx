import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { $path } from "remix-routes"
import { loadViewerUser } from "~/modules/anilist/user"
import { getSession } from "~/modules/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request)
  const user = session && (await loadViewerUser(session.accessToken))
  return redirect(user ? $path("/watching") : $path("/schedule"), 303)
}
