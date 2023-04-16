import type { ActionFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
import { $path } from "remix-routes"
import { destroyAnilistSession } from "~/anilist"

export const action: ActionFunction = async () =>
  redirect($path("/"), {
    headers: { "Set-Cookie": await destroyAnilistSession() },
    status: 303,
  })
