import { createCookie } from "remix"
import { raise } from "./helpers/errors"

const cookie = createCookie("session", {
  secrets: [process.env.COOKIE_SECRET ?? raise("COOKIE_SECRET not set")],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
})

export type Session = {
  accessToken: string
}

export async function createAnilistSession(authCallbackUrl: string) {
  const code =
    new URL(authCallbackUrl).searchParams.get("code") ??
    raise("Anilist auth error: code not found in auth callback url")

  const response = await fetch("https://anilist.co/api/v2/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.ANILIST_REDIRECT_URI,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Anilist auth error: ${response.status} ${response.statusText}`,
    )
  }

  const json = await response.json()

  return cookie.serialize({
    accessToken: json.access_token,
  })
}

export function getSession(request: Request): Promise<Session | null> {
  return cookie.parse(request.headers.get("cookie"))
}

export function destroySession() {
  return cookie.serialize("", { maxAge: 0 })
}
