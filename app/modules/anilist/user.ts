import { ViewerDocument } from "~/modules/anilist/graphql"
import { anilistRequest } from "./request.server"

export type AnilistUser = {
  id: number
  name: string
  avatarUrl?: string
}

export async function loadViewerUser(
  accessToken: string,
): Promise<AnilistUser> {
  const data = await anilistRequest({ document: ViewerDocument, accessToken })
  return {
    id: data.Viewer!.id,
    name: data.Viewer!.name,
    avatarUrl: data.Viewer!.avatar?.medium,
  }
}
