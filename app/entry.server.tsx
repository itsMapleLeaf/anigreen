import "dotenv/config"
import { renderToString } from "react-dom/server"
import type { EntryContext } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { inline, install } from "twind"
import { twindConfig } from "./twind-config"

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  install(twindConfig, false)

  const markup = inline(
    renderToString(<RemixServer context={remixContext} url={request.url} />),
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
