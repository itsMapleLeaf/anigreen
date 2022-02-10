import type { DataFunctionArgs } from "@remix-run/server-runtime"
import gql from "graphql-tag"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form } from "remix"
import { z } from "zod"
import type {
  DeleteFromWatchingMutation,
  DeleteFromWatchingMutationVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { parsePositiveInteger } from "~/modules/common/parse-positive-integer"

const bodySchema = z.object({
  mediaListId: z.string().transform(parsePositiveInteger),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = bodySchema.parse(Object.fromEntries(await request.formData()))

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
    variables: body,
    accessToken: session.accessToken,
  })

  return {}
}

export function DeleteFromWatchingForm({
  mediaListId,
  children,
  as: FormComponent = Form,
}: {
  mediaListId: number
  children: ReactNode
  as?: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
}) {
  return (
    <FormComponent
      action="/delete-from-watching"
      method="post"
      replace
      className="contents"
    >
      <input type="hidden" name="mediaListId" value={mediaListId} />
      {children}
    </FormComponent>
  )
}
