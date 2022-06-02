import * as Tooltip from "@radix-ui/react-tooltip"
import cx from "clsx"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { forwardRef, useState } from "react"
import { Transition } from "~/modules/dom/transition"

function TooltipWrapper(
  {
    text,
    children,
    side = "top",
    ...props
  }: {
    text: ReactNode
    children: ReactNode
    side?: "left" | "right" | "top" | "bottom"
  } & ComponentPropsWithoutRef<"button">,
  ref: React.Ref<HTMLButtonElement>,
) {
  const [visible, setVisible] = useState(false)
  return (
    <Tooltip.Root open={visible} onOpenChange={setVisible}>
      <Tooltip.Trigger {...props} asChild ref={ref}>
        {children}
      </Tooltip.Trigger>
      <Transition
        visible={visible}
        className="transition"
        inClassName={cx`opacity-100 scale-100`}
        outClassName={cx`opacity-0 scale-90`}
      >
        {(transition) => (
          <Tooltip.Content
            {...transition}
            side={side}
            sideOffset={8}
            forceMount
          >
            <div className="bg-white text-slate-800 py-1 px-2 leading-tight rounded-md shadow-lg text-sm font-medium">
              {text}
            </div>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        )}
      </Transition>
    </Tooltip.Root>
  )
}

const TooltipWrapperForwardRef = forwardRef(TooltipWrapper)

export { TooltipWrapperForwardRef as Tooltip }
