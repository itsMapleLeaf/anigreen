import clsx from "clsx"
import { useMatch } from "react-router-dom"
import type { LinkProps } from "remix"
import { Link } from "remix"

export type ActiveLinkProps = Omit<LinkProps, "to"> & {
  to: string
  activeClassName?: string
  inactiveClassName?: string
}

export function ActiveLink(props: ActiveLinkProps) {
  const match = useMatch(props.to)
  return (
    <Link
      {...props}
      className={clsx(
        props.className,
        match ? props.activeClassName : props.inactiveClassName,
      )}
    />
  )
}
