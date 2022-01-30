import { ChevronDoubleRightIcon } from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { UpdateMediaListEntryForm } from "~/routes/update-media-list-entry"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"

export function MediaCardAdvanceButton({
  media,
  mediaListEntry,
}: {
  media: AnilistMedia
  mediaListEntry: AnilistMediaListEntry
}) {
  const fetcher = useFetcher()

  const endingEpisode = media.currentEpisode || media.episodeCount

  const isInProgress =
    endingEpisode == undefined || mediaListEntry.progress < endingEpisode

  if (!isInProgress) {
    return <></>
  }

  return (
    <UpdateMediaListEntryForm
      as={fetcher.Form}
      mediaId={media.id}
      progress={mediaListEntry.progress + 1}
    >
      <MediaCardActionButton
        tooltip="Advance progress"
        type="submit"
        loading={!!fetcher.submission}
      >
        <ChevronDoubleRightIcon className="w-5" />
      </MediaCardActionButton>
    </UpdateMediaListEntryForm>
  )
}
