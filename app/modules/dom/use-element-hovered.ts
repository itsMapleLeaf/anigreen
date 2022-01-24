import { useState } from "react"
import { useElementEvent } from "./use-event"

export function useElementHovered(element: HTMLElement | null | undefined) {
  const [hovered, setHovered] = useState(false)
  useElementEvent(element, "mouseenter", () => setHovered(true))
  useElementEvent(element, "mouseleave", () => setHovered(false))
  return hovered
}
