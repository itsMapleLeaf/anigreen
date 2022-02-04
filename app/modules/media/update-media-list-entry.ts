import gql from "graphql-tag"
import { z } from "zod"
import type {
  UpdateMediaListEntryMutation,
  UpdateMediaListEntryMutationVariables,
} from "~/generated/anilist-graphql"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { defineTypedAction } from "~/modules/remix-typed/remix-typed-action"

export const updateMediaListEntry = defineTypedAction({
  schema: z.object({
    mediaId: z.number(),
    status: z
      .union([
        z.literal(MediaListStatus.Current),
        z.literal(MediaListStatus.Paused),
        z.literal(MediaListStatus.Dropped),
      ])
      .optional(),
    progress: z.number().optional(),
  }),

  run: async (data, { request }) => {
    const session = await requireSession(request)

    await anilistRequest<
      UpdateMediaListEntryMutation,
      UpdateMediaListEntryMutationVariables
    >({
      document: gql`
        mutation UpdateMediaListEntry(
          $mediaId: Int!
          $status: MediaListStatus
          $progress: Int
        ) {
          SaveMediaListEntry(
            mediaId: $mediaId
            status: $status
            progress: $progress
          ) {
            status
          }
        }
      `,
      accessToken: session.accessToken,
      variables: data,
    })
  },
})
