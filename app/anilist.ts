import { createCookie } from "@vercel/remix"
import { z } from "zod"
import { env } from "~/env"
import { delay } from "~/modules/common/delay"
import { raise } from "~/modules/common/errors"

type AnyRecord = { [key: string]: unknown }

type RequestOptions<Variables extends AnyRecord> =
  RequestVariables<Variables> & { query: string }

type RequestVariables<Variables> = Variables extends { [key: string]: never }
  ? { variables?: undefined }
  : { variables: Variables }

type RequestResult<Data> =
  | { data: Data; response: Response }
  | { errors: Array<{ message: string }>; response: Response }

const sessionCookie = createCookie("anilist_session", {
  secrets: [env.COOKIE_SECRET],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
})

const sessionSchema = z.object({ accessToken: z.string() }).or(z.null())

function getAccessToken(request: Request) {
  const result = sessionSchema.safeParse(
    sessionCookie.parse(request.headers.get("cookie")),
  )
  if (result.success) return result.data?.accessToken

  console.warn("Invalid session:", result.error)
  return undefined
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

  return sessionCookie.serialize({
    accessToken: json.access_token,
  })
}

export function destroyAnilistSession() {
  return sessionCookie.serialize("", { maxAge: 0 })
}

export function createAnilistLoginUrl() {
  const params = new URLSearchParams({
    client_id: env.ANILIST_CLIENT_ID,
    redirect_uri: env.ANILIST_REDIRECT_URI,
    response_type: "code",
  })
  return `https://anilist.co/api/v2/oauth/authorize?${params.toString()}`
}

export async function anilistRequest<
  ResponseData extends AnyRecord,
  Variables extends AnyRecord,
>(
  request: Request,
  options: RequestOptions<Variables>,
): Promise<RequestResult<ResponseData>> {
  const { query, variables } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }

  const accessToken = getAccessToken(request)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (response.status === 429) {
    const retryAfterSeconds = Number(response.headers.get("retry-after"))
    if (Number.isFinite(retryAfterSeconds)) {
      await delay(retryAfterSeconds * 1000)
      return anilistRequest(request, options)
    }
  }

  const result = (await response.json()) as
    | { data: ResponseData }
    | { errors: Array<{ message: string }> }

  return { ...result, response }
}

export class AnilistRequestError extends Error {
  private constructor(
    message: string,
    public response: Response,
    public query: string,
    public variables: unknown,
  ) {
    super(message)
  }

  static fromResponse(
    response: Response,
    json: { errors: Array<{ message: string }> },
    query: string,
    variables: unknown,
  ): AnilistRequestError {
    const message =
      json.errors[0]?.message || response.statusText || "Unknown error"

    return new AnilistRequestError(
      `Anilist request failed (status ${response.status}): ${message}`,
      response,
      query,
      variables,
    )
  }
}
