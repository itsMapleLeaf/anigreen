import { getAnilistSession } from "./anilist-session"

type RequestOptions<Variables> = Variables extends { [key: string]: never }
  ? { query: string }
  : { query: string; variables: Variables }

export async function anilistRequest<ResponseData, Variables>(
  request: Request,
  options: RequestOptions<Variables>,
) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
  })

  const session = await getAnilistSession(request)
  if (session) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers,
    body: JSON.stringify(options),
  })

  if (response.status === 429) {
    const retryAfterHeader = response.headers.get("Retry-After")

    const retryAfter = retryAfterHeader
      ? `after ${retryAfterHeader} seconds`
      : "later"

    throw new Response(undefined, {
      status: 500,
      statusText: `Rate limited by AniList, try again ${retryAfter}.`,
    })
  }

  const result = (await response.json()) as {
    data: ResponseData | null
    errors?: Array<{ message: string; status: number }>
  }

  if (result.errors || result.data === null) {
    const errorMessages =
      result.errors?.map((error) => error.message)?.join("\n") ??
      "Unknown error"

    throw new Response(undefined, {
      status: 500,
      statusText: `Error from AniList:\n${errorMessages}`,
    })
  }

  return result.data
}
