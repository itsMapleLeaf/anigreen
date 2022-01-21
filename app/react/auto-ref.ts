import type { Ref } from "react"
import { forwardRef } from "react"

/**
 * similar to forwardRef, but less annoying
 */
export function autoRef<Props, RefValue>(
  Component: React.FunctionComponent<Props & { ref?: Ref<RefValue> }>,
) {
  const AutoRef = forwardRef<RefValue, Props>(function AutoRef(props, ref) {
    return Component({ ...props, ref })
  })

  AutoRef.displayName = `AutoRef(${
    Component.displayName || Component.name || ""
  })`

  return AutoRef
}
