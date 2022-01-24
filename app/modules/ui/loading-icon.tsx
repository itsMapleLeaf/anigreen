import clsx from "clsx"

type LoadingIconSize = "normal" | "large"

export function LoadingIcon({ size = "normal" }: { size?: LoadingIconSize }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 animate-spin",
        size === "normal" && `gap-1 p-[1px] w-5 h-5`,
        size === "large" && `gap-1.5 w-12 h-12`,
      )}
    >
      <div className="bg-emerald-500 rounded-full" />
      <div className="bg-emerald-100 rounded-full" />
      <div className="bg-emerald-100 rounded-full" />
      <div className="bg-emerald-500 rounded-full" />
    </div>
  )
}
