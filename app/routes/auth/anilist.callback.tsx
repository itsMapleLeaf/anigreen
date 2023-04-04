import type { LoaderFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
import { $path } from "remix-routes"
import { createAnilistSession } from "~/modules/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect($path("/"), {
    headers: { "Set-Cookie": await createAnilistSession(request.url) },
    status: 303,
  })
}
