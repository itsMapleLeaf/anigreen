import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { cx } from "twind"
import { Transition } from "~/modules/dom/transition"
import { useWindowEvent } from "~/modules/dom/use-event"

export function Menu({
  trigger,
  items,
  side = "bottom",
  align = "center",
  returnFocusOnClose = true,
  debugOpen,
}: {
  trigger: ReactNode
  items: ReactNode
  side: "left" | "right" | "top" | "bottom"
  align: "start" | "center" | "end"
  returnFocusOnClose?: boolean
  debugOpen?: true
}) {
  const [visible, setVisible] = useState(false)

  // by default, the menu always returns focus on closed,
  // but we don't want to return focus when returning via the mouse,
  // because the trigger could have like a tooltip on it or something,
  // and that looks weird
  // so we track whether or not the last action was a mouse click,
  // and use that to decide whether or not to return focus
  const lastActionRef = useRef<"pointer" | "keyboard">("pointer")
  useWindowEvent("keydown", () => {
    lastActionRef.current = "keyboard"
  })
  useWindowEvent("pointerdown", () => {
    lastActionRef.current = "pointer"
  })

  return (
    <DropdownMenu.Root open={debugOpen || visible} onOpenChange={setVisible}>
      <DropdownMenu.Trigger
        className="transition opacity-75 hover:opacity-100 focus:opacity-100"
        asChild
      >
        {trigger}
      </DropdownMenu.Trigger>
      <Transition
        visible={visible}
        className="transition"
        inClassName={cx`opacity-100 translate-y-0`}
        outClassName={cx`opacity-0 translate-y-3`}
      >
        {(transition) => (
          <DropdownMenu.Content
            {...transition}
            side={side}
            align={align}
            sideOffset={16}
            forceMount
            onCloseAutoFocus={(event) => {
              if (lastActionRef.current === "pointer") event.preventDefault()
            }}
          >
            <div className="flex flex-col overflow-hidden font-medium rounded-lg shadow bg-slate-50 text-slate-900 w-40">
              {items}
            </div>
          </DropdownMenu.Content>
        )}
      </Transition>
    </DropdownMenu.Root>
  )
}

Menu.Item = function Item(props: {
  children: React.ReactNode
  textValue?: string
  onSelect?: (event: { preventDefault: () => void }) => void
}) {
  return <DropdownMenu.Item {...props} asChild />
}

Menu.Separator = function Separator() {
  return <DropdownMenu.Separator className="h-px bg-slate-300" />
}

Menu.itemClass = cx`px-3 py-2 transition flex gap-2 items-center hover:bg-emerald-200 focus:bg-emerald-200 focus:outline-none`
Menu.leftIconClass = cx`w-5 -ml-1`
