import { BookmarkIcon } from "@heroicons/react/solid"
import { useAuthContext } from "~/modules/auth/auth-context"
import { actionButtonClass } from "~/modules/media/media-card-action-button"
import { MediaCardAdvanceButton } from "~/modules/media/media-card-advance-button"
import { MediaCardBookmarkButton } from "~/modules/media/media-card-bookmark-button"
import { MediaCardEditButton } from "~/modules/media/media-card-edit-button"
import { MediaCardLinksButton } from "~/modules/media/media-card-links-button"
import { Tooltip } from "~/modules/ui/tooltip"
import type { AnilistMedia } from "./media-data"

export function MediaCardControls({ media }: { media: AnilistMedia }) {
  const auth = useAuthContext()

  const state = !auth.loggedIn
    ? ({ status: "loggedOut" } as const)
    : media.watchListEntry
    ? ({ status: "onList", watchListInfo: media.watchListEntry } as const)
    : ({ status: "notOnList" } as const)

  return (
    <div className="bg-slate-800 grid grid-flow-col auto-cols-fr">
      {state.status === "loggedOut" && (
        <>
          <Tooltip text="Log in to bookmark this" side="bottom">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <div tabIndex={0} className="opacity-40">
              <div className={actionButtonClass}>
                <BookmarkIcon className="w-5" />
              </div>
            </div>
          </Tooltip>
          <MediaCardLinksButton media={media} />
        </>
      )}

      {state.status === "notOnList" && (
        <>
          <MediaCardBookmarkButton media={media} />
          <MediaCardLinksButton media={media} />
        </>
      )}

      {state.status === "onList" && (
        <>
          <MediaCardEditButton
            media={media}
            watchListInfo={state.watchListInfo}
          />
          <MediaCardAdvanceButton />
          <MediaCardLinksButton media={media} />
        </>
      )}
    </div>
  )
}
