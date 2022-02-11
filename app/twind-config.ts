import presetLineClamp from "@twind/preset-line-clamp"
import presetTailwind from "@twind/preset-tailwind"
import { defineConfig } from "twind"
import tailwindConfig from "../tailwind.config.cjs"

export const twindConfig = defineConfig({
  ...tailwindConfig,
  presets: [presetTailwind(), presetLineClamp()],
  preflight: {
    "@layer base": {
      button: {
        textAlign: "left",
        fontWeight: "inherit",
      },
    },
  },
})
