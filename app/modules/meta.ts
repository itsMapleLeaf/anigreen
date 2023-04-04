import type { HtmlMetaDescriptor } from "@vercel/remix"
import { $path } from "remix-routes"
import banner from "~/assets/banner.png"

const domain = "anigreen.mapleleaf.dev"
const origin = `https://${domain}`

export const getAppMeta = (titlePrefix?: string): HtmlMetaDescriptor => {
  const title = [titlePrefix, "anigreen"].filter(Boolean).join(" | ")
  const description = "your week in anime 🌠"
  const scheduleUrl = new URL($path("/schedule"), origin).href
  const bannerUrl = new URL(banner, origin).href

  return {
    title,
    description,

    "og:url": scheduleUrl,
    "og:title": title,
    "og:description": description,
    "og:image": bannerUrl,

    "twitter:card": "summary_large_image",
    "twitter:domain": origin,
    "twitter:url": scheduleUrl,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": bannerUrl,
  }
}
