import schedule from "../../test/fixtures/schedule.json"

describe("schedule", () => {
  it("shows paginated schedule items with dates", () => {
    const nextButton = () => cy.findByTestId("schedule-pagination-next")
    const previousButton = () => cy.findByTestId("schedule-pagination-previous")

    function assertPageTitles(pageNumber: number) {
      const page = schedule.pages[pageNumber - 1]

      const titles = page?.Page.airingSchedules
        .map(
          (item) =>
            item.media.title.userPreferred ||
            item.media.title.english ||
            item.media.title.romaji,
        )
        .filter(Boolean)

      for (const title of titles!) {
        cy.findAllByText(title).should("be.visible")
      }
    }

    cy.visit("/schedule")

    nextButton().should("be.visible")
    previousButton().should("not.exist")
    assertPageTitles(1)
    cy.findByText(/tuesday/i).should("be.visible")

    nextButton().click()

    previousButton().should("be.visible")
    nextButton().should("be.visible")
    cy.url().should("include", "page=2")
    assertPageTitles(2)
    cy.findByText(/tuesday/i).should("be.visible")
    cy.findByText(/wednesday/i).should("be.visible")

    nextButton().click()

    previousButton().should("be.visible")
    nextButton().should("not.exist")
    cy.url().should("include", "page=3")
    assertPageTitles(3)
    cy.findByText(/wednesday/i).should("be.visible")
    cy.findByText(/thursday/i).should("be.visible")

    previousButton().click()

    previousButton().should("be.visible")
    nextButton().should("be.visible")
    cy.url().should("include", "page=2")
    assertPageTitles(2)
    cy.findByText(/tuesday/i).should("be.visible")
    cy.findByText(/wednesday/i).should("be.visible")

    previousButton().click()

    nextButton().should("be.visible")
    previousButton().should("not.exist")
    cy.url().should("include", "page=1")
    assertPageTitles(1)
    cy.findByText(/tuesday/i).should("be.visible")
  })
})
