export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function delayPromise(ms: number) {
  return async <T>(value: T) => {
    await delay(ms)
    return value
  }
}
