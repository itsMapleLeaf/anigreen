import type { DataFunctionArgs } from "@remix-run/server-runtime"
import gql from "graphql-tag"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form } from "remix"
import { z } from "zod"
import type {
  UpdateMediaListEntryMutation,
  UpdateMediaListEntryMutationVariables,
} from "~/generated/anilist-graphql"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { parsePositiveInteger } from "~/modules/common/parse-positive-integer"

type Body = z.output<typeof bodySchema>
const bodySchema = z.object({
  mediaId: z.string().transform(parsePositiveInteger),
  status: z
    .union([
      z.literal(MediaListStatus.Current),
      z.literal(MediaListStatus.Paused),
      z.literal(MediaListStatus.Dropped),
    ])
    .optional(),
  progress: z.string().transform(parsePositiveInteger).optional(),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = bodySchema.parse(Object.fromEntries(await request.formData()))

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
    variables: body,
  })

  return {}
}

export function UpdateMediaListEntryForm({
  children,
  as: FormComponent = Form,
  ...inputs
}: Body & {
  as?: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
  children: ReactNode
}) {
  return (
    <FormComponent
      action="/update-media-list-entry"
      method="put"
      className="contents"
      replace
    >
      {Object.entries(inputs).map(([key, value]) => (
        <input type="hidden" name={key} value={value} key={key} />
      ))}
      {children}
    </FormComponent>
  )
}
