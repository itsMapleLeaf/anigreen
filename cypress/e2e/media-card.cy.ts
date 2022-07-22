export {}

it("shows media links", () => {
  cy.visit("http://localhost:3000/schedule")

  // waits until the browser is finished with its work before we start doing things
  cy.window().then((win) => {
    return new Promise((resolve) => {
      win.requestIdleCallback(resolve, { timeout: 1000 })
    })
  })

  cy.findAllByRole(/button|combobox/, { name: /external links/i })
    .first()
    .click()

  cy.findByRole("menu", { name: /external links/i }).within(() => {
    cy.findByRole(/link|menuitem/, { name: /anilist/i })
      .then((link) => link.attr("href"))
      .should("contain", "anilist.co")
  })
})
