import { createCookie } from "@remix-run/node"
import { env } from "../env.server"

const cookie = createCookie("timezone", {
  secrets: [env.COOKIE_SECRET],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
})

const defaultTimezone = "America/Chicago"

export async function getTimezone(request: Request): Promise<string> {
  const value = await cookie.parse(request.headers.get("cookie"))
  return value || defaultTimezone
}

export function setTimezone(timezone: string) {
  return cookie.serialize(timezone)
}
