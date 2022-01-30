import { MenuIcon } from "@heroicons/react/outline"
import { BookmarkIcon, CalendarIcon } from "@heroicons/react/solid"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Tooltip from "@radix-ui/react-tooltip"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"
import type { MetaFunction } from "remix"
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
import { cx } from "twind"
import { AuthProvider } from "~/modules/auth/auth-context"
import { useWindowEvent } from "~/modules/dom/use-event"
import type { ActiveLinkProps } from "~/modules/navigation/active-link"
import { ActiveLink } from "~/modules/navigation/active-link"
import { useLoaderDataTyped } from "~/modules/remix-typed"
import { Button } from "~/modules/ui/button"
import {
  activeClearButtonClass,
  clearButtonClass,
  clearIconButtonClass,
} from "~/modules/ui/button-style"
import { LoadingIcon } from "~/modules/ui/loading-icon"
import { Menu } from "~/modules/ui/menu"
import { loadViewerUser } from "./modules/anilist/user"
import { getSession } from "./modules/auth/session.server"
import { raise } from "./modules/common/errors"
import { getAppTitle } from "./modules/meta"
import { maxWidthContainerClass } from "./modules/ui/components"

export const meta: MetaFunction = () => ({
  title: getAppTitle(),
  description: "your week in anime 🌠",
})

type UserData = {
  name: string
  avatarUrl?: string
}

export async function loader({ request }: DataFunctionArgs) {
  const session = await getSession(request)
  const user = session && (await loadViewerUser(session.accessToken))

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
      className={cx(
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
    <LoadingIcon />
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
