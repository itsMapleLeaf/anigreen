import type { LoaderFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
import { createAnilistLoginUrl } from "~/anilist"

export const loader: LoaderFunction = () => redirect(createAnilistLoginUrl())
