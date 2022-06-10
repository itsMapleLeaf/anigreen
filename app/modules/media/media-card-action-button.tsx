import cx from "clsx"
import type { ReactNode } from "react"
import { autoRef } from "~/modules/react/auto-ref"
import type { ButtonProps } from "~/modules/ui/button"
import { Button } from "~/modules/ui/button"
import { Tooltip } from "~/modules/ui/tooltip"

export const MediaCardActionButton = autoRef(function MediaCardActionButton({
  tooltip,
  className,
  children,
  ...props
}: ButtonProps & { tooltip: ReactNode }) {
  return (
    <Tooltip text={tooltip} side="bottom">
      <Button
        type="submit"
        {...props}
        className={cx(className, actionButtonClass)}
      >
        {children}
        <span className="sr-only">{tooltip}</span>
      </Button>
    </Tooltip>
  )
})

export const actionButtonClass = cx`flex justify-center p-3 hover:bg-black/30 transition w-full`
