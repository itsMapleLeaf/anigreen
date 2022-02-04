import { Content, Root, Trigger } from "@radix-ui/react-popover"
import type { Target } from "framer-motion"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactElement, ReactNode } from "react"
import { useState } from "react"

const enter: Target = {
  opacity: 1,
  scale: 1,
  rotateX: 0,
  transformPerspective: 100,
}

const exit: Target = {
  opacity: 0,
  scale: 0.9,
  rotateX: -20,
  transformPerspective: 100,
}

export function Popover({
  trigger,
  children,
}: {
  trigger: ReactElement
  children: ReactNode
}) {
  const [visible, setVisible] = useState(false)

  return (
    <Root open={visible} onOpenChange={setVisible}>
      <Trigger asChild>{trigger}</Trigger>
      <AnimatePresence>
        {visible && (
          <Content forceMount asChild sideOffset={12}>
            <motion.div
              transition={{ type: "spring", duration: 0.4 }}
              initial={exit}
              animate={enter}
              exit={exit}
            >
              {children}
            </motion.div>
          </Content>
        )}
      </AnimatePresence>
    </Root>
  )
}
