import "dotenv/config.js"

import { createRequestHandler } from "@remix-run/express"
import express from "express"
import build from "./build/index.js"

const port = process.env.PORT || 3000

express()
  .use(express.static("public"))
  .use(
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV || "development",
    }),
  )
  .listen(port, () => {
    console.info(`Express server listening on http://localhost:${port}`)
  })
