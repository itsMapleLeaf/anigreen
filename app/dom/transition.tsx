import clsx from "clsx"
import { useEffect, useReducer, useState } from "react"
import { useElementEvent } from "~/dom/use-event"

type TransitionStatus =
  | "unmounted"
  | "mounted"
  | "entering"
  | "entered"
  | "exiting"

type TransitionEvent = "show" | "hide" | "animationFrame" | "transitionEnd"

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
        animationFrame: "entering",
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

export function Transition(props: {
  visible: boolean
  className: string
  inClassName: string
  outClassName: string
  children: (props: {
    className: string
    ref: (node: HTMLElement | null | undefined) => void
  }) => React.ReactNode
}) {
  const [status, statusDispatch] = useReducer(
    transitionReducer,
    props.visible ? "entered" : "unmounted",
  )

  useEffect(() => {
    if (props.visible) {
      statusDispatch("show")
      requestAnimationFrame(() => {
        statusDispatch("animationFrame")
      })
    } else {
      statusDispatch("hide")
    }
  }, [props.visible])

  const [element, elementRef] = useState<HTMLElement | null>()
  useElementEvent(element, "transitionend", () => {
    statusDispatch("transitionEnd")
  })

  if (status === "unmounted") {
    return <></>
  }

  return (
    <>
      {props.children({
        className: clsx(
          props.className,
          (status === "entering" || status === "entered") && props.inClassName,
          (status === "mounted" || status === "exiting") && props.outClassName,
        ),
        ref: elementRef,
      })}
    </>
  )
}
