import type { ComponentPropsWithoutRef, Ref } from "react"
import { forwardRef } from "react"
import { PendingIcon } from "~/ui/pending-icon"

export const Button = forwardRef(function Button(
  {
    loading,
    children,
    ...props
  }: ComponentPropsWithoutRef<"button"> & {
    loading?: boolean
  },
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button type="button" disabled={loading} {...props} ref={ref}>
      {loading ? <PendingIcon /> : children}
    </button>
  )
})
