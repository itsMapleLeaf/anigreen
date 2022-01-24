import type { ReactNode } from "react"

export function GridSection({
  title,
  subtitle,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <h2 className="my-4">
        <div className="text-2xl font-light leading-tight">{title}</div>
        {subtitle != undefined && (
          <div className="text-sm opacity-60">{subtitle}</div>
        )}
      </h2>
      <ul className="grid gap-4 my-6 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
        {children}
      </ul>
    </>
  )
}
