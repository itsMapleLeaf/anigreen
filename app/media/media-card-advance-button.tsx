import { ChevronDoubleRightIcon } from "@heroicons/react/solid"
import { MediaCardActionButton } from "~/media/media-card-action-button"

export function MediaCardAdvanceButton() {
  return (
    <MediaCardActionButton tooltip="Advance progress">
      <ChevronDoubleRightIcon className="w-5" />
    </MediaCardActionButton>
  )
}
