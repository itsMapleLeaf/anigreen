import { hydrate, hydrateRoot } from "react-dom"
import { RemixBrowser } from "remix"
import { setupTwind } from "./twind-setup"

setupTwind()

// hydrateRoot breaks cypress for some unknown reason
if ("Cypress" in window) {
  hydrate(<RemixBrowser />, document)
} else {
  hydrateRoot(document, <RemixBrowser />)
}
