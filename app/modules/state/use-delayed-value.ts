import { useEffect, useState } from "react"

export function useDelayedValue<Value>(value: Value, delay: number) {
  const [delayedValue, setDelayedValue] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDelayedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return delayedValue
}
