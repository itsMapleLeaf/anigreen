import type { Key, ReactNode } from "react"
import { mapGetWithFallback } from "~/modules/common/map-get-with-fallback"
import { DateTime } from "~/modules/dates/date-time"
import { startOfDayZoned } from "~/modules/dates/start-of-day-zoned"
import { GridSection } from "./grid-section"

export function WeekdaySectionedList<T>({
  items,
  timezone,
  getItemDate,
  getItemKey,
  renderItem,
}: {
  items: T[]
  timezone: string
  getItemDate: (item: T) => number | Date | undefined
  getItemKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
}) {
  const listsByDay = new Map<number, T[]>()
  const notAiring: T[] = []
  for (const item of items) {
    const date = getItemDate(item)

    if (date === undefined) {
      notAiring.push(item)
      continue
    }

    mapGetWithFallback(
      listsByDay,
      startOfDayZoned(date, timezone).getTime(),
      [],
    ).push(item)
  }

  return (
    <>
      {[...listsByDay.keys()]
        .sort((a, b) => a - b)
        .map((day) => ({ day, items: listsByDay.get(day)! }))
        .map(({ day, items }) => (
          <GridSection
            key={day}
            title={<DateTime date={day} weekday="long" />}
            subtitle={<DateTime date={day} dateStyle="long" />}
          >
            {items.map((item) => (
              <li key={getItemKey(item)}>{renderItem(item)}</li>
            ))}
          </GridSection>
        ))}
      {notAiring.length > 0 && (
        <GridSection title="Not airing">
          {notAiring.map((item) => (
            <li key={getItemKey(item)}>{renderItem(item)}</li>
          ))}
        </GridSection>
      )}
    </>
  )
}
