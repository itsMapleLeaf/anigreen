import type { ComponentPropsWithoutRef } from "react"

export function LazyImage({
  src,
  alt,
  className,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  return (
    <div className={className}>
      <img
        {...props}
        loading="lazy"
        ref={(image) => {
          if (!image) return
          if (image.complete) return

          image.style.opacity = "0"
          const handleLoad = () => {
            image.style.opacity = "1"
          }
          image.addEventListener("load", handleLoad, { once: true })
        }}
        className="transition-opacity w-full h-full object-cover"
        src={src}
        alt={alt}
      />
    </div>
  )
}
