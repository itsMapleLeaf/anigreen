import { MenuIcon } from "@heroicons/react/outline"
import { BookmarkIcon, CalendarIcon } from "@heroicons/react/solid"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Tooltip from "@radix-ui/react-tooltip"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import clsx from "clsx"
import { useEffect, useState } from "react"
import type { LinksFunction, MetaFunction } from "remix"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
} from "remix"
import { AuthProvider } from "~/auth/auth-context"
import { useWindowEvent } from "~/dom/use-event"
import type { ActiveLinkProps } from "~/navigation/active-link"
import { ActiveLink } from "~/navigation/active-link"
import { useLoaderDataTyped } from "~/remix-typed"
import { Button } from "~/ui/button"
import {
  activeClearButtonClass,
  clearButtonClass,
  clearIconButtonClass,
} from "~/ui/button-style"
import { Menu } from "~/ui/menu"
import { PendingIcon } from "~/ui/pending-icon"
import { anilistClient } from "./anilist/anilist-client.server"
import { ViewerDocument } from "./anilist/graphql.out"
import { getSession } from "./auth/session.server"
import { raise } from "./helpers/errors"
import { getAppTitle } from "./meta"
import { maxWidthContainerClass } from "./ui/components"
import tailwind from "./ui/tailwind.out.css"

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
  const { user } = useLoaderDataTyped<typeof loader>()
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
        <Tooltip.Provider delayDuration={700}>
          <div className="isolate">
            <HeaderPanel>
              <div className={maxWidthContainerClass}>
                <HeaderNavigation />
              </div>
            </HeaderPanel>
            <main className={maxWidthContainerClass}>
              <div className="my-8">
                <AuthProvider value={{ loggedIn: !!user }}>
                  <Outlet />
                </AuthProvider>
              </div>
            </main>
          </div>
        </Tooltip.Provider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function HeaderPanel({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => setScrolled(window.scrollY > 0), [])
  useWindowEvent("scroll", () => setScrolled(window.scrollY > 0), {
    passive: true,
  })

  return (
    <header
      className={clsx(
        "shadow sticky top-0 z-10 transition-colors backdrop-blur-lg",
        scrolled ? "bg-black/60" : "bg-slate-800",
      )}
    >
      {children}
    </header>
  )
}

function HeaderNavigation() {
  const data = useLoaderDataTyped<typeof loader>()
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)
  return (
    <Collapsible.Root open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
      <nav className="flex items-center h-16">
        <div className="sm:hidden mr-3">
          <Collapsible.Trigger
            type="button"
            title="Menu"
            className={clearIconButtonClass}
          >
            <MenuIcon className="w-6" />
          </Collapsible.Trigger>
        </div>

        <Link to="/" title="Home" className="translate-y-[-2px]">
          <h1 className="text-3xl font-light">
            <span className="text-sky-400">ani</span>
            <span className="text-emerald-400">green</span>
          </h1>
        </Link>

        <div className="hidden sm:flex gap-8 mx-6">
          <MainNavigationLinks />
        </div>
        <div className="ml-auto">
          {data.user ? <UserMenuButton user={data.user} /> : <LoginButton />}
        </div>
      </nav>

      <Collapsible.Content onClick={() => setCollapsibleOpen(false)}>
        <div className="grid gap-5 pb-3 sm:hidden">
          <MainNavigationLinks />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

function MainNavigationLinks() {
  return (
    <>
      <MainNavigationLink to="/watching">
        <BookmarkIcon className="w-5" />
        Watching
      </MainNavigationLink>
      <MainNavigationLink to="/schedule">
        <CalendarIcon className="w-5" />
        Schedule
      </MainNavigationLink>
    </>
  )
}

function MainNavigationLink(props: ActiveLinkProps) {
  return (
    <ActiveLink
      {...props}
      inactiveClassName={clearButtonClass}
      activeClassName={activeClearButtonClass}
    />
  )
}

function LoginButton() {
  const data = useLoaderDataTyped<typeof loader>()
  const [pending, setPending] = useState(false) // no form submits here, we'll just use a flag 🤪

  const loginUrl =
    `https://anilist.co/api/v2/oauth/authorize` +
    `?client_id=${data.anilistClientId}` +
    `&redirect_uri=${data.anilistRedirectUri}` +
    `&response_type=code`

  return pending ? (
    <PendingIcon />
  ) : (
    <a
      href={loginUrl}
      className={clearButtonClass}
      onClick={() => setPending(true)}
    >
      log in with AniList
    </a>
  )
}

function UserMenuButton({ user }: { user: UserData }) {
  const fetcher = useFetcher()
  return (
    <Menu
      side="bottom"
      align="end"
      trigger={
        <Button
          className="transition opacity-75 hover:opacity-100 focus:opacity-100"
          loading={!!fetcher.submission}
        >
          <img
            src={user.avatarUrl}
            alt={`Logged in as ${user.name}`}
            // display block adds random bottom space for some reason
            className="w-8 h-8 rounded-full inline"
          />
        </Button>
      }
      items={
        <>
          <p className="px-3 py-2 opacity-60">Logged in as {user.name}</p>
          <Menu.Separator />
          <fetcher.Form
            action="/logout"
            method="post"
            replace
            className="contents"
          >
            <Menu.Item>
              <button type="submit" className={Menu.itemClass}>
                Log out
              </button>
            </Menu.Item>
          </fetcher.Form>
        </>
      }
    />
  )
}
