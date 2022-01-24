import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useRef } from "react"
import { raise } from "~/modules/common/errors"

export function LazyImage({
  src,
  alt,
  className,
  onLoad,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = imageRef.current ?? raise("image ref not assigned")
    if (image.complete) return

    image.classList.add("opacity-0")
    const handleLoad = () => {
      image.classList.remove("opacity-0")
      image.classList.add("opacity-100")
    }
    image.addEventListener("load", handleLoad)
    return () => image.removeEventListener("load", handleLoad)
  }, [])

  return (
    <img
      {...props}
      loading="lazy"
      ref={imageRef}
      src={src}
      alt={alt}
      className={clsx(className, "transition")}
    />
  )
}
