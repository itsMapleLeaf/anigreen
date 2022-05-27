import type { DataFunctionArgs } from "@remix-run/node"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import { z } from "zod"
import type {
  UpdateMediaListEntryMutation,
  UpdateMediaListEntryMutationVariables,
} from "~/generated/anilist-graphql"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { redirectBack } from "~/modules/network/redirect-back"

const stringAsUnsignedInteger = () => z.string().transform(parseUnsignedInteger)

const bodySchema = z.object({
  mediaId: stringAsUnsignedInteger(),
  status: z
    .union([
      z.literal(MediaListStatus.Current),
      z.literal(MediaListStatus.Paused),
      z.literal(MediaListStatus.Dropped),
    ])
    .optional(),
  progress: stringAsUnsignedInteger().optional(),
  score: z.string().optional(),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)

  const variables = bodySchema.parse(
    Object.fromEntries(await request.formData()),
  )

  let score: number | undefined = Number(variables.score)
  if (Number.isNaN(score)) {
    score = undefined
  }

  await anilistRequest<
    UpdateMediaListEntryMutation,
    UpdateMediaListEntryMutationVariables
  >({
    query: /* GraphQL */ `
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
      score: score != undefined ? score * 10 : undefined,
    },
  })

  return redirectBack(request)
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
