import { Portal, Transition } from "@headlessui/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { usePopper } from "react-popper"
import { useDelayedValue } from "~/state/use-delayed-value"
import { useElementFocused } from "../dom/use-element-focused"
import { useElementHovered } from "../dom/use-element-hovered"

export function Tooltip({
  text,
  children,
}: {
  text: ReactNode
  children: (props: {
    ref: (element: HTMLElement | null | undefined) => void
    tabIndex: number
  }) => ReactNode
}) {
  const [reference, referenceRef] = useState<HTMLElement | null>()
  const [popper, popperRef] = useState<HTMLElement | null>()
  const { attributes, styles } = usePopper(reference, popper, {
    placement: "top",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  })

  const focused = useElementFocused(reference)
  const hovered = useElementHovered(reference)
  const visible = focused || hovered
  const delayedVisible = useDelayedValue(visible, visible ? 500 : 0)

  return (
    <>
      {children({ ref: referenceRef, tabIndex: 0 })}
      <Transition show={delayedVisible} className="contents">
        <Portal>
          <div ref={popperRef} style={styles.popper} {...attributes.popper}>
            <Transition.Child
              enter="transition"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                role="tooltip"
                className="bg-white text-slate-800 py-1 px-2 leading-tight rounded-md shadow-lg text-sm font-medium"
              >
                {text}
              </div>
            </Transition.Child>
          </div>
        </Portal>
      </Transition>
    </>
  )
}
