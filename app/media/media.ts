import type { MediaExternalLink, MediaListStatus } from "~/anilist/graphql.out"

export type MediaResource = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  episodeCount?: number
  anilistUrl?: string
  watchListInfo?: MediaWatchListInfo
  externalLinks: MediaExternalLink[]
}

export type MediaWatchListInfo = {
  mediaListId: number
  status: MediaListStatus
  progress: number
}
