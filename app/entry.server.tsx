import type { EntryContext } from "@remix-run/node"
import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import "dotenv/config"
import { PassThrough } from "node:stream"
import { renderToPipeableStream } from "react-dom/server"

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // install(twindConfig, false)

  // const markup = inline(
  //   renderToString(<RemixServer context={remixContext} url={request.url} />),
  // )

  // responseHeaders.set("Content-Type", "text/html")

  // return new Response("<!DOCTYPE html>" + markup, {
  //   status: responseStatusCode,
  //   headers: responseHeaders,
  // })

  return new Promise((resolve, reject) => {
    let didError = false

    let { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          let body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          )
          pipe(body)
        },
        onShellError(err) {
          reject(err)
        },
        onError(error) {
          didError = true
          console.error(error)
        },
      },
    )
    setTimeout(abort, ABORT_DELAY)
  })
}
