import { hydrateRoot } from "react-dom"
import { RemixBrowser } from "remix"
import { setupTwind } from "./twind-setup"

setupTwind()
hydrateRoot(document, <RemixBrowser />)
