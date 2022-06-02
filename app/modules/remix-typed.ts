import { json } from "@remix-run/node"
import type { JsonValue, ResponseTyped } from "remix-typed"

// this function is broken in remix-typed
export function jsonTyped<T extends JsonValue>(
  data: T,
  init?: ResponseInit | number,
) {
  return json(data, init) as ResponseTyped<T>
}
