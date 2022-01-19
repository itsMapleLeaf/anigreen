import type { LoaderFunction } from "remix"
import { redirect } from "remix"
import { createAnilistSession } from "~/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/", {
    headers: { "Set-Cookie": await createAnilistSession(request.url) },
    status: 303,
  })
}
