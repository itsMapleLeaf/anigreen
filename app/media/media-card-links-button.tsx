import { LinkIcon } from "@heroicons/react/solid"
import type { Media } from "~/media/media"
import { MediaCardActionButton } from "~/media/media-card-action-button"

export function MediaCardLinksButton({ media }: { media: Media }) {
  // todo
  return (
    <MediaCardActionButton tooltip="External links">
      <LinkIcon className="w-5" />
    </MediaCardActionButton>
  )
}
