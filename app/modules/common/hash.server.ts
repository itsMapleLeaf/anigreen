import type { BinaryLike } from "node:crypto"
import { createHash } from "node:crypto"

export function hash(content: BinaryLike) {
  return createHash("sha512").update(content).digest("hex").slice(0, 32)
}
