import { z } from "zod"

const result = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    ANILIST_CLIENT_ID: z.string(),
    ANILIST_CLIENT_SECRET: z.string(),
    ANILIST_REDIRECT_URI: z.string(),
    COOKIE_SECRET: z.string(),
  })
  .safeParse(process.env)

if (!result.success) {
  const fieldErrors = JSON.stringify(
    result.error.flatten().fieldErrors,
    undefined,
    2,
  )
  throw new Error(`env validation failed: ${fieldErrors}`)
}

export const env = result.data
