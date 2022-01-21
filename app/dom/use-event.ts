import { useEffect } from "react"

type MaybeRefObject<T> = T | { readonly current: T }

export function useEvent<EventType extends Event>(
  targetRef: MaybeRefObject<EventTarget> | null | undefined,
  type: string,
  listener: (event: EventType) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    if (!targetRef) return

    const target =
      targetRef instanceof EventTarget ? targetRef : targetRef.current

    target.addEventListener(type, listener as (event: Event) => void, options)
    return () => {
      target.removeEventListener(
        type,
        listener as (event: Event) => void,
        options,
      )
    }
  })
}

export function useElementEvent<EventType extends keyof HTMLElementEventMap>(
  element: MaybeRefObject<HTMLElement> | null | undefined,
  type: EventType,
  listener: (event: HTMLElementEventMap[EventType]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEvent(element, type, listener, options)
}

export function useWindowEvent<EventType extends keyof WindowEventMap>(
  type: EventType,
  listener: (event: WindowEventMap[EventType]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEvent(
    typeof window !== "undefined" ? window : undefined,
    type,
    listener,
    options,
  )
}
