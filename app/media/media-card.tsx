import {
  BookmarkIcon,
  LinkIcon,
  PencilAltIcon,
  PlusIcon,
} from "@heroicons/react/solid"
import clsx from "clsx"
import type { ReactNode } from "react"
import { Form } from "remix"
import { MediaListStatus } from "~/anilist/graphql.out"
import { useAuthContext } from "~/auth/auth-context"
import { filterJoin } from "~/helpers/filter-join"
import type { Media } from "~/media/media"
import { LazyImage } from "~/ui/lazy-image"
import { Tooltip } from "~/ui/tooltip"

const actionButtonClass = clsx`flex justify-center p-3 hover:bg-black/30 transition w-full`

export function MediaCard({ media }: { media: Media }) {
  return (
    <div className="bg-slate-700 rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div
        className="p-3 relative flex h-20"
        style={{ backgroundColor: media.coverColor || "rgba(0 0 0 / 0.50)" }}
      >
        <LazyImage
          src={media.bannerImageUrl}
          alt=""
          className="absolute w-full h-full inset-0 object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 opacity-40 pointer-events-none" />
      </div>
      <div className="p-3 flex items-end justify-between gap-4 flex-1">
        <h3 className="text-xl font-light leading-tight flex-1 line-clamp-2 self-start">
          {media.title}
        </h3>
        <LazyImage
          src={media.coverImageUrl}
          alt=""
          className="relative w-20 h-24 rounded-md shadow object-cover -mt-20"
        />
      </div>
      <div className="px-3 pb-3 text-sm uppercase font-medium opacity-60 leading-none flex items-center">
        <p className="flex-1">{media.format}</p>
        {media.scheduleEpisode ? (
          <p>
            Episode{" "}
            {filterJoin("/", [media.scheduleEpisode, media.episodeCount])}
          </p>
        ) : undefined}
        {media.watchedEpisode ? (
          <p>
            Watched{" "}
            {filterJoin("/", [media.watchedEpisode, media.episodeCount])}
          </p>
        ) : undefined}
      </div>
      <MediaCardControls media={media} />
    </div>
  )
}

function MediaCardControls({ media }: { media: Media }) {
  const auth = useAuthContext()

  const state = !auth.loggedIn
    ? "loggedOut"
    : media.watchingStatus != undefined
    ? "onList"
    : "notOnList"

  return (
    <div className="bg-slate-800 grid grid-flow-col auto-cols-fr">
      {state === "loggedOut" && (
        <>
          <AuthRequiredWrapper tooltipText="Log in to bookmark this">
            <div className={actionButtonClass}>
              <BookmarkIcon className="w-5" />
            </div>
          </AuthRequiredWrapper>
          <ExternalLinksButton media={media} />
        </>
      )}

      {state === "notOnList" && (
        <>
          <AddToWatchingButton media={media} />
          <ExternalLinksButton media={media} />
        </>
      )}

      {state === "onList" && (
        <>
          <button className={actionButtonClass}>
            <PencilAltIcon className="w-5" />
          </button>
          <button className={actionButtonClass}>
            <PlusIcon className="w-5" />
          </button>
          <ExternalLinksButton media={media} />
        </>
      )}
    </div>
  )
}

function AddToWatchingButton({ media }: { media: Media }) {
  return (
    <Form
      action={`/media/${media.id}/status`}
      method="put"
      className="contents"
      replace
    >
      <input type="hidden" name="status" value={MediaListStatus.Current} />
      <Tooltip text="Add to watch list">
        <button type="submit" className={actionButtonClass}>
          <BookmarkIcon className="w-5" />
        </button>
      </Tooltip>
    </Form>
  )
}

function ExternalLinksButton({ media }: { media: Media }) {
  // todo
  return (
    <button className={actionButtonClass}>
      <LinkIcon className="w-5" />
    </button>
  )
}

function AuthRequiredWrapper({
  tooltipText,
  children,
}: {
  tooltipText: ReactNode
  children: ReactNode
}) {
  const auth = useAuthContext()

  if (auth.loggedIn) {
    return <>{children}</>
  }

  return (
    <Tooltip text={tooltipText}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex={0}>
        <div className="pointer-events-none opacity-40">{children}</div>
      </div>
    </Tooltip>
  )
}
