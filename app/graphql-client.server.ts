import { ApolloClient, InMemoryCache } from "@apollo/client"

const caches = new Map<string | symbol, InMemoryCache>()
const globalCacheKey = Symbol("globalCacheKey")

function getCache(key: string | symbol): InMemoryCache {
  let cache = caches.get(key)
  if (!cache) {
    cache = new InMemoryCache()
    caches.set(key, cache)
  }
  return cache
}

export function createClient() {
  return new ApolloClient({
    uri: "https://graphql.anilist.co/",
    cache: getCache(globalCacheKey),
  })
}

export function createAuthenticatedClient(accessToken: string) {
  return new ApolloClient({
    uri: "https://graphql.anilist.co/",
    cache: getCache(accessToken),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })
}
