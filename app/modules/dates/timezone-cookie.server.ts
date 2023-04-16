import { createCookie } from "@vercel/remix"
import { env } from "~/env"

const cookie = createCookie("timezone", {
  secrets: [env.COOKIE_SECRET],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
})

const defaultTimezone = "America/Chicago"

export async function getTimezone(request: Request): Promise<string> {
  const value = (await cookie.parse(request.headers.get("cookie"))) as
    | string
    | null
  return value || defaultTimezone
}

export function setTimezone(timezone: string) {
  return cookie.serialize(timezone)
}
