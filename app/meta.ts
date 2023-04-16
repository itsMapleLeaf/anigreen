import { type V2_HtmlMetaDescriptor } from "@vercel/remix"
import bannerAsset from "~/assets/banner.png"

const origin = `https://anigreen.mapleleaf.dev`

export const getAppMeta = (titlePrefix?: string): V2_HtmlMetaDescriptor[] => {
  const title = [titlePrefix, "anigreen"].filter(Boolean).join(" | ")
  const description = "your week in anime 🌠"
  const scheduleUrl = new URL("/schedule", origin).href
  const bannerUrl = new URL(bannerAsset, origin).href

  return [
    { title },
    { name: "description", content: description },

    { property: "og:url", content: scheduleUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: bannerUrl },

    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:domain", content: origin },
    { property: "twitter:url", content: scheduleUrl },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: bannerUrl },
  ]
}
