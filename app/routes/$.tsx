import type { LoaderFunction } from "remix"
import { responseTyped } from "remix-typed"
import { getAppMeta } from "~/modules/meta"

export const meta = () => getAppMeta("Page not found")

export const loader: LoaderFunction = () => responseTyped(undefined, 404)

export default function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-light mb-4">oops</h1>
      <p>{`couldn't find that page :(`}</p>
    </>
  )
}
