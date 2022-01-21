import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form } from "remix"
import type { MediaListStatus } from "~/anilist/graphql.out"

export function SetWatchingStatusForm({
  mediaId,
  status,
  children,
  as: FormComponent = Form,
}: {
  mediaId: number
  status: MediaListStatus
  children: ReactNode
  as: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
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
