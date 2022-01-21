/**
 * Returns a new array with a separator in between each item
 */
export function infix<Separator, Item>(
  items: Item[],
  separator: (index: number) => Separator,
): Array<Item | Separator> {
  return [
    ...items.slice(0, 1),
    ...items.slice(1).flatMap((item, index) => [separator(index - 1), item]),
  ]
}
