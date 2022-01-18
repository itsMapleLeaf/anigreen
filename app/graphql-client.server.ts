import { ApolloClient, InMemoryCache } from "@apollo/client"

const cache = new InMemoryCache()

export function createClient() {
  return new ApolloClient({
    uri: "https://graphql.anilist.co/",
    cache,
  })
}

export function createAuthenticatedClient(accessToken: string) {
  return new ApolloClient({
    uri: "https://graphql.anilist.co/",
    cache,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })
}
