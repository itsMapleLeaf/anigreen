/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: ["lodash-es"],
  devServerPort: 8002,
  future: {
    unstable_tailwind: true,
    unstable_cssSideEffectImports: true,
  },
}
