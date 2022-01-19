import { Popover, Portal, Transition } from "@headlessui/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { Fragment, useState } from "react"
import { usePopper } from "react-popper"
import type { LinksFunction, MetaFunction } from "remix"
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import { useLoaderDataTyped } from "~/remix-typed"
import { anilistClient } from "./anilist-client.server"
import { buttonClass, maxWidthContainerClass } from "./components"
import { ViewerDocument } from "./graphql.out"
import { raise } from "./helpers/errors"
import { getAppTitle } from "./meta"
import { getSession } from "./session.server"
import tailwind from "./tailwind.out.css"

export const meta: MetaFunction = () => ({
  title: getAppTitle(),
  description: "your week in anime 🌠",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
]

type UserData = {
  name: string
  avatarUrl?: string
}

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)

  let user: UserData | undefined
  if (session) {
    const data = await anilistClient
      .request({ document: ViewerDocument, accessToken: session.accessToken })
      .catch((error) => console.warn("Failed to fetch viewer", error))

    if (data?.Viewer) {
      user = {
        name: data.Viewer.name,
        avatarUrl: data.Viewer.avatar?.medium,
      }
    }
  }

  return {
    user,
    anilistClientId:
      process.env.ANILIST_CLIENT_ID ?? raise("ANILIST_CLIENT_ID not set"),
    anilistRedirectUri:
      process.env.ANILIST_REDIRECT_URI ?? raise("ANILIST_REDIRECT_URI not set"),
  }
}

export default function App() {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="isolate">
          <header className="shadow sticky top-0 bg-slate-600/25 backdrop-blur-sm z-10">
            <div className={maxWidthContainerClass}>
              <HeaderNavigation />
            </div>
          </header>
          <main className={maxWidthContainerClass}>
            <div className="my-8">
              <Outlet />
            </div>
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function HeaderNavigation() {
  const data = useLoaderDataTyped<typeof loader>()

  const loginUrl =
    `https://anilist.co/api/v2/oauth/authorize` +
    `?client_id=${data.anilistClientId}` +
    `&redirect_uri=${data.anilistRedirectUri}` +
    `&response_type=code`

  return (
    <nav className="flex items-center justify-between h-16">
      <a href="/" title="Home" className="translate-y-[-2px]">
        <h1 className="text-3xl font-light">
          <span className="text-sky-400">ani</span>
          <span className="text-emerald-400">green</span>
        </h1>
      </a>
      {data.user ? (
        <UserMenuButton user={data.user} />
      ) : (
        <a href={loginUrl} className={buttonClass({ variant: "clear" })}>
          log in with AniList
        </a>
      )}
    </nav>
  )
}

function UserMenuButton({ user }: { user: UserData }) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  })

  return (
    <Popover>
      <div className="relative">
        <Popover.Button
          className="transition opacity-75 hover:opacity-100 focus:opacity-100"
          ref={setReferenceElement}
        >
          <img
            src={user.avatarUrl}
            alt={`Logged in as ${user.name}`}
            // display block adds random bottom space for some reason
            className="w-8 h-8 rounded-full inline"
          />
        </Popover.Button>
        <Portal>
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <Transition
              as={Fragment}
              enter="transition"
              enterFrom="transform translate-y-3 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform translate-y-3 opacity-0"
            >
              <Popover.Panel className="absolute right-0 flex flex-col overflow-hidden font-medium rounded-lg shadow top-full bg-slate-50 text-slate-900 w-max">
                <p className="px-3 py-2 opacity-60">Logged in as {user.name}</p>
                <div className="h-px bg-slate-300" />
                <Form
                  action="/logout"
                  method="post"
                  replace
                  className="contents"
                >
                  <button
                    type="submit"
                    className="px-3 py-2 transition hover:bg-emerald-200 focus:bg-emerald-200"
                  >
                    Log out
                  </button>
                </Form>
              </Popover.Panel>
            </Transition>
          </div>
        </Portal>
      </div>
    </Popover>
  )
}
