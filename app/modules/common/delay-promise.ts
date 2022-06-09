export const delayPromise =
  (ms: number) =>
  <T>(value: T) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
