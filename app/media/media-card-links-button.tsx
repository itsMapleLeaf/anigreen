import { LinkIcon } from "@heroicons/react/solid"
import type { MediaResource } from "~/media/media"
import { MediaCardActionButton } from "~/media/media-card-action-button"

export function MediaCardLinksButton({ media }: { media: MediaResource }) {
  // todo
  return (
    <MediaCardActionButton tooltip="External links">
      <LinkIcon className="w-5" />
    </MediaCardActionButton>
  )
}
