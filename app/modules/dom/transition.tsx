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
    } else {
      statusDispatch("hide")
    }
  }, [props.visible])

  useEffect(() => {
    if (status === "mounted") {
      statusDispatch("mountFinished")
    }
  }, [status])

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
        className: cx(
          props.className,
          (status === "entering" || status === "entered") && props.inClassName,
          (status === "mounted" || status === "exiting") && props.outClassName,
        ),
        ref: elementRef,
      })}
    </>
  )
}
