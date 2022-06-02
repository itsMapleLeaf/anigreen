import { useEffect, useState } from "react"

let isClient = false

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(isClient)

  useEffect(() => {
    isClient = true
    setVisible(true)
  }, [])

  return <>{visible && children}</>
}
