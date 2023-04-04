import { redirect } from "@vercel/remix"
import { $path } from "remix-routes"

export function redirectBack(
  request: Request,
  { fallback = $path("/"), ...init }: ResponseInit & { fallback?: string } = {},
): Response {
  return redirect(request.headers.get("Referer") || fallback, init)
}
