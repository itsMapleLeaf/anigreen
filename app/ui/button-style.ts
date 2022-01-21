import clsx from "clsx"

const baseButtonClass = clsx`font-medium rounded-md transition flex flex-row items-center gap-2`

export const solidButtonClass = clsx(
  baseButtonClass,
  clsx`bg-emerald-700 text-emerald-100 hover:translate-y-[-2px] hover:shadow hover:bg-emerald-800`,
)

const baseClearButtonClass = clsx(
  baseButtonClass,
  clsx`opacity-50 hover:bg-black/50 hover:opacity-100`,
)

export const clearButtonClass = clsx(
  baseClearButtonClass,
  clsx`px-3 py-2 -mx-3 -my-2`,
)

export const clearIconButtonClass = clsx(baseClearButtonClass, clsx`p-2 -m-2`)

export const activeClearButtonClass = clsx(
  baseButtonClass,
  clsx`bg-black/50 text-emerald-400 px-3 py-2 -mx-3 -my-2`,
)
