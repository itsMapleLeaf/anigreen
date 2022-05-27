import type { DocumentNode } from "graphql"
import { print } from "graphql"
import { setTimeout } from "node:timers/promises"
import { inspect } from "node:util"

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
      await setTimeout(retryAfterSeconds * 1000)
      return anilistRequest(options)
    }
  }

  if (!response.ok) {
    raiseRequestError(
      query,
      variables,
      response,
      response.statusText || "Unknown error",
    )
  }

  const json = await response.json()
  if (json.errors) {
    console.warn(
      "errors:",
      inspect(json.errors, { depth: Number.POSITIVE_INFINITY }),
    )
    raiseRequestError(
      query,
      variables,
      response,
      json.errors[0]?.message || response.statusText || "Unknown error",
    )
  }

  return json.data
}

function raiseRequestError(
  query: string,
  variables: unknown,
  response: Response,
  message: string,
): never {
  console.warn("query:", query)
  console.warn(
    "variables:",
    inspect(variables, { depth: Number.POSITIVE_INFINITY }),
  )
  throw new Error(
    `Anilist request failed (status ${response.status}): ${message}`,
  )
}
