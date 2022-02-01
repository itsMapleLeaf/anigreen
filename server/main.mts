import { startServer } from "./server.mjs"

if (process.env.NODE_ENV === "test") {
  const { anilistApiMockServer } = await import("./anilist-api-mock-server.mjs")
  anilistApiMockServer.listen()
  await startServer()
} else {
  await startServer({ logging: true })
}
