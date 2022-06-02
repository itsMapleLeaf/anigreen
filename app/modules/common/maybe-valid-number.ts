export const maybeValidNumber = (input: unknown): number | undefined => {
  const output = Number(input)
  return Number.isNaN(output) ? undefined : output
}
