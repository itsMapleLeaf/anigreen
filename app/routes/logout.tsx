import type { ActionFunction } from "remix"
import { redirect } from "remix"
import { destroySession } from "../auth/session.server"

export const action: ActionFunction = async () => {
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession() },
    status: 303,
  })
}
