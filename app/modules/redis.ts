import type { RedisClientType } from "redis"
import { createClient } from "redis"

export function getRedisClient() {
  if (globalThis.redisClientPromise) {
    return globalThis.redisClientPromise
  }

  const promise = createConnectedClient().catch((error) => {
    globalThis.redisClientPromise = undefined
    throw error
  })

  return (globalThis.redisClientPromise = promise)
}

async function createConnectedClient() {
  const client = createClient<{}, {}, {}>()
  await client.connect()
  return client
}

declare global {
  var redisClientPromise: Promise<RedisClientType> | undefined
}
