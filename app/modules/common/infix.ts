/**
 * Returns a new array with a separator in between each item
 */
export function infix<Item>(
  items: Item[],
  separator: (index: number) => Item,
): Item[] {
  return [
    ...items.slice(0, 1),
    ...items.slice(1).flatMap((item, index) => [separator(index - 1), item]),
  ]
}
