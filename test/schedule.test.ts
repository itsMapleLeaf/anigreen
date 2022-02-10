import { expect } from "@playwright/test"
import type { ChromiumBrowser, Page } from "playwright"
import { chromium } from "playwright"
import { afterAll, afterEach, beforeEach, describe, it } from "vitest"
import type { ServerHandle } from "../server/server.mjs"
import { startServer } from "../server/server.mjs"
import { anilistApiMockServer } from "./anilist-api-mock-server.mjs"
import schedule from "./fixtures/schedule.json"

let server: ServerHandle
let mockServer = false
beforeEach(async () => {
  if (!mockServer) {
    anilistApiMockServer.listen()
    mockServer = true
  }

  server = await startServer({ port: 8888 })
})
afterEach(() => {
  server.stop()
  anilistApiMockServer.close()
})

let browser: ChromiumBrowser
let page: Page
beforeEach(async () => {
  browser ??= await chromium.launch({
    headless: process.env.CI !== undefined,
  })
  page = await browser.newPage()
})
afterAll(async () => {
  await browser.close()
})

describe("schedule", () => {
  it("shows paginated schedule items with dates", async () => {
    const nextButton = () =>
      page.locator("[data-testid=schedule-pagination-next]")

    const previousButton = () =>
      page.locator("[data-testid=schedule-pagination-previous]")

    const dayHeader = (day: string) => page.locator(`text=${day}`)

    async function assertPageTitles(pageNumber: number) {
      const pageData = schedule.pages[pageNumber - 1]

      const titles = pageData?.Page.airingSchedules
        .map(
          (item) =>
            item.media.title.userPreferred ||
            item.media.title.english ||
            item.media.title.romaji,
        )
        .filter(Boolean)

      for (const title of titles!) {
        await expect(page.locator(`text=${title}`).first()).toBeVisible()
      }
    }

    await page.goto(`${server.url}/schedule`)

    await expect(nextButton()).toBeVisible()
    await expect(previousButton()).toBeHidden()
    await assertPageTitles(1)
    await expect(dayHeader("Tuesday")).toBeVisible()

    await nextButton().click()

    await expect(previousButton()).toBeVisible()
    await expect(nextButton()).toBeVisible()
    expect(page.url()).toContain("page=2")
    await assertPageTitles(2)
    await expect(page.locator("text=Tuesday")).toBeVisible()
    await expect(page.locator("text=Wednesday")).toBeVisible()

    await nextButton().click()

    await expect(previousButton()).toBeVisible()
    await expect(nextButton()).toBeHidden()
    expect(page.url()).toContain("page=3")
    await assertPageTitles(3)
    await expect(page.locator("text=Wednesday")).toBeVisible()
    await expect(page.locator("text=Thursday")).toBeVisible()

    await previousButton().click()

    await expect(previousButton()).toBeVisible()
    await expect(nextButton()).toBeVisible()
    expect(page.url()).toContain("page=2")
    await assertPageTitles(2)
    await expect(page.locator("text=Tuesday")).toBeVisible()
    await expect(page.locator("text=Wednesday")).toBeVisible()

    await previousButton().click()

    await expect(nextButton()).toBeVisible()
    await expect(previousButton()).toBeHidden()
    expect(page.url()).toContain("page=1")
    await assertPageTitles(1)
    await expect(page.locator("text=Tuesday")).toBeVisible()
  }, 10_000)
})
