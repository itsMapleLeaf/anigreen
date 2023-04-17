import firaSansCondensed300 from "@fontsource/fira-sans-condensed/latin-300.css"
import firaSans400 from "@fontsource/fira-sans/latin-400.css"
import firaSans500 from "@fontsource/fira-sans/latin-500.css"
import {
  type LinksFunction,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node"
import {
  Await,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import { defer } from "@vercel/remix"
import { LogIn } from "lucide-react"
import { Suspense, type ReactNode } from "react"
import { anilistRequest } from "~/anilist"
import { type ViewerQuery, type ViewerQueryVariables } from "~/anilist-graphql"
import logo from "./assets/logo-32x.png"
import { ErrorMessage } from "./components/error-message"
import { Footer } from "./components/footer"
import { Header } from "./components/header"
import ViewerButton from "./components/viewer-button"
import { toError } from "./helpers/errors"
import { getAppMeta } from "./meta"
import tailwind from "./tailwind.css"

export const config = { runtime: "edge" }

export const meta: V2_MetaFunction = () => getAppMeta()

export const links: LinksFunction = () => [
  { rel: "icon", href: logo },
  { rel: "stylesheet", href: firaSansCondensed300 },
  { rel: "stylesheet", href: firaSans400 },
  { rel: "stylesheet", href: firaSans500 },
  { rel: "stylesheet", href: tailwind },
]

export function loader({ request }: LoaderArgs) {
  const viewerQuery = anilistRequest<ViewerQuery, ViewerQueryVariables>(
    request,
    {
      query: /* GraphQL */ `
        query Viewer {
          Viewer {
            name
            avatar {
              medium
            }
            siteUrl
            bannerImage
          }
        }
      `,
    },
  )

  return defer({ viewerQuery })
}

function Document(props: { headerContent?: ReactNode; children: ReactNode }) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#34D399" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col gap-8 pb-6">
          <Header>{props.headerContent}</Header>
          <div className="container flex-1">{props.children}</div>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document headerContent={<AuthButton />}>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary() {
  return (
    <Document>
      <ErrorBoundaryContent />
    </Document>
  )
}

function ErrorBoundaryContent() {
  const error = useRouteError()

  if (!isRouteErrorResponse(error)) {
    const { message, stack } = toError(error)
    return (
      <ErrorMessage title="Something went wrong.">
        <pre className="overflow-x-auto rounded-md bg-black/25 p-4">
          {stack || message}
        </pre>
      </ErrorMessage>
    )
  }

  if (error.status === 401) {
    return (
      <ErrorMessage>
        <p>
          Please <a href="/auth/anilist">sign in with AniList</a> to continue.
        </p>
      </ErrorMessage>
    )
  }

  if (error.status === 403) {
    return (
      <ErrorMessage title="Something went wrong.">
        <p>You aren&apos;t authorized to view this page.</p>
      </ErrorMessage>
    )
  }

  if (error.status === 404) {
    return (
      <ErrorMessage title="Something went wrong.">
        <p>Couldn&apos;t find what you were looking for.</p>
      </ErrorMessage>
    )
  }

  return (
    <ErrorMessage title="Something went wrong.">
      <p>{error.statusText}</p>
    </ErrorMessage>
  )
}

function AuthButton() {
  const { viewerQuery } = useLoaderData<typeof loader>()
  return (
    <Suspense>
      <Await
        resolve={viewerQuery}
        errorElement={
          <a
            href="/auth/anilist"
            className="flex items-center gap-2 rounded bg-black/25 px-3 py-2 ring-emerald-400 transition hover:text-emerald-300 focus:outline-none focus-visible:ring-2"
          >
            <LogIn aria-hidden className="s-5" /> Sign in with AniList
          </a>
        }
      >
        {({ Viewer }) => (
          <ViewerButton
            name={Viewer?.name || "anonymous"}
            avatarUrl={Viewer?.avatar?.medium}
            siteUrl={
              Viewer?.siteUrl || `https://anilist.co/user/${Viewer?.name ?? ""}`
            }
            bannerUrl={Viewer?.bannerImage}
          />
        )}
      </Await>
    </Suspense>
  )
}
