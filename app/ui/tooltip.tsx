import * as Tooltip from "@radix-ui/react-tooltip"
import clsx from "clsx"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { forwardRef, useState } from "react"
import { Transition } from "~/dom/transition"

function TooltipWrapper(
  {
    text,
    children,
    ...props
  }: {
    text: ReactNode
    children: ReactNode
  } & ComponentPropsWithoutRef<"button">,
  ref: React.Ref<HTMLButtonElement>,
) {
  const [visible, setVisible] = useState(false)
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root open={visible} onOpenChange={setVisible}>
        <Tooltip.Trigger {...props} asChild ref={ref}>
          {children}
        </Tooltip.Trigger>
        <Transition
          visible={visible}
          className="transition"
          inClassName={clsx`opacity-100 scale-100`}
          outClassName={clsx`opacity-0 scale-90`}
        >
          {(transition) => (
            <Tooltip.Content
              {...transition}
              side="top"
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
    </Tooltip.Provider>
  )
}

const TooltipWrapperForwardRef = forwardRef(TooltipWrapper)

export { TooltipWrapperForwardRef as Tooltip }
