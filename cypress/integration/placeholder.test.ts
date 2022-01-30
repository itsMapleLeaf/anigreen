export {}

it("shows the logo", () => {
  cy.visit("/")
  cy.contains("anigreen").should("be.visible")
})
