import { BookmarkIcon } from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaListStatus } from "~/anilist/graphql.out"
import type { Media } from "~/media/media"
import { MediaCardActionButton } from "~/media/media-card-action-button"
import { SetWatchingStatusForm } from "~/media/set-watching-status-form"

export function MediaCardBookmarkButton({ media }: { media: Media }) {
  const fetcher = useFetcher()

  return (
    <SetWatchingStatusForm
      as={fetcher.Form}
      mediaId={media.id}
      status={MediaListStatus.Current}
    >
      <MediaCardActionButton
        tooltip="Add to watch list"
        loading={!!fetcher.submission}
      >
        <BookmarkIcon className="w-5" />
      </MediaCardActionButton>
    </SetWatchingStatusForm>
  )
}
