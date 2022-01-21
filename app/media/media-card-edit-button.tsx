import {
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
  XCircleIcon,
} from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaListStatus } from "~/anilist/graphql.out"
import type { MediaResource, MediaWatchListInfo } from "~/media/media"
import { MediaCardActionButton } from "~/media/media-card-action-button"
import { SetWatchingStatusForm } from "~/media/set-watching-status-form"
import { Button } from "~/ui/button"
import { Menu } from "~/ui/menu"

export function MediaCardEditButton({
  media,
  watchListInfo,
}: {
  media: MediaResource
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
        <MediaCardActionButton tooltip="Edit" loading={!!fetcher.submission}>
          <PencilAltIcon className="w-5" />
        </MediaCardActionButton>
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
