import clsx from "clsx"

// todo: refactor this to separate classes
export const buttonClass = ({
  variant,
  shape = "normal",
}: {
  variant: "solid" | "clear" | "clearActive"
  shape?: "normal" | "square"
}) => {
  return clsx(
    clsx`font-medium rounded-md transition flex flex-row items-center gap-2`,

    shape === "normal" && clsx`px-3 py-2`,
    shape === "square" && clsx`p-2`,

    variant === "clear" && clsx`opacity-50 hover:bg-black/50 hover:opacity-100`,
    variant === "clearActive" && clsx`bg-black/50 text-emerald-400`,
    variant === "solid" &&
      clsx`bg-emerald-700 text-emerald-100 hover:translate-y-[-2px] hover:shadow hover:bg-emerald-800`,

    (variant === "clear" || variant === "clearActive") &&
      shape === "normal" &&
      clsx`-mx-3 -my-2`,
    (variant === "clear" || variant === "clearActive") &&
      shape === "square" &&
      clsx`-m-2`,
  )
}

export const maxWidthContainerClass = clsx`w-full max-w-screen-lg px-4 mx-auto`
