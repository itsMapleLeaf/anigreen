import { useState } from "react"
import { useElementEvent } from "./use-event"

export function useElementFocused(element: HTMLElement | null | undefined) {
  const [focused, setFocused] = useState(false)
  useElementEvent(element, "focus", () => setFocused(true))
  useElementEvent(element, "blur", () => setFocused(false))
  return focused
}
