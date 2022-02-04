import gql from "graphql-tag"
import { z } from "zod"
import type {
  DeleteFromWatchingMutation,
  DeleteFromWatchingMutationVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { defineTypedAction } from "../remix-typed/remix-typed-action"

export const deleteFromWatching = defineTypedAction({
  schema: z.object({
    mediaListId: z.number(),
  }),

  run: async (data, { request }) => {
    const session = await requireSession(request)

    await anilistRequest<
      DeleteFromWatchingMutation,
      DeleteFromWatchingMutationVariables
    >({
      document: gql`
        mutation DeleteFromWatching($mediaListId: Int!) {
          DeleteMediaListEntry(id: $mediaListId) {
            deleted
          }
        }
      `,
      variables: data,
      accessToken: session.accessToken,
    })
  },
})
