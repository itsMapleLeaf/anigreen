import { expect, test } from "vitest"
import { startOfDayZoned } from "./start-of-day-zoned"

test("startOfDayZoned", () => {
  expect(
    startOfDayZoned(new Date("2022-01-01T03:00-05:00"), "America/New_York"),
  ).toEqual(new Date("2022-01-01T00:00-05:00"))
  expect(
    startOfDayZoned(new Date("2022-01-01T21:00-05:00"), "America/New_York"),
  ).toEqual(new Date("2022-01-01T00:00-05:00"))
  expect(
    startOfDayZoned(new Date("2022-01-02T03:00-05:00"), "America/New_York"),
  ).toEqual(new Date("2022-01-02T00:00-05:00"))
})
