import "./commands"

const ignoredErrors = [
  // react's streaming server render doesn't like cypress right now
  "Hydration failed because the initial UI does not match what was rendered on the server.",
  "There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.",
]

Cypress.on("uncaught:exception", (err) => {
  if (ignoredErrors.some((error) => err.message.includes(error))) {
    return false
  }
})
