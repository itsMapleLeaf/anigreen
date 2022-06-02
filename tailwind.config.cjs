module.exports = {
  content: ["app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Fira Sans", "sans-serif"],
    },
    boxShadow: {
      DEFAULT: "0 2px 5px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
