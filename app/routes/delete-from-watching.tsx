import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import { z } from "zod"
import type {
  DeleteFromWatchingMutation,
  DeleteFromWatchingMutationVariables,
} from "~/generated/anilist-graphql"
import { anilistRequest } from "~/modules/anilist/request.server"
import { requireSession } from "~/modules/auth/require-session"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { redirectBack } from "~/modules/network/redirect-back"

const bodySchema = z.object({
  mediaListId: z.string().transform(parseUnsignedInteger),
})

export async function action({ request }: DataFunctionArgs) {
  const session = await requireSession(request)
  const body = bodySchema.parse(Object.fromEntries(await request.formData()))

  await anilistRequest<
    DeleteFromWatchingMutation,
    DeleteFromWatchingMutationVariables
  >({
    query: /* GraphQL */ `
      mutation DeleteFromWatching($mediaListId: Int!) {
        DeleteMediaListEntry(id: $mediaListId) {
          deleted
        }
      }
    `,
    variables: body,
    accessToken: session.accessToken,
  })

  return redirectBack(request)
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
