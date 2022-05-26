import type { HtmlMetaDescriptor } from "@remix-run/node"

const appDomain = "anigreen.mapleleaf.dev"

export const getAppMeta = (titlePrefix?: string): HtmlMetaDescriptor => {
  const title = [titlePrefix, "anigreen"].filter(Boolean).join(" | ")
  const description = "your week in anime 🌠"
  return {
    title,
    description,

    "og:url": `https://${appDomain}/schedule`,
    "og:title": title,
    "og:description": description,
    "og:image": `https://${appDomain}/banner.png`,

    "twitter:card": "summary_large_image",
    "twitter:domain": appDomain,
    "twitter:url": `https://${appDomain}/schedule`,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": `https://${appDomain}/banner.png`,
  }
}
