import firaSansCondensed300 from "@fontsource/fira-sans-condensed/latin-300.css"
import firaSans400 from "@fontsource/fira-sans/latin-400.css"
import firaSans500 from "@fontsource/fira-sans/latin-500.css"
import { type LinksFunction, type V2_MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import logo from "./assets/logo-32x.png"
import { getAppMeta } from "./meta"
import tailwind from "./tailwind.css"

export const meta: V2_MetaFunction = () => getAppMeta()

export const links: LinksFunction = () => [
  { rel: "icon", href: logo },
  { rel: "stylesheet", href: firaSansCondensed300 },
  { rel: "stylesheet", href: firaSans400 },
  { rel: "stylesheet", href: firaSans500 },
  { rel: "stylesheet", href: tailwind },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#34D399" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
