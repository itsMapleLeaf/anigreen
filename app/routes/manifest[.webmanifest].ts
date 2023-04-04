import { json } from "@vercel/remix"
import logo128 from "~/assets/logo-128x.png"
import logo256 from "~/assets/logo-256x.png"
import logo32 from "~/assets/logo-32x.png"
import logo512 from "~/assets/logo-512x.png"
import logo64 from "~/assets/logo-64x.png"

const manifest = {
  $schema: "https://json.schemastore.org/web-manifest-combined",
  name: "anigreen",
  description: "a cute and sleek extension to anilist ✨",
  display: "standalone",
  background_color: "#111827",
  theme_color: "#047857",
  icons: [
    { sizes: "32x32", src: logo32, type: "image/png" },
    { sizes: "64x64", src: logo64, type: "image/png" },
    { sizes: "128x128", src: logo128, type: "image/png" },
    { sizes: "256x256", src: logo256, type: "image/png" },
    { sizes: "512x512", src: logo512, type: "image/png" },
  ],
}

export function loader() {
  return json(manifest)
}
