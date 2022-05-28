import * as serverBuild from "@remix-run/dev/server-build"
import { createRequestHandler } from "@remix-run/express"
import compression from "compression"
import express from "express"
import pino from "pino"
import pinoHttp from "pino-http"

// const require = createRequire(import.meta.url)

const mode = process.env.NODE_ENV

const console = pino()

const app = express()
app.use(compression())

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }))

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }))

export type ServerHandle = {
  url: string
  stop: () => void
}

export function startServer({
  logging = false,
  port = Number(process.env.PORT) || 3000,
} = {}): Promise<ServerHandle> {
  if (mode === "production") {
    app.use(createRequestHandler({ build: serverBuild }))
  } else {
    app.use((request, response, next) => {
      // purgeRequireCache()
      const handler = createRequestHandler({ build: serverBuild, mode })
      return handler(request, response, next)
    })
  }

  if (logging) {
    app.use(pinoHttp({ logger: console }))
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const url = `http://localhost:${port}`

      resolve({
        url,
        stop: () => {
          server.close()
        },
      })

      if (logging) {
        console.info(`Express server listening on ${url}`)
      }
    })

    app.on("error", reject)
  })
}

// function purgeRequireCache() {
//   // purge require cache on requests for "server side HMR" this won't let
//   // you have in-memory objects between requests in development,
//   // alternatively you can set up nodemon/pm2-dev to restart the server on
//   // file changes, we prefer the DX of this though, so we've included it
//   // for you by default
//   for (const key in require.cache) {
//     if (key.startsWith(serverBuildFolder)) {
//       delete require.cache[key]
//     }
//   }
// }
