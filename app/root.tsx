import firaSans from "@fontsource/fira-sans/latin.css"
import { MenuIcon } from "@heroicons/react/outline"
import { BookmarkIcon, CalendarIcon } from "@heroicons/react/solid"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Tooltip from "@radix-ui/react-tooltip"
import {
  Await,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from "@remix-run/react"
import type {
  DataFunctionArgs,
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from "@vercel/remix"
import { defer } from "@vercel/remix"
import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { $path } from "remix-routes"
import { AuthProvider } from "~/modules/auth/auth-context"
import { useWindowEvent } from "~/modules/dom/use-event"
import type { ActiveLinkProps } from "~/modules/navigation/active-link"
import { ActiveLink } from "~/modules/navigation/active-link"
import {
  activeClearButtonClass,
  clearButtonClass,
  clearIconButtonClass,
  solidButtonClass,
} from "~/modules/ui/button-style"
import { LoadingIcon } from "~/modules/ui/loading-icon"
import { anilistRequest } from "./anilist"
import logo from "./assets/logo-32x.png"
import { ViewerButton } from "./components/viewer-button"
import {
  type ViewerQuery,
  type ViewerQueryVariables,
} from "./generated/anilist-graphql"
import { getAppMeta } from "./modules/meta"
import { ActionScrollRestoration } from "./modules/remix/action-scroll-restoration"
import { maxWidthContainerClass } from "./modules/ui/components"
import { SystemMessage } from "./modules/ui/system-message"
import { SearchInput } from "./routes/search"
import tailwind from "./tailwind.css"
import { ViewerConsumer, ViewerProvider, viewerFragment } from "./viewer"

export const config = { runtime: "edge" }

export const meta: MetaFunction = () => getAppMeta()

export const links: LinksFunction = () => [
  { rel: "icon", href: logo },
  { rel: "stylesheet", href: firaSans },
  { rel: "stylesheet", href: tailwind },
]

export function loader({ request }: DataFunctionArgs) {
  return defer({
    viewer: getViewer(),
  })

  async function getViewer() {
    const result = await anilistRequest<ViewerQuery, ViewerQueryVariables>(
      request,
      {
        query: /* GraphQL */ `
          query Viewer {
            Viewer {
              ...viewer
            }
          }
          ${viewerFragment}
        `,
      },
    )
    return ("data" in result && result.data.Viewer) || null
  }
}

export default function App() {
  const { viewer } = useLoaderData<typeof loader>()
  return (
    <Document>
      <Tooltip.Provider delayDuration={700}>
        <ViewerProvider value={viewer}>
          <div className="isolate">
            <Header right={<AuthButton />} />
            <main className={maxWidthContainerClass}>
              <div className="my-8">
                <Await resolve={viewer}>
                  {(user) => (
                    <AuthProvider value={{ loggedIn: !!user }}>
                      <Outlet />
                    </AuthProvider>
                  )}
                </Await>
              </div>
            </main>
          </div>
        </ViewerProvider>
      </Tooltip.Provider>
      <NavigationIndicator />
    </Document>
  )
}

function AuthButton() {
  return (
    <ViewerConsumer fallback={<AuthButtonFallback />}>
      {(viewer) =>
        viewer ? <ViewerButton viewer={viewer} /> : <LoginButton />
      }
    </ViewerConsumer>
  )
}

function AuthButtonFallback() {
  return <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
}

function NavigationIndicator() {
  const transition = useTransition()
  return (
    <div
      className={clsx(
        "fixed left-0 bottom-0 p-4 transition-opacity duration-300 pointer-events-none",
        transition.state === "idle" ? "opacity-0" : "opacity-100",
      )}
    >
      <LoadingIcon size="large" />
    </div>
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
                  to={$path("/")}
                  reloadDocument
                  className={clsx(solidButtonClass, "justify-self-start")}
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
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#34D399" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ActionScrollRestoration />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function Header({ right }: { right?: ReactNode }) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(true)
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

              <Link to={$path("/")} title="Home" className="translate-y-[-2px]">
                <h1 className="text-3xl font-light">
                  <span className="text-sky-400">ani</span>
                  <span className="text-emerald-400">green</span>
                </h1>
              </Link>

              <div className="hidden sm:flex gap-2 mx-6">
                <MainNavigationItems />
              </div>
              <div className="ml-auto">{right}</div>
            </div>

            <Collapsible.Content asChild>
              <div className="grid gap-2 sm:hidden">
                <MainNavigationItems
                  onLinkClicked={() => setCollapsibleOpen(false)}
                />
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
      className={clsx(
        "shadow sticky top-0 z-10 transition-colors backdrop-blur-lg",
        scrolled ? "bg-black/60" : "bg-slate-800",
      )}
    >
      {children}
    </header>
  )
}

function MainNavigationItems(props: { onLinkClicked?: () => void }) {
  return (
    <>
      <MainNavigationLink
        to={$path("/watching")}
        onClick={props.onLinkClicked}
        prefetch="intent"
      >
        <BookmarkIcon className="w-5" />
        Watching
      </MainNavigationLink>
      <MainNavigationLink
        to={$path("/schedule")}
        onClick={props.onLinkClicked}
        prefetch="intent"
      >
        <CalendarIcon className="w-5" />
        Schedule
      </MainNavigationLink>
      <div className="relative">
        <SearchInput />
      </div>
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
  const [pending, setPending] = useState(false) // no form submits here, we'll just use a flag 🤪

  return pending ? (
    <LoadingIcon />
  ) : (
    <a
      href={$path("/auth/anilist/login")}
      className={clearButtonClass}
      onClick={() => setPending(true)}
    >
      log in with AniList
    </a>
  )
}
