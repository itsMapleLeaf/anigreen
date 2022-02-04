import { BookmarkIcon } from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { TypedForm } from "~/form"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import type { AnilistMedia } from "./media-data"

export function MediaCardBookmarkButton({ media }: { media: AnilistMedia }) {
  const fetcher = useFetcher()

  return (
    <TypedForm
      as={fetcher.Form}
      action="updateMediaListEntry"
      data={{ mediaId: media.id, status: MediaListStatus.Current }}
    >
      <MediaCardActionButton
        tooltip="Add to watch list"
        loading={!!fetcher.submission}
      >
        <BookmarkIcon className="w-5" />
      </MediaCardActionButton>
    </TypedForm>
  )
}
