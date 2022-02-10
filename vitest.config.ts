import { defineConfig } from "vite"

export default defineConfig({
  esbuild: {
    include: ["**/*.{ts,tsx,mts,cts}"],
    loader: "tsx",
  },
})
