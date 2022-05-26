import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { createAnilistSession } from "~/modules/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/", {
    headers: { "Set-Cookie": await createAnilistSession(request.url) },
    status: 303,
  })
}
