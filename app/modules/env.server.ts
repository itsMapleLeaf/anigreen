import { raise } from "./common/errors"

const getEnv = (name: string) =>
  process.env[name] ?? raise(`Missing environment variable: ${name}`)

export const env = {
  ANILIST_API_URL: getEnv("ANILIST_API_URL"),
  ANILIST_AUTH_TOKEN_URL: getEnv("ANILIST_AUTH_TOKEN_URL"),
  ANILIST_CLIENT_ID: getEnv("ANILIST_CLIENT_ID"),
  ANILIST_CLIENT_SECRET: getEnv("ANILIST_CLIENT_SECRET"),
  ANILIST_REDIRECT_URI: getEnv("ANILIST_REDIRECT_URI"),
  COOKIE_SECRET: getEnv("COOKIE_SECRET"),
  REDIS_URL: getEnv("REDIS_URL"),
}
