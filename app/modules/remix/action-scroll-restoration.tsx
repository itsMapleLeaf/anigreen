import { useTransition } from "@remix-run/react"
import { useLayoutEffect, useState } from "react"
import { ClientOnly } from "./client-only"

// fetcher actions scroll the page to the top after the redirect,
// and this is a workaround to keep that from happening
export function ActionScrollRestoration() {
  return (
    <ClientOnly>
      <ActionScrollRestorationClient />
    </ClientOnly>
  )
}

function ActionScrollRestorationClient() {
  const transition = useTransition()
  const [lastTransition, setLastTransition] = useState(transition)

  useLayoutEffect(() => {
    if (lastTransition === transition) return
    setLastTransition(transition)

    if (
      transition.type === "idle" &&
      lastTransition.type === "fetchActionRedirect"
    ) {
      const top = window.scrollY
      requestAnimationFrame(() => {
        window.scrollTo({ top })
      })
    }
  }, [lastTransition, transition])

  return <></>
}
