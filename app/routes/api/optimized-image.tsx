import type { DataFunctionArgs } from "@remix-run/node"
// eslint-disable-next-line unicorn/import-style, unicorn/prefer-node-protocol
import { extname } from "path"
import { $path } from "remix-routes"
import { z } from "zod"
import { hash } from "~/modules/common/hash.server"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { redisGetBuffer, redisSet } from "~/modules/redis.server"
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

  const cachedImage = await redisGetBuffer(cacheKey).catch((error) => {
    console.warn("Failed to get cached image:", error)
  })

  if (cachedImage) {
    return new Response(cachedImage, {
      status: 200,
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
        "Content-Type": `image/${extname(params.imageUrl)}`,
        "Cache-Control": "public, max-age=5184000",
      },
    })
  }

  // failing to cache isn't fatal, but we still want to know if it happens
  await redisSet(cacheKey, resized, {
    expiryMs: 1000 * 60 * 60 * 24 * 7,
  }).catch((error) => console.warn("Failed to cache image:", error))

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
  return $path("/api/optimized-image", {
    imageUrl,
    width: String(width),
    height: String(height),
  })
}
