import { useEffect } from "react"

export function useEvent<EventType extends Event>(
  target: EventTarget | null | undefined,
  type: string,
  listener: (event: EventType) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    if (!target) return
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
  element: HTMLElement | null | undefined,
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
  useEvent(window, type, listener, options)
}
