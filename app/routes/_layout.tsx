import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react"

export default function Layout() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (!isRouteErrorResponse(error)) {
    const { message, stack } = toError(error)
    return (
      <main>
        <h1>Something went wrong.</h1>
        <pre>{stack || message}</pre>
      </main>
    )
  }

  return (
    <main>
      <h1>Something went wrong.</h1>
      <pre>{error.statusText}</pre>
    </main>
  )
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}
