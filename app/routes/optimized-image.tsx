import type { DataFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"
import { hash } from "~/modules/common/hash.server"
import { parseUnsignedInteger } from "~/modules/common/parse-unsigned-integer"
import { getStorageFile } from "~/modules/gcp/get-storage-file.server"
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

  const storageFile = getStorageFile(imageFile)
  const [storageFileExists] = await storageFile.exists()
  if (storageFileExists) {
    return redirect(storageFile.publicUrl())
  }

  const image = await fetch(params.imageUrl).then((res) => res.arrayBuffer())

  const resized = await resizeImage(
    Buffer.from(image),
    params.width,
    params.height,
  )

  storageFile.save(resized).catch(console.error)

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
