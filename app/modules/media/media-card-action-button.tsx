import type { ReactNode } from "react"
import { cx } from "twind"
import { autoRef } from "~/modules/react/auto-ref"
import type { ButtonProps } from "~/modules/ui/button"
import { Button } from "~/modules/ui/button"
import { Tooltip } from "~/modules/ui/tooltip"

export const MediaCardActionButton = autoRef(function MediaCardActionButton({
  tooltip,
  className,
  ...props
}: ButtonProps & { tooltip: ReactNode }) {
  return (
    <Tooltip text={tooltip} side="bottom">
      <Button
        type="submit"
        {...props}
        className={cx(className, actionButtonClass)}
      />
    </Tooltip>
  )
})

export const actionButtonClass = cx`flex justify-center p-3 hover:bg-black/30 transition w-full`
