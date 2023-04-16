/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', "sans-serif"],
        condensed: ['"Fira Sans Condensed"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
