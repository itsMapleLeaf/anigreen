export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export function raise(error: unknown): never {
  throw typeof error === "string" ? new Error(error) : error
}
