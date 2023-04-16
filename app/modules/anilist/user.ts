import type {
  ViewerOldQuery,
  ViewerOldQueryVariables,
} from "~/generated/anilist-graphql"
import { AnilistRequestError, anilistRequest } from "./request.server"

export type AnilistUser = {
  id: number
  name: string
  profileUrl: string
  avatarUrl?: string
  bannerUrl?: string
}

export async function loadViewerUser(
  accessToken: string,
): Promise<AnilistUser | null> {
  try {
    const data = await anilistRequest<ViewerOldQuery, ViewerOldQueryVariables>({
      query: /* GraphQL */ `
        query ViewerOld {
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

    if (!data.Viewer) {
      return null
    }

    return {
      id: data.Viewer.id,
      name: data.Viewer.name,
      avatarUrl: data.Viewer.avatar?.medium,
      bannerUrl: data.Viewer.bannerImage,
      profileUrl:
        data.Viewer.siteUrl ?? `https://anilist.co/user/${data.Viewer.name}/`,
    }
  } catch (error) {
    if (error instanceof AnilistRequestError && error.response.status === 401) {
      return null
    }
    throw error
  }
}
