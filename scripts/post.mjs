// @ts-check
import { writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// remix is writing things to this file (???),
// which breaks graphql codegen (??????)
await writeFile(
  join(
    __dirname,
    "../node_modules/@babel/types/lib/ast-types/generated/index.js",
  ),
  "",
)
