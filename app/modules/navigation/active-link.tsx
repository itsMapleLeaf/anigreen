import { useMatch } from "react-router-dom"
import type { LinkProps } from "@remix-run/react"
import { Link } from "@remix-run/react"
import { cx } from "twind"

export type ActiveLinkProps = Omit<LinkProps, "to"> & {
  to: string
  activeClassName?: string
  inactiveClassName?: string
}

export function ActiveLink({
  to,
  activeClassName,
  inactiveClassName,
  ...props
}: ActiveLinkProps) {
  const match = useMatch(to)
  return (
    <Link
      {...props}
      to={to}
      className={cx(
        props.className,
        match ? activeClassName : inactiveClassName,
      )}
    />
  )
}
