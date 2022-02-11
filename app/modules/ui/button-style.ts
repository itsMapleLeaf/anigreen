import { cx } from "twind"

const baseButtonClass = cx`font-medium rounded-md transition flex flex-row items-center gap-2 leading-none`

export const solidButtonClass = cx(
  baseButtonClass,
  cx`bg-emerald-700 text-emerald-100 hover:translate-y-[-2px] hover:shadow hover:bg-emerald-800 p-3`,
)

export const solidDangerButtonClass = cx(
  baseButtonClass,
  cx`bg-red-700 text-red-100 hover:translate-y-[-2px] hover:shadow hover:bg-red-800 p-3`,
)

const baseClearButtonClass = cx(
  baseButtonClass,
  cx`opacity-50 hover:bg-black/50 hover:opacity-100`,
)

export const clearButtonClass = cx(baseClearButtonClass, cx`p-3`)

export const clearIconButtonClass = cx(baseClearButtonClass, cx`p-2`)

export const activeClearButtonClass = cx(
  baseButtonClass,
  cx`bg-black/50 text-emerald-400 px-3 py-2`,
)
