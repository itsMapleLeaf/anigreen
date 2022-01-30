import presetLineClamp from "@twind/preset-line-clamp"
import { setup } from "@twind/tailwind"
import tailwindConfig from "../tailwind.config.cjs"

export function setupTwind() {
  setup({
    ...tailwindConfig,
    presets: [presetLineClamp()],
  })
}
