import { json } from "remix"
import { getSession } from "~/modules/auth/session.server"
import { raise } from "~/modules/common/errors"

export async function requireSession(request: Request) {
  return (
    (await getSession(request)) ?? raise(json({ error: "Not logged in" }, 401))
  )
}
