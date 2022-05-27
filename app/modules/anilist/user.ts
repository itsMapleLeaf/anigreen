import type {
  ViewerQuery,
  ViewerQueryVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "./request.server"

export type AnilistUser = {
  id: number
  name: string
  profileUrl: string
  avatarUrl?: string
  bannerUrl?: string
}

export async function loadViewerUser(
  accessToken: string,
): Promise<AnilistUser> {
  const data = await anilistRequest<ViewerQuery, ViewerQueryVariables>({
    query: /* GraphQL */ `
      query Viewer {
        Viewer {
          id
          name
          avatar {
            medium
          }
          bannerImage
          siteUrl
        }
      }
    `,
    accessToken,
  })
  return {
    id: data.Viewer!.id,
    name: data.Viewer!.name,
    avatarUrl: data.Viewer!.avatar?.medium,
    bannerUrl: data.Viewer!.bannerImage,
    profileUrl:
      data.Viewer!.siteUrl ?? `https://anilist.co/user/${data.Viewer!.name}/`,
  }
}
