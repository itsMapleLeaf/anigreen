import { BookmarkIcon, LinkIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import type { ReactNode } from "react"
import type { AuthContextValue } from "~/auth/auth-context"
import { useAuthContext } from "~/auth/auth-context"
import { filterJoin } from "~/helpers/filter-join"
import { LazyImage } from "~/ui/lazy-image"
import { Tooltip } from "~/ui/tooltip"

export type MediaCardProps = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  scheduleEpisode?: number
  watchedEpisode?: number
  episodeCount?: number
}

const actionButtonClass = clsx`flex justify-center p-3 hover:bg-black/30 transition w-full`

export function MediaCard(props: MediaCardProps) {
  return (
    <div className="bg-slate-700 rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div
        className="p-3 relative flex h-20"
        style={{ backgroundColor: props.coverColor || "rgba(0 0 0 / 0.50)" }}
      >
        <LazyImage
          src={props.bannerImageUrl}
          alt=""
          className="absolute w-full h-full inset-0 object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 opacity-40 pointer-events-none" />
      </div>
      <div className="p-3 flex items-end justify-between gap-4 flex-1">
        <h3 className="text-xl font-light leading-tight flex-1 line-clamp-2 self-start">
          {props.title}
        </h3>
        <LazyImage
          src={props.coverImageUrl}
          alt=""
          className="relative w-20 h-24 rounded-md shadow object-cover -mt-20"
        />
      </div>
      <div className="px-3 pb-3 text-sm uppercase font-medium opacity-60 leading-none flex items-center">
        <p className="flex-1">{props.format}</p>
        {props.scheduleEpisode ? (
          <p>
            Episode{" "}
            {filterJoin("/", [props.scheduleEpisode, props.episodeCount])}
          </p>
        ) : undefined}
        {props.watchedEpisode ? (
          <p>
            Watched{" "}
            {filterJoin("/", [props.watchedEpisode, props.episodeCount])}
          </p>
        ) : undefined}
      </div>
      <div className="bg-slate-800 grid grid-flow-col auto-cols-fr">
        <AuthRequiredWrapper tooltipText="Log in to bookmark this">
          {(auth) => (
            <button className={actionButtonClass} disabled={!auth.loggedIn}>
              <BookmarkIcon className="w-5" />
            </button>
          )}
        </AuthRequiredWrapper>
        <button className={actionButtonClass}>
          <LinkIcon className="w-5" />
        </button>
      </div>
    </div>
  )
}

function AuthRequiredWrapper({
  tooltipText,
  children,
}: {
  tooltipText: ReactNode
  children: (auth: AuthContextValue) => ReactNode
}) {
  const auth = useAuthContext()

  if (auth.loggedIn) {
    return <>{children(auth)}</>
  }

  return (
    <Tooltip text={tooltipText}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex={0}>
        <div className="pointer-events-none opacity-25">{children(auth)}</div>
      </div>
    </Tooltip>
  )
}
