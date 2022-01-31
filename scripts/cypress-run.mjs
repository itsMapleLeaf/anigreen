// @ts-check
import Cypress from "cypress"
import { startServer } from "../server/server.mjs"

const server = await startServer()
await Cypress.run()
server.stop()
