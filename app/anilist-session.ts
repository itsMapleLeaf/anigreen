import { createCookie } from "@vercel/remix"
import { z } from "zod"
import { env } from "./env"
import { raise } from "./helpers/errors"

const sessionCookie = createCookie("anilist_session", {
  secrets: [env.COOKIE_SECRET],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
})

const sessionSchema = z.object({ accessToken: z.string() }).or(z.null())

type AnilistSession = z.infer<typeof sessionSchema>

export async function createAnilistSession(requestUrl: string) {
  const code =
    new URL(requestUrl).searchParams.get("code") ??
    raise("Anilist auth error: code not found in request url")

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

  const session: AnilistSession = {
    accessToken: json.access_token,
  }

  return sessionCookie.serialize(session)
}

export function destroyAnilistSession() {
  return sessionCookie.serialize(null)
}

export async function getAnilistSession(request: Request) {
  const result = sessionSchema.safeParse(
    await sessionCookie.parse(request.headers.get("Cookie")),
  )
  return (result.success && result.data) || null
}
