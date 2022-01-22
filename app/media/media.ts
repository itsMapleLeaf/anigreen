import type {
  MediaExternalLink,
  MediaFragment,
  MediaListEntryFragment,
  MediaListStatus,
} from "~/anilist/graphql.out"
import { isTruthy } from "~/helpers/is-truthy"

export type MediaResource = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  episodeCount?: number
  anilistUrl?: string
  externalLinks: MediaExternalLink[]
  watchListInfo?: MediaWatchListInfo
}

export type MediaWatchListInfo = {
  mediaListId: number
  status: MediaListStatus
  progress: number
}

export function createMediaResource(
  mediaData: MediaFragment,
  mediaListData: MediaListEntryFragment | undefined,
): MediaResource {
  const { title } = mediaData ?? {}

  const titleText =
    title?.userPreferred ||
    title?.english ||
    title?.romaji ||
    title?.native ||
    "Unknown Title"

  return {
    id: mediaData.id,
    title: titleText,
    format: mediaData.format?.replace(/[^A-Za-z]+/g, " "),
    episodeCount: mediaData.episodes,
    bannerImageUrl: mediaData.bannerImage,
    coverImageUrl: mediaData.coverImage?.medium,
    coverColor: mediaData.coverImage?.color,
    anilistUrl: mediaData.siteUrl,
    externalLinks: mediaData.externalLinks?.filter(isTruthy) ?? [],
    watchListInfo: mediaListData?.status && {
      mediaListId: mediaListData.id,
      status: mediaListData.status,
      progress: mediaListData.progress ?? 0,
    },
  }
}
