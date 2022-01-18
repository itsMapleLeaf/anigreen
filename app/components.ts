import clsx from "clsx"

export const buttonClass = ({ variant }: { variant: "solid" | "clear" }) => {
  return clsx(
    clsx`px-3 py-1.5 font-medium rounded-md transition`,
    variant === "clear" && clsx`opacity-50 hover:bg-black/50 hover:opacity-100`,
    variant === "solid" &&
      clsx`bg-emerald-700 text-emerald-100 hover:translate-y-[-2px] hover:shadow hover:bg-emerald-800`,
  )
}

export const maxWidthContainerClass = clsx`w-full max-w-screen-lg px-4 mx-auto`
