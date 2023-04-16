import { createCookie } from "@vercel/remix"
import { env } from "~/env"
import { raise } from "~/modules/common/errors"

const cookie = createCookie("session", {
  secrets: [env.COOKIE_SECRET],
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
      client_id: env.ANILIST_CLIENT_ID,
      client_secret: env.ANILIST_CLIENT_SECRET,
      redirect_uri: env.ANILIST_REDIRECT_URI,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Anilist auth error: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as { access_token: string }

  return cookie.serialize({
    accessToken: json.access_token,
  })
}

export async function getSession(
  request: Request,
): Promise<Session | undefined> {
  const session = (await cookie.parse(
    request.headers.get("cookie"),
  )) as Session | null
  return session ?? undefined
}

export function destroySession() {
  return cookie.serialize("", { maxAge: 0 })
}
