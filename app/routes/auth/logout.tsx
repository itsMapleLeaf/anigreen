import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { $path } from "remix-routes"
import { destroySession } from "~/modules/auth/session.server"

export const action: ActionFunction = async () => {
  return redirect($path("/"), {
    headers: { "Set-Cookie": await destroySession() },
    status: 303,
  })
}
