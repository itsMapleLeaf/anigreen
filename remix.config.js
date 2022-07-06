/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  // serverBuildTarget: "vercel",
  // server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  serverDependenciesToBundle: ["lodash-es"],
  devServerPort: 8002,
}
