import { MenuIcon } from "@heroicons/react/outline"
import { BookmarkIcon, CalendarIcon } from "@heroicons/react/solid"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Tooltip from "@radix-ui/react-tooltip"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import type { ErrorBoundaryComponent, MetaFunction } from "remix"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useTransition,
} from "remix"
import { useLoaderDataTyped } from "remix-typed"
import { cx, install } from "twind"
import { AuthProvider } from "~/modules/auth/auth-context"
import { useWindowEvent } from "~/modules/dom/use-event"
import type { ActiveLinkProps } from "~/modules/navigation/active-link"
import { ActiveLink } from "~/modules/navigation/active-link"
import { Button } from "~/modules/ui/button"
import {
  activeClearButtonClass,
  clearButtonClass,
  clearIconButtonClass,
  solidButtonClass,
} from "~/modules/ui/button-style"
import { LoadingIcon } from "~/modules/ui/loading-icon"
import { Menu } from "~/modules/ui/menu"
import type { AnilistUser } from "./modules/anilist/user"
import { loadViewerUser } from "./modules/anilist/user"
import { getSession } from "./modules/auth/session.server"
import { raise } from "./modules/common/errors"
import { getAppTitle } from "./modules/meta"
import { maxWidthContainerClass } from "./modules/ui/components"
import { SystemMessage } from "./modules/ui/system-message"
import { twindConfig } from "./twind-config"

export const meta: MetaFunction = () => ({
  title: getAppTitle(),
  description: "your week in anime 🌠",
})

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
  const transition = useTransition()
  const authProviderValue = useMemo(() => ({ loggedIn: !!user }), [user])

  return (
    <Document>
      <Tooltip.Provider delayDuration={700}>
        <div className="isolate">
          <Header
            authAction={user ? <UserMenuButton user={user} /> : <LoginButton />}
          />
          <main className={maxWidthContainerClass}>
            <div className="my-8">
              <AuthProvider value={authProviderValue}>
                <Outlet />
              </AuthProvider>
            </div>
          </main>
        </div>
      </Tooltip.Provider>
      <div
        className={cx(
          "fixed left-0 bottom-0 p-4 transition-opacity duration-300 pointer-events-none",
          transition.state === "idle" ? "opacity-0" : "opacity-100",
        )}
      >
        <LoadingIcon size="large" />
      </div>
    </Document>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <Document>
      <div className="isolate">
        <Header />
        <main className={maxWidthContainerClass}>
          <div className="my-8">
            <SystemMessage>
              <div className="grid gap-4">
                <p className="mb-4">{"something wrong wrong :("}</p>
                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                  {error?.stack || error?.message || String(error)}
                </pre>
                <Link
                  to="/"
                  reloadDocument
                  className={cx(solidButtonClass, "justify-self-start")}
                >
                  Return to safety
                </Link>
              </div>
            </SystemMessage>
          </div>
        </main>
      </div>
    </Document>
  )
}

function Document({ children }: { children: React.ReactNode }) {
  // when hitting the error boundary, remix yeets the whole document and re-renders it,
  // which causes the twind style tag to go away :(
  // so we'll use this effect to install them on mount
  //
  // thankfully, the styles always exist from the server,
  // so there shouldn't be any weird flash
  useEffect(() => {
    // install(twindConfig, process.env.NODE_ENV === "production")
    // temporary fix for https://github.com/tw-in-js/twind/issues/293
    install(twindConfig, false)
  }, [])

  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/logo-32x.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
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
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function Header({ authAction }: { authAction?: ReactNode }) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)
  return (
    <HeaderPanel>
      <div className={maxWidthContainerClass}>
        <Collapsible.Root
          asChild
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
        >
          <nav className="py-2 grid gap-2">
            <div className="flex items-center">
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

              <div className="hidden sm:flex gap-2 mx-6">
                <MainNavigationLinks />
              </div>
              <div className="ml-auto">{authAction}</div>
            </div>

            <Collapsible.Content
              asChild
              onClick={() => setCollapsibleOpen(false)}
            >
              <div className="grid gap-2 sm:hidden">
                <MainNavigationLinks />
              </div>
            </Collapsible.Content>
          </nav>
        </Collapsible.Root>
      </div>
    </HeaderPanel>
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

function UserMenuButton({ user }: { user: AnilistUser }) {
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
          <Menu.Item>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.profileUrl}
              className="relative px-3 py-2 text-white leading-none bg-slate-900 focus:outline-none focus-visible:text-emerald-400 transition-colors"
            >
              <div
                style={{
                  backgroundImage: user.bannerUrl
                    ? `url(${user.bannerUrl})`
                    : undefined,
                }}
                className="bg-cover bg-center absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-40"
              />
              <p className="text-sm relative opacity-90">hi, {user.name}!</p>
              <p className="text-xs relative opacity-90">
                View AniList profile
              </p>
            </a>
          </Menu.Item>
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
