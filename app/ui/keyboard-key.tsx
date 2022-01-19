import type { ReactNode } from "react"
import { Tooltip } from "./tooltip"

export function KeyboardKey({
  children,
  label,
}: {
  children: React.ReactNode
  label: ReactNode
}) {
  return (
    <Tooltip text={<>Key: {label}</>}>
      {(tooltip) => (
        <kbd
          {...tooltip}
          className="bg-emerald-600/50 border-emerald-500 border-[1px] rounded inline-block"
        >
          {children}
        </kbd>
      )}
    </Tooltip>
  )
}
