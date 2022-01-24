import { BookmarkIcon } from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaListStatus } from "~/modules/anilist/graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { SetWatchingStatusForm } from "~/modules/media/set-watching-status-form"
import type { AnilistMedia } from "./media-data"

export function MediaCardBookmarkButton({ media }: { media: AnilistMedia }) {
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