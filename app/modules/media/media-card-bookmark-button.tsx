import { BookmarkIcon } from "@heroicons/react/solid"
import { useFetcher } from "@remix-run/react"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { UpdateMediaListEntryForm } from "~/routes/api/update-media-list-entry"
import type { AnilistMedia } from "./media-data"

export function MediaCardBookmarkButton({ media }: { media: AnilistMedia }) {
  const fetcher = useFetcher()

  return (
    <UpdateMediaListEntryForm
      as={fetcher.Form}
      data={{ mediaId: media.id, status: MediaListStatus.Current }}
    >
      <MediaCardActionButton
        tooltip="Add to watch list"
        loading={!!fetcher.submission}
      >
        <BookmarkIcon className="w-5" />
      </MediaCardActionButton>
    </UpdateMediaListEntryForm>
  )
}
