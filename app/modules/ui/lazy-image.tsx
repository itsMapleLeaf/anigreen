import type { ComponentPropsWithoutRef } from "react"
import { useCallback } from "react"

export function LazyImage({
  src,
  alt,
  className,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const ref = useCallback((image: HTMLImageElement | null) => {
    if (!image) return

    const handleLoad = () => {
      image.style.opacity = "1"
    }

    if (image.complete) {
      requestAnimationFrame(handleLoad)
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
