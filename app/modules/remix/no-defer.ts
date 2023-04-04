import { redirect } from "@vercel/remix"
import { redirectBack } from "../network/redirect-back"

export function redirectWithNoDefer(request: Request) {
  try {
    const referrer = request.headers.get("referer")
    const url = referrer ? new URL(referrer) : new URL("/", request.url)
    url.searchParams.set("defer", "no")
    return redirect(url.toString())
  } catch (error) {
    console.warn(error)
    return redirectBack(request)
  }
}

export function shouldDefer(request: Request) {
  try {
    return new URL(request.url).searchParams.get("defer") !== "no"
  } catch (error) {
    console.warn(error)
    return false
  }
}
