/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  server: "./server/main.ts",
  serverBuildPath: "server/build/index.js",
  publicPath: "/build/",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
  serverDependenciesToBundle: [
    "twind",
    "@twind/preset-line-clamp",
    "@twind/preset-tailwind",
  ],
}
