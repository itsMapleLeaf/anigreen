import {
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
  XCircleIcon,
} from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { TypedForm } from "~/form"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
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
  ] as const

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
              <TypedForm
                key={item.status}
                as={fetcher.Form}
                action="updateMediaListEntry"
                data={{ mediaId: media.id, status: item.status }}
              >
                <Menu.Item>
                  <Button type="submit" className={Menu.itemClass}>
                    {item.icon}
                    {item.text}
                  </Button>
                </Menu.Item>
              </TypedForm>
            ))}

          <TypedForm
            as={fetcher.Form}
            action="deleteFromWatching"
            data={{ mediaListId: watchListInfo.mediaListId }}
          >
            <Menu.Item>
              <Button type="submit" className={Menu.itemClass}>
                <XCircleIcon className={Menu.leftIconClass} />
                Remove
              </Button>
            </Menu.Item>
          </TypedForm>
        </>
      }
    />
  )
}
