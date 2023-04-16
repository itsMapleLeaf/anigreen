import { Await } from "@remix-run/react"
import { Suspense, createContext, useContext, type ReactNode } from "react"
import { type ViewerFragment } from "./generated/anilist-graphql"
import { type Nullish } from "./modules/common/types"

export const viewerFragment = /* GraphQL */ `
  fragment viewer on User {
    id
    name
    siteUrl
    bannerImage
    avatar {
      medium
    }
  }
`

const ViewerPromiseContext = createContext<Promise<Nullish<ViewerFragment>>>()

export const ViewerProvider = ViewerPromiseContext.Provider

export function ViewerConsumer({
  children,
  fallback,
}: {
  children: (viewer: Nullish<ViewerFragment>) => ReactNode
  fallback?: ReactNode
}) {
  const promise = useContext(ViewerPromiseContext)
  return (
    <Suspense fallback={fallback}>
      <Await resolve={promise}>{children}</Await>
    </Suspense>
  )
}
