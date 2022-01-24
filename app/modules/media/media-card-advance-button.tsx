import { ChevronDoubleRightIcon } from "@heroicons/react/solid"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"

export function MediaCardAdvanceButton() {
  return (
    <MediaCardActionButton tooltip="Advance progress">
      <ChevronDoubleRightIcon className="w-5" />
    </MediaCardActionButton>
  )
}
