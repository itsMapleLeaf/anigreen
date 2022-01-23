import type { Key, ReactNode } from "react"
import { DateTime } from "~/dates/date-time"
import { startOfDayZoned } from "~/dates/start-of-day-zoned"
import { mapGetWithFallback } from "~/helpers/map-get-with-fallback"

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

function GridSection({
  title,
  subtitle,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <h2 className="my-4">
        <div className="text-2xl font-light leading-tight">{title}</div>
        {subtitle != undefined && (
          <div className="text-sm opacity-60">{subtitle}</div>
        )}
      </h2>
      <ul className="grid gap-4 my-6 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
        {children}
      </ul>
    </>
  )
}
