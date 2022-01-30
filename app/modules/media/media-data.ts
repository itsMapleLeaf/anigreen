import type {
  MediaExternalLink,
  MediaFragment,
  MediaListEntryFragment,
  MediaListStatus,
} from "~/modules/anilist/graphql"
import { WatchingDocument } from "~/modules/anilist/graphql"
import { loadViewerUser } from "~/modules/anilist/user"
import { isTruthy } from "~/modules/common/is-truthy"
import { anilistRequest } from "../anilist/request.server"

export type AnilistMedia = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  episodeCount?: number
  anilistUrl?: string
  currentEpisode?: number
  nextEpisodeAiringTime?: number
  externalLinks: MediaExternalLink[]
  watchListEntry?: AnilistMediaListEntry
}

export type AnilistMediaListEntry = {
  mediaListId: number
  status: MediaListStatus
  progress: number
}

export function extractMediaData(
  media: MediaFragment,
  mediaListEntry: MediaListEntryFragment | undefined,
): AnilistMedia {
  const { title } = media ?? {}

  const titleText =
    title?.userPreferred ||
    title?.english ||
    title?.romaji ||
    title?.native ||
    "Unknown Title"

  return {
    id: media.id,
    title: titleText,
    format: media.format?.replace(/[^A-Za-z]+/g, " "),
    episodeCount: media.episodes,
    bannerImageUrl: media.bannerImage,
    coverImageUrl: media.coverImage?.medium,
    coverColor: media.coverImage?.color,
    anilistUrl: media.siteUrl,
    externalLinks: media.externalLinks?.filter(isTruthy) ?? [],
    currentEpisode: media.nextAiringEpisode
      ? media.nextAiringEpisode.episode - 1
      : media.episodes,
    nextEpisodeAiringTime: media.nextAiringEpisode
      ? media.nextAiringEpisode.airingAt * 1000
      : undefined,
    watchListEntry: mediaListEntry?.status && {
      mediaListId: mediaListEntry.id,
      status: mediaListEntry.status,
      progress: mediaListEntry.progress ?? 0,
    },
  }
}

export async function loadCurrentMedia(
  accessToken: string,
): Promise<AnilistMedia[]> {
  const user = await loadViewerUser(accessToken)

  const data = await anilistRequest({
    document: WatchingDocument,
    variables: { userId: user.id },
    accessToken,
  })

  const items: AnilistMedia[] = []
  for (const list of data.MediaListCollection?.lists ?? []) {
    for (const entry of list?.entries ?? []) {
      if (!entry?.media) continue
      items.push(extractMediaData(entry.media, entry))
    }
  }

  return items
}
