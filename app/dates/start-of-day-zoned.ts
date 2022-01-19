import { addMilliseconds, subMilliseconds } from "date-fns"
import { getTimezoneOffset } from "date-fns-tz"

export function startOfDayZoned(date: Date, timezone: string) {
  const timezoneOffset = getTimezoneOffset(timezone)
  const dateWithoutZone = addMilliseconds(date, timezoneOffset)
  const dateWithoutTime = subMilliseconds(
    dateWithoutZone,
    dateWithoutZone.getTime() % (24 * 60 * 60 * 1000),
  )
  return subMilliseconds(dateWithoutTime, timezoneOffset)
}
