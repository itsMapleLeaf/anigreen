import { json } from "remix"
import { getSession } from "~/auth/session.server"
import { raise } from "~/helpers/errors"

export async function requireSession(request: Request) {
  return (
    (await getSession(request)) ?? raise(json({ error: "Not logged in" }, 401))
  )
}
