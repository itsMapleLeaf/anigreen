import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import type { ReactNode } from "react"
import { useState } from "react"
import { Transition } from "~/dom/transition"

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
        inClassName={clsx`opacity-100 translate-y-0`}
        outClassName={clsx`opacity-0 translate-y-3`}
      >
        {(transition) => (
          <DropdownMenu.Content
            {...transition}
            side={side}
            align={align}
            sideOffset={16}
            forceMount
            onCloseAutoFocus={(event) => {
              if (!returnFocusOnClose) event.preventDefault()
            }}
          >
            <div className="flex flex-col overflow-hidden font-medium rounded-lg shadow bg-slate-50 text-slate-900 w-max">
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

Menu.itemClass = clsx`px-3 py-2 transition flex gap-2 items-center hover:bg-emerald-200 focus:bg-emerald-200 focus:outline-none`
