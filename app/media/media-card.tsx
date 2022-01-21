import {
  BookmarkIcon,
  ChevronDoubleRightIcon,
  LinkIcon,
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
  XCircleIcon,
} from "@heroicons/react/solid"
import clsx from "clsx"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form, useFetcher } from "remix"
import { MediaListStatus } from "~/anilist/graphql.out"
import { useAuthContext } from "~/auth/auth-context"
import { filterJoin } from "~/helpers/filter-join"
import { infix } from "~/helpers/infix"
import type { Media, MediaWatchListInfo } from "~/media/media"
import { autoRef } from "~/react/auto-ref"
import type { ButtonProps } from "~/ui/button"
import { Button } from "~/ui/button"
import { LazyImage } from "~/ui/lazy-image"
import { Menu } from "~/ui/menu"
import { Tooltip } from "~/ui/tooltip"

const actionButtonClass = clsx`flex justify-center p-3 hover:bg-black/30 transition w-full`

export function MediaCard({
  media,
  scheduleEpisode,
}: {
  media: Media
  scheduleEpisode: number
}) {
  return (
    <div className="bg-slate-700 rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div
        className="p-3 relative flex h-20"
        style={{ backgroundColor: media.coverColor || "rgba(0 0 0 / 0.50)" }}
      >
        <LazyImage
          src={media.bannerImageUrl}
          alt=""
          className="absolute w-full h-full inset-0 object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 opacity-40 pointer-events-none" />
      </div>
      <div className="p-3 flex items-end justify-between gap-4 flex-1">
        <h3 className="text-xl font-light leading-tight flex-1 line-clamp-2 self-start">
          {media.title}
        </h3>
        <LazyImage
          src={media.coverImageUrl}
          alt=""
          className="relative w-20 h-24 rounded-md shadow object-cover -mt-20"
        />
      </div>
      <div className="px-3 pb-3 text-sm uppercase font-medium opacity-60 leading-none flex items-center gap-1">
        {infix(
          [
            <p key="format">{media.format}</p>,
            media.watchListInfo && (
              <StatusDisplay key="status" status={media.watchListInfo.status} />
            ),
            scheduleEpisode && (
              <p key="scheduleEpisode">
                Episode {filterJoin("/", [scheduleEpisode, media.episodeCount])}
              </p>
            ),
          ].filter(Boolean),
          (index) => (
            <span key={`separator-${index}`}>•</span>
          ),
        )}
      </div>
      <MediaCardControls media={media} />
    </div>
  )
}

function StatusDisplay({ status }: { status: MediaListStatus }) {
  if (status === MediaListStatus.Paused) return <p>Paused</p>
  if (status === MediaListStatus.Dropped) return <p>Dropped</p>
  return <p>Watching</p>
}

function MediaCardControls({ media }: { media: Media }) {
  const auth = useAuthContext()

  const state = !auth.loggedIn
    ? ({ status: "loggedOut" } as const)
    : media.watchListInfo
    ? ({ status: "onList", watchListInfo: media.watchListInfo } as const)
    : ({ status: "notOnList" } as const)

  return (
    <div className="bg-slate-800 grid grid-flow-col auto-cols-fr">
      {state.status === "loggedOut" && (
        <>
          <AuthRequiredWrapper tooltipText="Log in to bookmark this">
            <div className={actionButtonClass}>
              <BookmarkIcon className="w-5" />
            </div>
          </AuthRequiredWrapper>
          <ExternalLinksButton media={media} />
        </>
      )}

      {state.status === "notOnList" && (
        <>
          <AddToWatchingButton media={media} />
          <ExternalLinksButton media={media} />
        </>
      )}

      {state.status === "onList" && (
        <>
          <EditStatusButton media={media} watchListInfo={state.watchListInfo} />
          <Tooltip text="Advance progress +1">
            <Button className={actionButtonClass}>
              <ChevronDoubleRightIcon className="w-5" />
            </Button>
          </Tooltip>
          <ExternalLinksButton media={media} />
        </>
      )}
    </div>
  )
}

function AddToWatchingButton({ media }: { media: Media }) {
  const fetcher = useFetcher()

  return (
    <SetWatchingStatusForm
      as={fetcher.Form}
      mediaId={media.id}
      status={MediaListStatus.Current}
    >
      <ActionButton tooltip="Add to watch list" loading={!!fetcher.submission}>
        <BookmarkIcon className="w-5" />
      </ActionButton>
    </SetWatchingStatusForm>
  )
}

function EditStatusButton({
  media,
  watchListInfo,
}: {
  media: Media
  watchListInfo: MediaWatchListInfo
}) {
  const fetcher = useFetcher()

  const statusItems = [
    {
      status: MediaListStatus.Current,
      text: "Watching",
      icon: <PlayIcon className="w-5" />,
    },
    {
      status: MediaListStatus.Paused,
      text: "Hold",
      icon: <PauseIcon className="w-5" />,
    },
    {
      status: MediaListStatus.Dropped,
      text: "Drop",
      icon: <StopIcon className="w-5" />,
    },
  ]

  return (
    <Menu
      side="bottom"
      align="center"
      returnFocusOnClose={false}
      trigger={
        <ActionButton tooltip="Edit" loading={!!fetcher.submission}>
          <PencilAltIcon className="w-5" />
        </ActionButton>
      }
      items={
        <>
          {statusItems
            .filter((item) => watchListInfo.status !== item.status)
            .map((item) => (
              <SetWatchingStatusForm
                key={item.status}
                as={fetcher.Form}
                mediaId={media.id}
                status={item.status}
              >
                <Menu.Item>
                  <Button type="submit" className={Menu.itemClass}>
                    {item.icon}
                    {item.text}
                  </Button>
                </Menu.Item>
              </SetWatchingStatusForm>
            ))}

          <fetcher.Form
            action="/delete-from-watching"
            method="delete"
            className="contents"
            replace
          >
            <input
              type="hidden"
              name="mediaListId"
              value={watchListInfo.mediaListId}
            />
            <Menu.Item>
              <Button type="submit" className={Menu.itemClass}>
                <XCircleIcon className="w-5" />
                Remove
              </Button>
            </Menu.Item>
          </fetcher.Form>
        </>
      }
    />
  )
}

function ExternalLinksButton({ media }: { media: Media }) {
  // todo
  return (
    <ActionButton tooltip="External links">
      <LinkIcon className="w-5" />
    </ActionButton>
  )
}

function SetWatchingStatusForm({
  mediaId,
  status,
  children,
  as: FormComponent = Form,
}: {
  mediaId: number
  status: MediaListStatus
  children: ReactNode
  as: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
}) {
  return (
    <FormComponent
      action="/set-watching-status"
      method="put"
      className="contents"
      replace
    >
      <input type="hidden" name="mediaId" value={mediaId} />
      <input type="hidden" name="status" value={status} />
      {children}
    </FormComponent>
  )
}

const ActionButton = autoRef(function ActionButton({
  tooltip,
  className,
  ...props
}: ButtonProps & { tooltip: ReactNode }) {
  return (
    <Tooltip text={tooltip}>
      <Button
        type="submit"
        {...props}
        className={clsx(className, actionButtonClass)}
      />
    </Tooltip>
  )
})

function AuthRequiredWrapper({
  tooltipText,
  children,
}: {
  tooltipText: ReactNode
  children: ReactNode
}) {
  const auth = useAuthContext()

  if (auth.loggedIn) {
    return <>{children}</>
  }

  return (
    <Tooltip text={tooltipText}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex={0}>
        <div className="pointer-events-none opacity-40">{children}</div>
      </div>
    </Tooltip>
  )
}
