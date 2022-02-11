import { XIcon } from "@heroicons/react/outline"
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/solid"
import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactElement, ReactNode } from "react"
import { useEffect, useState } from "react"
import { useFetcher } from "remix"
import { cx } from "twind"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { Button } from "../ui/button"
import {
  activeClearButtonClass,
  clearButtonClass,
  clearIconButtonClass,
  solidButtonClass,
  solidDangerButtonClass,
} from "../ui/button-style"
import { LoadingIcon } from "../ui/loading-icon"
import { Menu } from "../ui/menu"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"

export function MediaEditModal({
  children,
  media,
  watchListInfo,
}: {
  children: ReactElement
  media: AnilistMedia
  watchListInfo: AnilistMediaListEntry
}) {
  const fetcher = useFetcher()
  const [status, setStatus] = useState(watchListInfo.status)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (fetcher.type === "done") {
      setOpen(false)
    }
  }, [fetcher.type])

  const statusItems = [
    {
      status: MediaListStatus.Current,
      text: "Watching",
      icon: <PlayIcon className={Menu.leftIconClass} />,
    },
    {
      status: MediaListStatus.Paused,
      text: "Hold",
      icon: <PauseIcon className={Menu.leftIconClass} />,
    },
    {
      status: MediaListStatus.Dropped,
      text: "Drop",
      icon: <StopIcon className={Menu.leftIconClass} />,
    },
  ] as const

  const statusItemClass = (item: typeof statusItems[number]) =>
    cx(
      status === item.status ? activeClearButtonClass : clearButtonClass,
      cx`peer-focus-visible:ring-2 ring-emerald-500 cursor-pointer`,
    )

  return (
    <Modal open={open} onOpenChange={setOpen} trigger={children}>
      <ModalHeader>
        <div className="text-base font-normal opacity-50">Edit media entry</div>
        <div>{media.title}</div>
      </ModalHeader>
      <fetcher.Form action="/update-media-list-entry" method="post" replace>
        <input type="hidden" name="mediaId" value={media.id} />

        <div className="px-4 py-6 grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <Field label="Status">
              <div className="flex gap-2">
                {statusItems.map((item) => (
                  <div key={item.status}>
                    <input
                      type="radio"
                      name="status"
                      className="sr-only peer"
                      id={`status-${item.status}`}
                      value={item.status}
                      checked={status === item.status}
                      onChange={() => setStatus(item.status)}
                    />
                    <label
                      htmlFor={`status-${item.status}`}
                      className={statusItemClass(item)}
                    >
                      {item.icon}
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Progress">
            <NumberInput
              name="progress"
              defaultValue={watchListInfo.progress}
            />
          </Field>
          <Field label="Score (out of 10)">
            <NumberInput name="score" defaultValue={watchListInfo.score} />
          </Field>
        </div>

        <ModalFooter>
          <div className="flex gap-2 items-center">
            <Button
              type="submit"
              className={solidDangerButtonClass}
              onClick={() => {
                fetcher.submit(
                  {
                    mediaListId: String(watchListInfo.mediaListId),
                  },
                  {
                    action: "/delete-from-watching",
                    method: "post",
                    replace: true,
                  },
                )
              }}
            >
              <TrashIcon className="w-5 -mx-1" />
              Delete
            </Button>
            <div className="flex-1" />
            {fetcher.submission ? <LoadingIcon /> : undefined}
            <Dialog.Close className={clearButtonClass}>
              <XCircleIcon className="w-5 -mx-1" />
              Cancel
            </Dialog.Close>
            <Button type="submit" className={solidButtonClass}>
              <CheckCircleIcon className="w-5 -mx-1" />
              Save
            </Button>
          </div>
        </ModalFooter>
      </fetcher.Form>
    </Modal>
  )
}

function Modal({
  open: openProperty,
  onOpenChange,
  trigger,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactElement
  children: ReactNode
}) {
  const [openState, setOpenState] = useState(openProperty ?? false)
  const open = openProperty ?? openState

  const handleOpenChange = (newOpen: boolean): void => {
    onOpenChange?.(newOpen)
    setOpenState(newOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger != undefined && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 bg-black/75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <div className="fixed inset-0 flex flex-col p-4 pointer-events-none">
              <Dialog.Content forceMount asChild>
                <motion.div
                  className="m-auto flex flex-col gap-2 max-w-lg w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dialog.Close
                    title="Close"
                    className="self-end p-2 -m-2 pointer-events-auto"
                  >
                    <XIcon className="w-6" />
                  </Dialog.Close>
                  <div className="bg-slate-800 rounded-md overflow-hidden shadow pointer-events-auto">
                    {children}
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Title className="text-2xl font-light p-4 bg-black/25">
      {children}
    </Dialog.Title>
  )
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 bg-black/25">{children}</div>
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-sm font-medium uppercase tracking-wider opacity-75 mb-[3px]">
        {label}
      </div>
      {children}
    </div>
  )
}

function NumberInput({
  name,
  defaultValue,
}: {
  name: string
  defaultValue?: string | number
}) {
  const [value, setValue] = useState(
    defaultValue != undefined ? String(defaultValue) : undefined,
  )

  const add = (amount: number) => {
    let numberValue = Number.parseInt(value ?? "0", 10)
    if (!Number.isFinite(numberValue)) {
      numberValue = 0
    }
    setValue(String(Math.max(numberValue + amount, 0)))
  }

  return (
    <div className="flex gap-2">
      <Button
        className={clearIconButtonClass}
        title="-1"
        onClick={() => add(-1)}
      >
        <ChevronLeftIcon className="w-5" />
      </Button>
      <input
        name={name}
        type="text"
        inputMode="numeric"
        className="w-16 text-center px-3 py-2 bg-black/40 focus:bg-black/70 transition rounded-md"
        placeholder="0"
        value={value ?? ""}
        onChange={(event) => setValue(event.currentTarget.value)}
        onFocus={(event) => event.currentTarget.select()}
      />
      <Button
        className={clearIconButtonClass}
        title="+1"
        onClick={() => add(1)}
      >
        <ChevronRightIcon className="w-5" />
      </Button>
    </div>
  )
}
