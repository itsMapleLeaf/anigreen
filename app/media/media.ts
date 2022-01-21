import type { MediaListStatus } from "~/anilist/graphql.out"

export type MediaResource = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  episodeCount?: number
  watchListInfo?: MediaWatchListInfo
}

export type MediaWatchListInfo = {
  mediaListId: number
  status: MediaListStatus
  progress: number
}
