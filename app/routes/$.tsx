import { getAppMeta } from "~/modules/meta"

export const meta = () => getAppMeta("Page not found")

export default function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-light mb-4">oops</h1>
      <p>{`couldn't find that page :(`}</p>
    </>
  )
}
