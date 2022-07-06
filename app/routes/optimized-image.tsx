import type { DataFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"
import { hash } from "~/modules/common/hash.server"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { getRedisClient } from "~/modules/redis"
import { resizeImage } from "~/modules/resize-image.server"

export async function loader({ request }: DataFunctionArgs) {
  const inputSchema = z.object({
    imageUrl: z.string(),
    width: z.string().transform(parseUnsignedInteger),
    height: z.string().transform(parseUnsignedInteger),
  })

  const params = inputSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  )

  const imageUrlHash = hash(params.imageUrl)
  const imageFile = `${imageUrlHash}-${params.width}x${params.height}.webp`
  const cacheKey = `optimized-image:${imageFile}`

  const redis = await getRedisClient().catch((error) => {
    console.warn("Failed to get redis client:", error)
  })

  const cachedImage = await redis?.get(cacheKey).catch((error) => {
    console.warn("Failed to get cached image:", error)
  })

  if (cachedImage) {
    return redirect(cachedImage, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=5184000",
      },
    })
  }

  const image = await fetch(params.imageUrl)
    .then((res) => res.arrayBuffer())
    .catch((error) => console.warn("Failed to fetch image:", error))

  if (!image) {
    return new Response(undefined, { status: 500 })
  }

  const resized = await resizeImage(
    Buffer.from(image),
    params.width,
    params.height,
  ).catch((error) => console.warn("Failed to resize image:", error))

  if (!resized) {
    // if we couldn't resize the image, send the original image as a fallback
    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    })
  }

  // failing to cache isn't fatal, but we still want to know if it happens
  await redis
    ?.set(cacheKey, resized, { PX: 1000 * 60 * 60 * 24 * 7 })
    .catch((error) => console.warn("Failed to cache image:", error))

  return new Response(resized.buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=5184000",
    },
  })
}

export function getOptimizedImageUrl(
  imageUrl: string,
  width: number,
  height: number,
) {
  const params = new URLSearchParams({
    imageUrl,
    width: String(width),
    height: String(height),
  })
  return `/optimized-image?${params.toString()}`
}
