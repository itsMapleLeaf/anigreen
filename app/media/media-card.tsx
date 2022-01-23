import { MediaListStatus } from "~/anilist/graphql.out"
import { filterJoin } from "~/helpers/filter-join"
import { infix } from "~/helpers/infix"
import type { MediaResource } from "~/media/media"
import { MediaCardControls } from "~/media/media-card-controls"
import { LazyImage } from "~/ui/lazy-image"

export function MediaCard({
  media,
  scheduleEpisode,
  hideWatchingStatus,
}: {
  media: MediaResource
  scheduleEpisode?: number
  hideWatchingStatus?: boolean
}) {
  return (
    <div className="bg-slate-700 rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div
        className="p-3 relative flex h-20"
        style={{ backgroundColor: media.coverColor || "rgba(0 0 0 / 0.50)" }}
      >
        <LazyImage
          src={media.bannerImageUrl}
          alt=""
          className="absolute w-full h-full inset-0 object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 opacity-40 pointer-events-none" />
      </div>

      <div className="p-3 flex items-end justify-between gap-4 flex-1">
        <h3 className="text-xl font-light leading-tight flex-1 line-clamp-2 self-start">
          {media.title}
        </h3>
        <LazyImage
          src={media.coverImageUrl}
          alt=""
          className="relative w-20 h-24 rounded-md shadow object-cover -mt-20"
        />
      </div>

      <div className="px-3 pb-3 text-sm uppercase font-medium opacity-60 leading-none flex items-center gap-1">
        {infix(
          [
            <p key="format">{media.format}</p>,
            media.watchListInfo && !hideWatchingStatus && (
              <StatusDisplay key="status" status={media.watchListInfo.status} />
            ),
            media.watchListInfo?.progress && (
              <p key="scheduleEpisode">
                Watched{" "}
                {filterJoin("/", [
                  media.watchListInfo.progress,
                  media.episodeCount,
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
}

function StatusDisplay({ status }: { status: MediaListStatus }) {
  if (status === MediaListStatus.Paused) return <p>Paused</p>
  if (status === MediaListStatus.Dropped) return <p>Dropped</p>
  return <p>Watching</p>
}
