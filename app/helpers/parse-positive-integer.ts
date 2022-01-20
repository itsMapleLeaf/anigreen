export function parsePositiveInteger(value: unknown) {
  const result = Number(value)
  if (Number.isInteger(result) && result > 0) {
    return result
  }
  throw new Error(`Expected positive integer, got ${value}`)
}
