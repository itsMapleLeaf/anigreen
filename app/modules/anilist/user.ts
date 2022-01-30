import gql from "graphql-tag"
import type {
  ViewerQuery,
  ViewerQueryVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "./request.server"

export type AnilistUser = {
  id: number
  name: string
  avatarUrl?: string
}

export async function loadViewerUser(
  accessToken: string,
): Promise<AnilistUser> {
  const data = await anilistRequest<ViewerQuery, ViewerQueryVariables>({
    document: gql`
      query Viewer {
        Viewer {
          id
          name
          avatar {
            medium
          }
        }
      }
    `,
    accessToken,
  })
  return {
    id: data.Viewer!.id,
    name: data.Viewer!.name,
    avatarUrl: data.Viewer!.avatar?.medium,
  }
}
