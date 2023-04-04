export async function promiseAllObject<
  Promises extends Record<string, unknown>,
>(promises: Promises) {
  const result = {} as { [key: string]: unknown }
  await Promise.all(
    Object.entries(promises).map(async ([key, promise]) => {
      result[key] = await promise
    }),
  )
  return result as { [Key in keyof Promises]: Awaited<Promises[Key]> }
}
