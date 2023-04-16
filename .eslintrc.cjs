/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve("@itsmapleleaf/configs/eslint")],
  ignorePatterns: [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/.cache/**",
    "**/public/**",
  ],
}
