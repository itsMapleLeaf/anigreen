import type { MediaListStatus } from "~/anilist/graphql.out"

export type Media = {
  id: number
  title: string
  format?: string
  bannerImageUrl?: string
  coverImageUrl?: string
  coverColor?: string
  episodeCount?: number
  scheduleEpisode?: number
  watchedEpisode?: number
  watchingStatus?: MediaListStatus
}
