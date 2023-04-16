import firaSansCondensed300 from "@fontsource/fira-sans-condensed/latin-300.css"
import firaSans400 from "@fontsource/fira-sans/latin-400.css"
import firaSans500 from "@fontsource/fira-sans/latin-500.css"
import { type LinksFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import tailwind from "./tailwind.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: firaSansCondensed300 },
  { rel: "stylesheet", href: firaSans400 },
  { rel: "stylesheet", href: firaSans500 },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
