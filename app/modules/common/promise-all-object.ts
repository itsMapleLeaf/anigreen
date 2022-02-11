export async function promiseAllObject<
  Promises extends Record<string, unknown>,
>(
  promises: Promises,
): Promise<{ [Key in keyof Promises]: Awaited<Promises[Key]> }> {
  const result: any = {}
  await Promise.all(
    Object.entries(promises).map(async ([key, promise]) => {
      result[key] = await promise
    }),
  )
  return result
}
