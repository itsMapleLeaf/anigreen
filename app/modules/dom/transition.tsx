import type { ReactElement } from "react"
import { useEffect, useReducer, useState } from "react"
import { cx } from "twind"
import { useElementEvent } from "~/modules/dom/use-event"

type TransitionStatus =
  | "unmounted"
  | "mounted"
  | "entering"
  | "entered"
  | "exiting"

type TransitionEvent = "show" | "hide" | "mountFinished" | "transitionEnd"

type TransitionMachine = {
  states: {
    [Key in TransitionStatus]?: {
      on: {
        [Key in TransitionEvent]?: TransitionStatus
      }
    }
  }
}

const transitionMachine: TransitionMachine = {
  states: {
    unmounted: {
      on: {
        show: "mounted",
      },
    },
    mounted: {
      on: {
        hide: "unmounted",
        mountFinished: "entering",
      },
    },
    entering: {
      on: {
        transitionEnd: "entered",
        hide: "exiting",
      },
    },
    entered: {
      on: {
        hide: "exiting",
      },
    },
    exiting: {
      on: {
        transitionEnd: "unmounted",
        show: "entering",
      },
    },
  },
}

const transitionReducer = (status: TransitionStatus, action: TransitionEvent) =>
  transitionMachine.states[status]?.on[action] ?? status

type TransitionRenderProps = {
  className: string
  ref: (node: HTMLElement | null | undefined) => void
}

type TransitionRenderFunction = (
  props: TransitionRenderProps,
) => React.ReactNode

export function Transition({
  visible,
  className,
  inClassName,
  outClassName,
  children,
}: {
  visible: boolean
  className: string
  inClassName: string
  outClassName: string
  children: ReactElement | TransitionRenderFunction
}) {
  const [status, statusDispatch] = useReducer(
    transitionReducer,
    visible ? "entered" : "unmounted",
  )

  useEffect(() => {
    if (visible) {
      statusDispatch("show")

      // this extra timeout should help ensure the screen has painted before starting the transition
      setTimeout(() => statusDispatch("mountFinished"))
    } else {
      statusDispatch("hide")
    }
  }, [visible])

  const [element, elementRef] = useState<HTMLElement | null>()
  useElementEvent(element, "transitionend", () => {
    statusDispatch("transitionEnd")
  })

  if (status === "unmounted") {
    return <></>
  }

  const transitionedElementProps: TransitionRenderProps = {
    className: cx(
      className,
      (status === "entering" || status === "entered") && inClassName,
      (status === "mounted" || status === "exiting") && outClassName,
    ),
    ref: elementRef,
  }

  if (typeof children !== "function") {
    return <div {...transitionedElementProps}>{children}</div>
  }

  return <>{children(transitionedElementProps)}</>
}
