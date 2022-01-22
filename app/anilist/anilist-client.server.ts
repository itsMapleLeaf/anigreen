import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { print } from "graphql"
import { setTimeout } from "node:timers/promises"
import { inspect } from "node:util"

type RequestOptions<Result, Variables> = {
  document: TypedDocumentNode<Result, Variables>
  accessToken?: string
} & RequestVariables<Variables>

// prettier-ignore
type RequestVariables<Variables> =
  Variables extends { [key: string]: never }
    ? { variables?: undefined }
    : { variables: Variables }

// anilist has a limit of 90 requests per minute
const maxRequestCount = 90
const maxRequestTime = 1000 * 60

class AnilistClient {
  private requestTimestamps: number[] = []

  async request<Result, Variables>(
    options: RequestOptions<Result, Variables>,
  ): Promise<Result> {
    if (this.requestTimestamps.length >= maxRequestCount) {
      const lastRequestTimestamp = this.requestTimestamps[0]!
      const timeToWait = maxRequestTime - (Date.now() - lastRequestTimestamp)
      await setTimeout(timeToWait + 1000) // add a second as a safety buffer
      return this.request(options)
    }

    this.requestTimestamps = [
      ...this.requestTimestamps.slice(-maxRequestCount),
      Date.now(),
    ]

    return requestGraphQL(options)
  }
}

async function requestGraphQL<Result, Variables>(
  options: RequestOptions<Result, Variables>,
) {
  const { document, variables, accessToken } = options

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
    body: JSON.stringify({ query: print(document), variables }),
  })

  if (!response.ok) {
    raiseRequestError(
      document,
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
      document,
      variables,
      response,
      json.errors[0]?.message || response.statusText || "Unknown error",
    )
  }

  return json.data
}

function raiseRequestError(
  document: TypedDocumentNode<any, any>,
  variables: unknown,
  response: Response,
  message: string,
): never {
  console.warn("query:", print(document))
  console.warn(
    "variables:",
    inspect(variables, { depth: Number.POSITIVE_INFINITY }),
  )
  throw new Error(
    `Anilist request failed (status ${response.status}): ${message}`,
  )
}

export const anilistClient = new AnilistClient()
