// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin")

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
  plugins: [
    plugin(function sizePlugin(api) {
      api.matchUtilities(
        { s: (value) => ({ width: value, height: value }) },
        { values: api.theme("width") },
      )
    }),

    // improved animation utilities
    plugin(function animations(api) {
      const exit = {
        opacity: "var(--tw-animate-from-opacity, 1)",
        transform: `
          translate(
            var(--tw-animate-from-translate-x, 0),
            var(--tw-animate-from-translate-y, 0)
          )
          scale(
            var(--tw-animate-from-scale-x, 1),
            var(--tw-animate-from-scale-y, 1)
          )
          rotate(var(--tw-animate-from-rotate, 0))
        `,
      }

      const enter = {
        opacity: "var(--tw-animate-to-opacity, 1)",
        transform: `
          translate(
            var(--tw-animate-to-translate-x, 0),
            var(--tw-animate-to-translate-y, 0)
          )
          scale(
            var(--tw-animate-to-scale-x, 1),
            var(--tw-animate-to-scale-y, 1)
          )
          rotate(var(--tw-animate-to-rotate, 0))
        `,
      }

      api.addBase({
        "@keyframes animate-in": {
          from: exit,
          to: enter,
        },
        "@keyframes animate-out": {
          from: enter,
          to: exit,
        },
      })

      api.addUtilities({
        ".animate-in": {
          "animation-name": "animate-in",
          "animation-duration": `var(--tw-animation-duration, ${api.theme(
            "transitionDuration.DEFAULT",
          )})`,
          "animation-fill-mode": "forwards",
        },
        ".animate-out": {
          "animation-name": "animate-out",
          "animation-duration": `var(--tw-animation-duration, ${api.theme(
            "transitionDuration.DEFAULT",
          )})`,
          "animation-fill-mode": "forwards",
        },
      })

      api.matchUtilities(
        {
          "animate-from-opacity": (value) => ({
            "--tw-animate-from-opacity": value,
          }),
          "animate-to-opacity": (value) => ({
            "--tw-animate-to-opacity": value,
          }),
        },
        {
          values: api.theme("opacity"),
        },
      )

      api.matchUtilities(
        {
          "animate-from-translate-x": (value) => ({
            "--tw-animate-from-translate-x": value,
          }),
          "animate-to-translate-x": (value) => ({
            "--tw-animate-to-translate-x": value,
          }),
          "animate-from-translate-y": (value) => ({
            "--tw-animate-from-translate-y": value,
          }),
          "animate-to-translate-y": (value) => ({
            "--tw-animate-to-translate-y": value,
          }),
        },
        {
          values: api.theme("translate"),
        },
      )

      api.matchUtilities(
        {
          "animate-from-scale": (value) => ({
            "--tw-animate-from-scale-x": value,
            "--tw-animate-from-scale-y": value,
          }),
          "animate-to-scale": (value) => ({
            "--tw-animate-to-scale-x": value,
            "--tw-animate-to-scale-y": value,
          }),
          "animate-from-scale-x": (value) => ({
            "--tw-animate-from-scale-x": value,
          }),
          "animate-to-scale-x": (value) => ({
            "--tw-animate-to-scale-x": value,
          }),
          "animate-from-scale-y": (value) => ({
            "--tw-animate-from-scale-y": value,
          }),
          "animate-to-scale-y": (value) => ({
            "--tw-animate-to-scale-y": value,
          }),
        },
        {
          values: api.theme("scale"),
        },
      )

      api.matchUtilities(
        {
          "animate-from-rotate": (value) => ({
            "--tw-animate-from-rotate": value,
          }),
          "animate-to-rotate": (value) => ({
            "--tw-animate-to-rotate": value,
          }),
        },
        {
          values: api.theme("rotate"),
        },
      )

      api.matchUtilities(
        {
          "animation-duration": (value) => ({
            "--tw-animation-duration": value,
          }),
        },
        {
          values: api.theme("transitionDuration"),
        },
      )

      api.matchUtilities(
        {
          "animation-ease": (value) => ({
            "animation-timing-function": value,
          }),
        },
        {
          values: api.theme("transitionTimingFunction"),
        },
      )

      api.matchUtilities(
        {
          "animation-fill": (value) => ({
            "animation-fill-mode": value,
          }),
        },
        {
          values: {
            none: "none",
            forwards: "forwards",
            backwards: "backwards",
            both: "both",
          },
        },
      )

      api.addUtilities({
        ".animate-infinite": {
          "animation-iteration-count": "infinite",
        },
      })
    }),
  ],
  corePlugins: {
    container: false,
  },
}
