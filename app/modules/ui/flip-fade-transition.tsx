import type { Target } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import { autoRef } from "../react/auto-ref"

const enter: Target = {
  opacity: 1,
  transformPerspective: 100,
  scale: 1,
  rotateX: 0,
}

const exit: Target = {
  opacity: 0,
  transformPerspective: 100,
  scale: 0.9,
  rotateX: -20,
}

export const FlipFadeTransition = autoRef(function FlipFadeTransition({
  visible,
  children,
  ref,
}: {
  visible: boolean
  children?: ReactNode
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          transition={{ type: "tween", duration: 0.2 }}
          initial={exit}
          animate={enter}
          exit={exit}
          ref={ref}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})
