import { LogOut, User } from "lucide-react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { type ViewerFragment } from "~/anilist-graphql"
import { ExternalLink } from "./external-link"

export const viewerFragment = /* GraphQL */ `
  fragment viewer on User {
    name
    avatar {
      medium
    }
    siteUrl
    bannerImage
  }
`

export function ViewerButton({ viewer }: { viewer: ViewerFragment }) {
  return (
    <DialogTrigger>
      <Button className="overflow-clip rounded-full transition focus-visible:ring-0 data-[pressed]:scale-95 data-[hovered]:opacity-75 data-[focus-visible]:ring-2">
        {viewer.avatar?.medium ? (
          <img
            src={viewer.avatar.medium}
            alt=""
            className="rounded-full border border-white/20 s-8"
          />
        ) : (
          <div className="flex items-center justify-center rounded-full border border-white/20 bg-black/50 s-8">
            <User aria-hidden className="s-5" />
          </div>
        )}
        <span className="sr-only">Open user menu</span>
      </Button>
      <Popover
        placement="bottom end"
        className="origin-top-right animate-from-opacity-0 animate-from-scale-95 data-[entering]:animate-in data-[exiting]:animate-out"
      >
        <Dialog className="flex min-w-[12rem] flex-col border border-white/20 bg-black/50 shadow-md shadow-black/25 focus:outline-none focus-visible:ring-0 data-[focus-visible]:ring-2">
          <div className="relative">
            {!!viewer.bannerImage && (
              <img
                src={viewer.bannerImage}
                alt=""
                className="absolute inset-0 select-none object-cover brightness-[0.3] s-full"
              />
            )}
            <ExternalLink
              href={viewer.siteUrl || `https://anilist.co/user/${viewer.name}`}
              className="relative block px-3 py-2 leading-none ring-inset transition hover:text-emerald-300"
            >
              <span>hi, {viewer.name}!</span>
              <br />
              <span className="text-sm">View AniList profile</span>
            </ExternalLink>
          </div>
          <a
            href="/auth/logout"
            className="flex items-center gap-2 px-3 py-2 ring-inset transition-colors hover:bg-emerald-100 hover:text-emerald-800"
          >
            <LogOut aria-hidden className="s-5" /> Sign out
          </a>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
