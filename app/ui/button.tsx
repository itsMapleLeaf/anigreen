import type { ComponentPropsWithRef } from "react"
import { autoRef } from "~/react/auto-ref"
import { LoadingIcon } from "~/ui/loading-icon"

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  loading?: boolean
}

export const Button = autoRef(function Button({
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type="button" disabled={loading} {...props}>
      {loading ? <LoadingIcon /> : children}
    </button>
  )
})
