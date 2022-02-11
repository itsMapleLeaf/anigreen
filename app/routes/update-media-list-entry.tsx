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

const positiveInteger = () => z.string().transform(parsePositiveInteger)

const bodySchema = z.object({
  mediaId: positiveInteger(),
  status: z
    .union([
      z.literal(MediaListStatus.Current),
      z.literal(MediaListStatus.Paused),
      z.literal(MediaListStatus.Dropped),
    ])
    .optional(),
  progress: positiveInteger().optional(),
  score: positiveInteger().optional(),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const variables = bodySchema.parse(
    Object.fromEntries(await request.formData()),
  )

  await anilistRequest<
    UpdateMediaListEntryMutation,
    UpdateMediaListEntryMutationVariables
  >({
    document: gql`
      mutation UpdateMediaListEntry(
        $mediaId: Int!
        $status: MediaListStatus
        $progress: Int
        $score: Int
      ) {
        SaveMediaListEntry(
          mediaId: $mediaId
          status: $status
          progress: $progress
          scoreRaw: $score
        ) {
          status
        }
      }
    `,
    accessToken: session.accessToken,
    variables: {
      ...variables,
      score: variables.score == undefined ? undefined : variables.score * 10,
    },
  })

  return {}
}

export function UpdateMediaListEntryForm({
  data,
  children,
  as: FormComponent = Form,
}: {
  data: z.output<typeof bodySchema>
  children: ReactNode
  as?: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
}) {
  return (
    <FormComponent
      action="/update-media-list-entry"
      method="post"
      replace
      className="contents"
    >
      {Object.entries(data).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
    </FormComponent>
  )
}
