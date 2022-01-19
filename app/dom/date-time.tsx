export function DateTime({
  date,
  ...options
}: {
  date: number | string | Date
} & Intl.DateTimeFormatOptions) {
  return (
    <time dateTime={new Date(date).toISOString()}>
      {new Date(date).toLocaleDateString(undefined, options)}
    </time>
  )
}
