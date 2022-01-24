import { createCookie } from "remix"
import { raise } from "~/modules/common/errors"

const cookie = createCookie("timezone", {
  secrets: [process.env.COOKIE_SECRET ?? raise("COOKIE_SECRET not set")],
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
