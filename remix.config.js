/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "server/build/index.js",
  publicPath: "/build/",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
}
