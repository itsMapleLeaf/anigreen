import { memo } from "react"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { filterJoin } from "~/modules/common/filter-join"
import { infix } from "~/modules/common/infix"
import { MediaCardControls } from "~/modules/media/media-card-controls"
import { LazyImage } from "~/modules/ui/lazy-image"
import { getOptimizedImageUrl } from "~/routes/optimized-image"
import type { AnilistMedia } from "./media-data"

export const MediaCard = memo(function MediaCard({
  media,
  scheduleEpisode,
  hideWatchingStatus,
  hideProgress,
}: {
  media: AnilistMedia
  scheduleEpisode?: number
  hideWatchingStatus?: boolean
  hideProgress?: boolean
}) {
  return (
    <div className="bg-slate-700 rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div
        className="p-3 relative flex h-20"
        style={{ backgroundColor: media.coverColor || "rgba(0 0 0 / 0.50)" }}
      >
        {media.bannerImageUrl != undefined && (
          <LazyImage
            src={getOptimizedImageUrl(media.bannerImageUrl, 320, 80)}
            alt=""
            className="absolute inset-0 brightness-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 opacity-40 pointer-events-none" />
      </div>

      <div className="p-3 flex items-end justify-between gap-4 flex-1">
        <h3 className="text-xl font-light leading-tight flex-1 line-clamp-2 self-start">
          {media.title}
        </h3>
        {media.coverImageUrl != undefined && (
          <LazyImage
            src={getOptimizedImageUrl(media.coverImageUrl, 80, 96)}
            alt=""
            className="relative w-20 h-24 rounded-md shadow -mt-20 overflow-hidden"
          />
        )}
      </div>

      <div className="px-3 pb-3 text-sm uppercase font-medium opacity-60 leading-none flex items-center gap-1">
        {infix(
          [
            <p key="format">{media.format}</p>,
            media.watchListEntry && !hideWatchingStatus && (
              <StatusDisplay
                key="status"
                status={media.watchListEntry.status}
              />
            ),
            media.watchListEntry?.progress && !hideProgress && (
              <p key="scheduleEpisode">
                Watched{" "}
                {filterJoin("/", [
                  media.watchListEntry.progress,
                  media.currentEpisode,
                ])}
              </p>
            ),
            scheduleEpisode && (
              <p key="scheduleEpisode">
                Episode {filterJoin("/", [scheduleEpisode, media.episodeCount])}
              </p>
            ),
          ].filter(Boolean),
          (index) => (
            <span key={`separator-${index}`}>•</span>
          ),
        )}
      </div>

      <MediaCardControls media={media} />
    </div>
  )
})

function StatusDisplay({ status }: { status: MediaListStatus }) {
  if (status === MediaListStatus.Paused) return <p>Paused</p>
  if (status === MediaListStatus.Dropped) return <p>Dropped</p>
  return <p>Watching</p>
}
