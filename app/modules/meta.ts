import { HtmlMetaDescriptor } from "remix"

const appDomain = "anigreen.mapleleaf.dev"

export const getAppMeta = (titlePrefix?: string): HtmlMetaDescriptor => {
  const title = [titlePrefix, "anigreen"].filter(Boolean).join(" | ")
  const description = "your week in anime 🌠"
  return {
    "title": title,
    "description": description,

    "og:url": `https://${appDomain}/schedule`,
    "og:title": title,
    "og:description": description,
    "og:image": "/banner.png",

    "twitter:card": "summary_large_image",
    "twitter:domain": appDomain,
    "twitter:url": `https://${appDomain}/schedule`,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": "/banner.png",
  }
}
