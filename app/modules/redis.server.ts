import type { RedisClientType } from "redis"
import { commandOptions, createClient } from "redis"

export async function redisGetBuffer(key: string) {
  const client = await getRedisClient()
  return client.get(commandOptions({ returnBuffers: true }), key)
}

export async function redisSet(
  key: string,
  value: string | Buffer,
  { expiryMs }: { expiryMs?: number } = {},
) {
  const client = await getRedisClient()
  return client.set(key, value, { PX: expiryMs })
}

function getRedisClient() {
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
  const client = createClient<{}, {}, {}>({ url: process.env.REDIS_URL })
  await client.connect()
  return client
}

declare global {
  var redisClientPromise: Promise<RedisClientType> | undefined
}
