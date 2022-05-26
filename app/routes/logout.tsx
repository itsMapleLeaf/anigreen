import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { destroySession } from "../modules/auth/session.server"

export const action: ActionFunction = async () => {
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession() },
    status: 303,
  })
}
