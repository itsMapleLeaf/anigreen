import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useState } from "react"

export function LazyImage({
  src,
  alt,
  className,
  onLoad,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const [loaded, setLoaded] = useState(false)
  const [image, imageRef] = useState<HTMLImageElement | null>()

  useEffect(() => {
    if (!image) return
    if (image.complete) {
      setLoaded(true)
    } else {
      const handleLoad = () => setLoaded(true)
      image.addEventListener("load", handleLoad)
      return () => image.removeEventListener("load", handleLoad)
    }
  }, [image])

  return (
    <img
      {...props}
      loading="lazy"
      ref={imageRef}
      src={src}
      alt={alt}
      className={clsx(
        className,
        "transition",
        loaded ? "opacity-100" : "opacity-0",
      )}
    />
  )
}
