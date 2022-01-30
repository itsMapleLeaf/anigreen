import type { DataFunctionArgs } from "@remix-run/server-runtime"
import gql from "graphql-tag"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form } from "remix"
import { z } from "zod"
import type {
  SetWatchingStatusMutation,
  SetWatchingStatusMutationVariables,
} from "~/generated/anilist-graphql"
import { MediaListStatus } from "~/modules/anilist/graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { parsePositiveInteger } from "~/modules/common/parse-positive-integer"
import { requireValidBody } from "~/modules/network/require-valid-body"

const bodySchema = z.object({
  mediaId: z.string().transform(parsePositiveInteger),
  status: z.union([
    z.literal(MediaListStatus.Current),
    z.literal(MediaListStatus.Paused),
    z.literal(MediaListStatus.Dropped),
  ]),
})

type Body = z.output<typeof bodySchema>

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = await requireValidBody(request, bodySchema)

  await anilistRequest<
    SetWatchingStatusMutation,
    SetWatchingStatusMutationVariables
  >({
    document: gql`
      mutation SetWatchingStatus($mediaId: Int!, $status: MediaListStatus!) {
        SaveMediaListEntry(mediaId: $mediaId, status: $status) {
          status
        }
      }
    `,
    accessToken: session.accessToken,
    variables: body,
  })

  return {}
}

export function SetWatchingStatusForm({
  mediaId,
  status,
  children,
  as: FormComponent = Form,
}: Body & {
  as?: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
  children: ReactNode
}) {
  return (
    <FormComponent
      action="/set-watching-status"
      method="put"
      className="contents"
      replace
    >
      <input type="hidden" name="mediaId" value={mediaId} />
      <input type="hidden" name="status" value={status} />
      {children}
    </FormComponent>
  )
}
