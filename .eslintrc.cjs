require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve("@itsmapleleaf/configs/eslint")],
  ignorePatterns: [
    "**/node_modules/**",
    "**/generated/**",
    "**/build/**",
    "**/.cache/**",
    "**/*.out.*",
  ],
  parserOptions: {
    project: require.resolve("./tsconfig.json"),
  },
}
