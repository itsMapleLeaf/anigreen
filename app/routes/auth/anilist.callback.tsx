import type { LoaderFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
import { $path } from "remix-routes"
import { createAnilistSession } from "~/anilist"

export const loader: LoaderFunction = async ({ request }) =>
  redirect($path("/"), {
    headers: { "Set-Cookie": await createAnilistSession(request.url) },
    status: 303,
  })
