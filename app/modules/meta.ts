import type { HtmlMetaDescriptor } from "@remix-run/node"
import { $path } from "remix-routes"

const appDomain = "anigreen.mapleleaf.dev"

export const getAppMeta = (titlePrefix?: string): HtmlMetaDescriptor => {
  const title = [titlePrefix, "anigreen"].filter(Boolean).join(" | ")
  const description = "your week in anime 🌠"
  return {
    title,
    description,

    "og:url": `https://${appDomain}` + $path("/schedule"),
    "og:title": title,
    "og:description": description,
    "og:image": `https://${appDomain}/banner.png`,

    "twitter:card": "summary_large_image",
    "twitter:domain": appDomain,
    "twitter:url": `https://${appDomain}` + $path("/schedule"),
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": `https://${appDomain}/banner.png`,
  }
}
