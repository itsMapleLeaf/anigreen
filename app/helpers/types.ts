export type MaybeRecord<Key extends PropertyKey, Value> = { [_ in Key]?: Value }
