import { delay } from "../common/delay"

type AnyRecord = { [key: string]: unknown }

type RequestOptions<Variables extends AnyRecord> = {
  query: string
  accessToken?: string
} & RequestVariables<Variables>

// prettier-ignore
type RequestVariables<Variables> =
  Variables extends { [key: string]: never }
    ? { variables?: undefined }
    : { variables: Variables }

export async function anilistRequest<
  Result extends AnyRecord,
  Variables extends AnyRecord,
>(options: RequestOptions<Variables>): Promise<Result> {
  const { query, variables, accessToken } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }

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
      return anilistRequest(options)
    }
  }

  const json = (await response.json()) as
    | { data: Result }
    | { errors: Array<{ message: string }> }

  if ("errors" in json) {
    console.warn("errors:", JSON.stringify(json.errors, undefined, 2))
    throw AnilistRequestError.fromResponse(response, json, query, variables)
  }

  return json.data
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
