import { json } from "@remix-run/node"
import type { z, ZodTypeDef } from "zod"

export async function requireValidBody<Output>(
  request: Request,
  // this type requires that the schema accept only string values as input,
  // but it can transform to any output
  schema: z.ZodSchema<Output, ZodTypeDef, Record<string, string>>,
): Promise<Output> {
  const result = await schema.safeParseAsync(
    Object.fromEntries(await request.formData()),
  )
  if (result.success) return result.data
  throw json({ error: result.error.toString() }, 400)
}
