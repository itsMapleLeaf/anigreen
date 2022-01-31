import { anilistApiMockServer } from "../test/anilist-api-mock-server.mjs"
import { startServer } from "./server.mjs"

if (process.env.NODE_ENV === "test") {
  anilistApiMockServer.listen()
  await startServer()
} else {
  await startServer({ logging: true })
}
