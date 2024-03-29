import type { LoaderFunction } from "@vercel/remix"
import { getAppMeta } from "~/modules/meta"

export const meta = () => getAppMeta("Page not found")

export const loader: LoaderFunction = () =>
  new Response(undefined, { status: 404 })

export default function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-light mb-4">oops</h1>
      <p>{`couldn't find that page :(`}</p>
    </>
  )
}
