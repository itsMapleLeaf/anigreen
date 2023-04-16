import type { V2_MetaFunction } from "@remix-run/react"

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }]
}

export default function Index() {
  return (
    <main>
      <p className="font-condensed text-2xl">light</p>
      <p>normal</p>
      <p className="font-medium">medium</p>
    </main>
  )
}
