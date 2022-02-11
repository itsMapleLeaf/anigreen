import { cx } from "twind"

const baseButtonClass = cx`font-medium rounded-md transition flex flex-row items-center gap-2`

export const solidButtonClass = cx(
  baseButtonClass,
  cx`bg-emerald-700 text-emerald-100 hover:translate-y-[-2px] hover:shadow hover:bg-emerald-800`,
)

const baseClearButtonClass = cx(
  baseButtonClass,
  cx`opacity-50 hover:bg-black/50 hover:opacity-100`,
)

export const clearButtonClass = cx(baseClearButtonClass, cx`px-3 py-2`)

export const clearIconButtonClass = cx(baseClearButtonClass, cx`p-2`)

export const activeClearButtonClass = cx(
  baseButtonClass,
  cx`bg-black/50 text-emerald-400 px-3 py-2`,
)
