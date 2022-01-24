import type { Falsy } from "~/modules/common/types"

export type IsTruthyFunction = <T>(value: T | Falsy) => value is T
export const isTruthy = Boolean as unknown as IsTruthyFunction
