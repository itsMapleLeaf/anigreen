export function filterJoin(
  separator: string,
  values: Array<string | number | boolean | undefined | null>,
) {
  return values
    .filter((value) => {
      if (value == undefined) return false
      if (typeof value === "boolean") return false
      if (value === "") return false
      return true
    })
    .join(separator)
}
