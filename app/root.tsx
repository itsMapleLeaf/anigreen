import clsx from "clsx"
import type { LinksFunction, MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import { AppHeader } from "./app/app-header"
import { maxWidthContainerClass } from "./components"
import tailwind from "./tailwind.out.css"

export const meta: MetaFunction = () => ({
  title: "anigreen",
  description: "your week in anime 🌠",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
]

export default function App() {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppHeader />
        <main className={clsx(maxWidthContainerClass, "mt-4")}>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
