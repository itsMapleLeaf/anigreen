// @ts-check
import Cypress from "cypress"
import { startServer } from "../server/server.mjs"

await startServer()
await Cypress.open()
