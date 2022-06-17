import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useRef } from "react"
import { raise } from "../common/errors"

export function LazyImage({
  src,
  alt,
  className,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = ref.current ?? raise("ref not assigned")

    const handleLoad = () => {
      image.style.opacity = "1"
    }

    if (image.complete) {
      handleLoad()
    } else {
      image.addEventListener("load", handleLoad, { once: true })
    }
  }, [])

  return (
    <div className={className}>
      <img
        {...props}
        loading="lazy"
        style={{ opacity: 0 }}
        ref={ref}
        className="transition-opacity w-full h-full object-cover"
        src={src}
        alt={alt}
      />
    </div>
  )
}
