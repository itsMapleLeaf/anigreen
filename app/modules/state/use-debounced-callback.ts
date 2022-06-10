import { debounce } from "lodash-es"
import { useEffect, useMemo, useRef } from "react"
import { raise } from "../common/errors"

export function useDebouncedCallback<F extends (...args: any[]) => void>(
  callback: F,
) {
  const ref = useRef<(...args: Parameters<F>) => void>(() =>
    raise("You cannot call a debounced callback during render"),
  )

  useEffect(() => {
    ref.current = callback
  })

  return useMemo(
    () => debounce((...args: Parameters<F>) => ref.current(...args), 500),
    [],
  )
}
