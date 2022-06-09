type RangeArgs =
  | [end: number]
  | [start: number, end: number]
  | [start: number, end: number, step: number]

function interpretRangeArgs(args: RangeArgs): {
  start: number
  end: number
  step: number
} {
  if (args.length === 1) return { start: 0, end: args[0], step: 1 }
  if (args.length === 2) return { start: args[0], end: args[1], step: 1 }
  return { start: args[0], end: args[1], step: args[2] }
}

export function range(...args: RangeArgs) {
  const { start, end, step } = interpretRangeArgs(args)
  const result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}
