import type { Falsy } from "~/helpers/types"

export type IsTruthyFunction = <T>(value: T | Falsy) => value is T
export const isTruthy = Boolean as unknown as IsTruthyFunction
