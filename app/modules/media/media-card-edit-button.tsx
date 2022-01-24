import {
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
  XCircleIcon,
} from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaListStatus } from "~/modules/anilist/graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { SetWatchingStatusForm } from "~/modules/media/set-watching-status-form"
import { Button } from "~/modules/ui/button"
import { Menu } from "~/modules/ui/menu"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"

export function MediaCardEditButton({
  media,
  watchListInfo,
}: {
  media: AnilistMedia
  watchListInfo: AnilistMediaListEntry
}) {
  const fetcher = useFetcher()

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
                <XCircleIcon className={Menu.leftIconClass} />
                Remove
              </Button>
            </Menu.Item>
          </fetcher.Form>
        </>
      }
    />
  )
}
