import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { print } from "graphql"
import { setTimeout } from "node:timers/promises"

type RequestOptions<Result, Variables> = {
  document: TypedDocumentNode<Result, Variables>
  accessToken?: string
} & RequestVariables<Variables>

// prettier-ignore
type RequestVariables<Variables> =
  Variables extends { [key: string]: never }
    ? { variables?: undefined }
    : { variables: Variables }

type RequestQueueItem = {
  options: RequestOptions<any, any>
  resolve: (data: any) => void
  reject: (error: unknown) => void
}

// anilist has a 90 request limit per minute
// we'll skirt a little bit below that
const requestDelayMs = 1000 * 60 * (1 / 85)

class AnilistClient {
  private requests: RequestQueueItem[] = []
  private processing = false

  request<Result, Variables>(
    options: RequestOptions<Result, Variables>,
  ): Promise<Result> {
    return new Promise((resolve, reject) => {
      this.requests.push({
        options: options as RequestOptions<any, any>,
        resolve,
        reject,
      })
      void this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing) return
    this.processing = true

    let request: RequestQueueItem | undefined
    while ((request = this.requests.shift())) {
      const { options, resolve, reject } = request
      try {
        const startTime = Date.now()

        resolve(await requestGraphQL(options))

        const totalTime = Date.now() - startTime
        await setTimeout(Math.max(requestDelayMs - totalTime, 0))
      } catch (error) {
        reject(error)
      }
    }

    this.processing = false
  }
}

async function requestGraphQL(options: RequestOptions<any, any>) {
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

  const json = await response.json()

  if (!response.ok || json.errors) {
    const message =
      json.errors?.[0]?.message || response.statusText || "Unknown error"

    throw new Error(
      `Anilist request failed (status ${response.status}): ${message}`,
    )
  }

  return json.data
}

export const anilistClient = new AnilistClient()
