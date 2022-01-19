import { ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { Fragment } from "react"
import type { MetaFunction } from "remix"
import { Link, useNavigate } from "remix"
import { buttonClass } from "~/components"
import { DateTime } from "~/dom/date-time"
import { useWindowEvent } from "~/dom/use-event"
import { getAppTitle } from "~/meta"
import { useLoaderDataTyped } from "~/remix-typed"
import { loadScheduleData } from "~/schedule/data.server"
import { KeyboardKey } from "../ui/keyboard-key"

export const meta: MetaFunction = () => ({
  title: getAppTitle("Schedule"),
})

export async function loader({ request }: DataFunctionArgs) {
  let page = Number(new URL(request.url).searchParams.get("page"))
  if (!Number.isFinite(page) || page < 1) {
    page = 1
  }

  return {
    schedule: await loadScheduleData(page),
  }
}

export default function Schedule() {
  return (
    <>
      <ScheduleItems />
      <Pagination />
    </>
  )
}

function ScheduleItems() {
  const { schedule } = useLoaderDataTyped<typeof loader>()

  return (
    <>
      {schedule.dayLists.map(({ day, items }) => (
        <Fragment key={day}>
          <h2 className="my-4">
            <div className="text-2xl font-light leading-tight">
              <DateTime date={day} weekday="long" />
            </div>
            <div className="text-sm opacity-60">
              <DateTime date={day} dateStyle="long" />
            </div>
          </h2>
          <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] my-6">
            {items.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  )
}

function Pagination() {
  const { schedule } = useLoaderDataTyped<typeof loader>()
  const { previousPage, nextPage } = schedule

  const navigate = useNavigate()
  useWindowEvent("keydown", (event) => {
    if (event.key === "ArrowLeft" && previousPage != undefined) {
      event.preventDefault()
      navigate(`?page=${previousPage}`)
    }
    if (event.key === "ArrowRight" && nextPage != undefined) {
      event.preventDefault()
      navigate(`?page=${nextPage}`)
    }
  })

  return (
    <div className="flex items-center justify-center gap-4">
      {previousPage != undefined ? (
        <Link
          to={`?page=${previousPage}`}
          className={buttonClass({ variant: "clear" })}
        >
          <KeyboardKey label="Left arrow">
            <ArrowSmLeftIcon className="w-5" />
          </KeyboardKey>
          Previous Page
        </Link>
      ) : undefined}
      {nextPage != undefined ? (
        <Link
          to={`?page=${nextPage}`}
          className={buttonClass({ variant: "clear" })}
        >
          <KeyboardKey label="Right arrow">
            <ArrowSmRightIcon className="w-5" />
          </KeyboardKey>
          Next Page
        </Link>
      ) : undefined}
    </div>
  )
}
