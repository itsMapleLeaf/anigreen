import { ChevronDoubleRightIcon } from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { TypedForm } from "~/form"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
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
    <TypedForm
      as={fetcher.Form}
      action="updateMediaListEntry"
      data={{ mediaId: media.id, progress: mediaListEntry.progress + 1 }}
    >
      <MediaCardActionButton
        tooltip="Advance progress"
        type="submit"
        loading={!!fetcher.submission}
      >
        <ChevronDoubleRightIcon className="w-5" />
      </MediaCardActionButton>
    </TypedForm>
  )
}
