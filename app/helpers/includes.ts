/** Version of array.includes which narrows the item type */
export function includes<T>(items: T[], item: unknown): item is T {
  return items.includes(item as T)
}
