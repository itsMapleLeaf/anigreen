export function mapGetWithFallback<Key, Value>(
  map: Map<Key, Value>,
  key: Key,
  fallback: Value,
): Value {
  let value = map.get(key)
  if (value === undefined) {
    value = fallback
    map.set(key, value)
  }
  return value
}
