import { Form } from "@remix-run/react"
import { $path } from "remix-routes"
import { type ViewerButtonViewerFragment } from "~/generated/anilist-graphql"
import { Button } from "~/modules/ui/button"
import { Menu } from "~/modules/ui/menu"

export const viewerButtonViewerFragment = /* GraphQL */ `
  fragment viewerButtonViewer on User {
    name
    avatar {
      medium
    }
    siteUrl
    bannerImage
  }
`

export function ViewerButton({
  viewer,
}: {
  viewer: ViewerButtonViewerFragment
}) {
  return (
    <Menu
      side="bottom"
      align="end"
      trigger={
        <Button className="transition opacity-75 hover:opacity-100 focus:opacity-100">
          <img
            src={viewer.avatar?.medium}
            alt={`Logged in as ${viewer.name}`}
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
              href={viewer.siteUrl}
              className="relative px-3 py-2 text-white leading-none bg-slate-900 focus:outline-none focus-visible:text-emerald-400 transition-colors"
            >
              <div
                style={{
                  backgroundImage: viewer.bannerImage
                    ? `url(${viewer.bannerImage})`
                    : undefined,
                }}
                className="bg-cover bg-center absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-40"
              />
              <p className="text-sm relative opacity-90">hi, {viewer.name}!</p>
              <p className="text-xs relative opacity-90">
                View AniList profile
              </p>
            </a>
          </Menu.Item>
          <Menu.Separator />
          <Form
            action={$path("/auth/logout")}
            method="post"
            replace
            className="contents"
          >
            <Menu.Item>
              <button type="submit" className={Menu.itemClass}>
                Log out
              </button>
            </Menu.Item>
          </Form>
        </>
      }
    />
  )
}
