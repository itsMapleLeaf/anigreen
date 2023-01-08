import type { Key, ReactNode } from "react"
import { useMemo } from "react"
import { mapGetWithFallback } from "~/modules/common/map-get-with-fallback"
import { DateTime } from "~/modules/dates/date-time"
import { startOfDayZoned } from "~/modules/dates/start-of-day-zoned"
import { useLatestRef } from "../react/use-latest-ref"
import { GridSection } from "./grid-section"

export function WeekdaySectionedList<T>({
  items,
  timezone,
  getItemDate,
  getItemKey,
  renderItem,
  sortWithinDay,
}: {
  items: T[]
  timezone: string
  getItemDate: (item: T) => number | Date | undefined
  getItemKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
  sortWithinDay?: (a: T, b: T) => number
}) {
  const getItemDateRef = useLatestRef(getItemDate)
  const sortWithinDayRef = useLatestRef(sortWithinDay)

  const { listsByDay, notAiring } = useMemo(() => {
    const listsByDay = new Map<number, T[]>()
    const notAiring: T[] = []
    for (const item of items) {
      const date = getItemDateRef.current(item)

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

    if (sortWithinDayRef.current) {
      for (const list of listsByDay.values()) {
        list.sort(sortWithinDayRef.current)
      }
      notAiring.sort(sortWithinDayRef.current)
    }

    return { listsByDay, notAiring }
  }, [sortWithinDayRef, items, getItemDateRef, timezone])

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
              <div key={getItemKey(item)}>{renderItem(item)}</div>
            ))}
          </GridSection>
        ))}
      {notAiring.length > 0 && (
        <GridSection title="Not airing">
          {notAiring.map((item) => (
            <div key={getItemKey(item)}>{renderItem(item)}</div>
          ))}
        </GridSection>
      )}
    </>
  )
}
