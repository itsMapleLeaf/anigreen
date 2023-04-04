export function parseUnsignedInteger(value: unknown) {
  const result = Number(value)
  if (Number.isInteger(result) && result >= 0) {
    return result
  }
  throw new Error(`Expected integer >= 0, got ${String(value)}`)
}
