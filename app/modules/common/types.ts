export type MaybeRecord<Key extends PropertyKey, Value> = { [_ in Key]?: Value }

export type Falsy = false | 0 | "" | null | undefined

export type Nullish<T> = T | null | undefined
