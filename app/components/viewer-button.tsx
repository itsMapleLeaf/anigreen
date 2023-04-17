import { LogOut, User } from "lucide-react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { type Nullish } from "~/helpers/types"
import { ExternalLink } from "./external-link"

export default function ViewerButton(props: {
  name: string
  avatarUrl: Nullish<string>
  siteUrl: string
  bannerUrl: Nullish<string>
}) {
  return (
    <DialogTrigger>
      <Button className="overflow-clip rounded-full transition focus-visible:ring-0 data-[pressed]:scale-95 data-[hovered]:opacity-75 data-[focus-visible]:ring-2">
        {props.avatarUrl ? (
          <img src={props.avatarUrl} alt="" className="rounded-full s-8" />
        ) : (
          <div className="flex items-center justify-center rounded-full bg-black/50 s-8">
            <User aria-hidden className="s-5" />
          </div>
        )}
        <span className="sr-only">Open user menu</span>
      </Button>
      <Popover
        placement="bottom end"
        className="animate-from-opacity-0 animate-from-scale-95 data-[entering]:animate-in data-[exiting]:animate-out"
      >
        <Dialog className="flex min-w-[12rem] flex-col rounded bg-white text-slate-900 shadow-md shadow-black/25 focus:outline-none focus-visible:ring-0 data-[focus-visible]:ring-2">
          <div className="relative bg-black">
            {props.bannerUrl && (
              <img
                src={props.bannerUrl}
                alt=""
                className="absolute inset-0 select-none rounded-t object-cover brightness-[0.3] s-full"
              />
            )}
            <ExternalLink
              href={props.siteUrl}
              className="relative block rounded-t px-3 py-2 leading-none text-white ring-inset transition hover:text-emerald-300"
            >
              <span>hi, {props.name}!</span>
              <br />
              <span className="text-sm">View AniList profile</span>
            </ExternalLink>
          </div>
          <a
            href="/auth/logout"
            className="flex items-center gap-2 rounded-b px-3 py-2 ring-inset transition-colors hover:bg-emerald-100 hover:text-emerald-800"
          >
            <LogOut aria-hidden className="s-5" /> Sign out
          </a>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
