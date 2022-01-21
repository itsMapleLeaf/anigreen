import { BookmarkIcon } from "@heroicons/react/solid"
import type { ReactNode } from "react"
import { useAuthContext } from "~/auth/auth-context"
import type { Media } from "~/media/media"
import { actionButtonClass } from "~/media/media-card-action-button"
import { MediaCardAdvanceButton } from "~/media/media-card-advance-button"
import { MediaCardBookmarkButton } from "~/media/media-card-bookmark-button"
import { MediaCardEditButton } from "~/media/media-card-edit-button"
import { MediaCardLinksButton } from "~/media/media-card-links-button"
import { Tooltip } from "~/ui/tooltip"

export function MediaCardControls({ media }: { media: Media }) {
  const auth = useAuthContext()

  const state = !auth.loggedIn
    ? ({ status: "loggedOut" } as const)
    : media.watchListInfo
    ? ({ status: "onList", watchListInfo: media.watchListInfo } as const)
    : ({ status: "notOnList" } as const)

  return (
    <div className="bg-slate-800 grid grid-flow-col auto-cols-fr">
      {state.status === "loggedOut" && (
        <>
          <AuthRequiredWrapper tooltipText="Log in to bookmark this">
            <div className={actionButtonClass}>
              <BookmarkIcon className="w-5" />
            </div>
          </AuthRequiredWrapper>
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

function AuthRequiredWrapper({
  tooltipText,
  children,
}: {
  tooltipText: ReactNode
  children: ReactNode
}) {
  return (
    <Tooltip text={tooltipText}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex={0}>
        <div className="pointer-events-none opacity-40">{children}</div>
      </div>
    </Tooltip>
  )
}
