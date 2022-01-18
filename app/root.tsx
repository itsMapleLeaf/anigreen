import type { LinksFunction, LoaderFunction, MetaFunction } from "remix"
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix"
import { buttonClass, maxWidthContainerClass } from "./components"
import { createAuthenticatedClient } from "./graphql-client.server"
import { ViewerDocument } from "./graphql.out"
import { raise } from "./helpers/errors"
import { getSession } from "./session.server"
import tailwind from "./tailwind.out.css"

export const meta: MetaFunction = () => ({
  title: "anigreen",
  description: "your week in anime 🌠",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
]

type LoaderData = {
  user?: {
    name: string
    avatarUrl?: string
  }
  anilistClientId: string
  anilistRedirectUri: string
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const session = await getSession(request)

  let user: LoaderData["user"] | undefined
  if (session) {
    const client = createAuthenticatedClient(session.access_token)
    const result = await client.query({
      query: ViewerDocument,
    })
    if (result.data.Viewer) {
      user = {
        name: result.data.Viewer.name,
        avatarUrl: result.data.Viewer.avatar?.medium,
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
  const data = useLoaderData<LoaderData>()

  const loginUrl =
    `https://anilist.co/api/v2/oauth/authorize` +
    `?client_id=${data.anilistClientId}` +
    `&redirect_uri=${data.anilistRedirectUri}` +
    `&response_type=code`

  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="shadow bg-slate-800">
          <div className={maxWidthContainerClass}>
            <div className="flex items-center justify-between h-16">
              <a href="/" title="Home" className="translate-y-[-2px]">
                <h1 className="text-3xl font-light">
                  <span className="text-sky-400">ani</span>
                  <span className="text-emerald-400">green</span>
                </h1>
              </a>

              {data.user ? (
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center gap-2 transition opacity-50 hover:opacity-100 focus:opacity-100"
                  >
                    <img
                      src={data.user.avatarUrl}
                      alt={`Logged in as ${data.user.name}`}
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                </Form>
              ) : (
                <a
                  href={loginUrl}
                  className={buttonClass({ variant: "clear" })}
                >
                  log in with AniList
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="h-4" />

        <main className={maxWidthContainerClass}>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
