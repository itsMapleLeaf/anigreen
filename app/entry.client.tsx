import { hydrate } from "react-dom"
import { RemixBrowser } from "remix"
import { setupTwind } from "./twind-setup"

setupTwind()
hydrate(<RemixBrowser />, document)
