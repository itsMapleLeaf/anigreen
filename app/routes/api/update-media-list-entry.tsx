import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { DataFunctionArgs } from "@vercel/remix"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import { $path } from "remix-routes"
import { z } from "zod"
import type {
  UpdateMediaListEntryMutation,
  UpdateMediaListEntryMutationVariables,
} from "~/generated/anilist-graphql"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { maybeValidNumber } from "~/modules/common/maybe-valid-number"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { redirectWithNoDefer } from "~/modules/remix/no-defer"

const bodySchema = z.object({
  mediaId: z.string().transform(parseUnsignedInteger),
  status: z
    .union([
      z.literal(MediaListStatus.Current),
      z.literal(MediaListStatus.Paused),
      z.literal(MediaListStatus.Dropped),
      z.literal(MediaListStatus.Completed),
    ])
    .optional(),
  progress: z.string().transform(parseUnsignedInteger).optional(),
  score: z.string().transform(maybeValidNumber).optional(),
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
      score: variables.score == undefined ? undefined : variables.score * 10,
    },
  })

  return redirectWithNoDefer(request)
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
      action={$path("/api/update-media-list-entry")}
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
