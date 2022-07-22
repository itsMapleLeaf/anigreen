import { ChevronDoubleRightIcon } from "@heroicons/react/solid"
import { useFetcher } from "@remix-run/react"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { UpdateMediaListEntryForm } from "~/routes/api/update-media-list-entry"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"
import { MediaEditModal } from "./media-edit-modal"

export function MediaCardAdvanceButton({
  media,
  mediaListEntry,
}: {
  media: AnilistMedia
  mediaListEntry: AnilistMediaListEntry
}) {
  const fetcher = useFetcher()

  const button = (
    <MediaCardActionButton
      tooltip="Advance progress"
      type="submit"
      loading={!!fetcher.submission}
    >
      <ChevronDoubleRightIcon className="w-5" />
    </MediaCardActionButton>
  )

  // if we're about to finish this series,
  // show a modal for rating, starting with progress on the ending episode
  // on submit, it should mark the anime completed in anilist
  if (mediaListEntry.progress + 1 === media.episodeCount) {
    return (
      <MediaEditModal
        media={media}
        watchListInfo={{
          ...mediaListEntry,
          progress: media.episodeCount,
        }}
      >
        {button}
      </MediaEditModal>
    )
  }

  const endingEpisode = media.currentEpisode ?? media.episodeCount

  const isInProgress =
    endingEpisode == undefined || mediaListEntry.progress < endingEpisode

  if (!isInProgress) {
    return <></>
  }

  return (
    <UpdateMediaListEntryForm
      as={fetcher.Form}
      data={{ mediaId: media.id, progress: mediaListEntry.progress + 1 }}
    >
      {button}
    </UpdateMediaListEntryForm>
  )
}
