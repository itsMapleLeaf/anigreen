import { PencilAltIcon } from "@heroicons/react/solid"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"
import { MediaEditModal } from "./media-edit-modal"

export function MediaCardEditButton({
  media,
  watchListInfo,
}: {
  media: AnilistMedia
  watchListInfo: AnilistMediaListEntry
}) {
  return (
    <MediaEditModal media={media} watchListInfo={watchListInfo}>
      <MediaCardActionButton tooltip="Edit">
        <PencilAltIcon className="w-5" />
      </MediaCardActionButton>
    </MediaEditModal>
  )
}
