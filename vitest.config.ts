import { defineConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    include: ["**/*.{ts,tsx,mts,cts}"],
    loader: "tsx",
  },
})
