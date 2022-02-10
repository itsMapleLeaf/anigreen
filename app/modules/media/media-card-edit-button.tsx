import {
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/solid"
import { useFetcher } from "remix"
import { MediaListStatus } from "~/generated/anilist-graphql"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { UpdateMediaListEntryForm } from "~/routes/update-media-list-entry"
import { Button } from "../ui/button"
import { activeClearButtonClass, clearButtonClass } from "../ui/button-style"
import { Menu } from "../ui/menu"
import { Popover } from "../ui/popover"
import type { AnilistMedia, AnilistMediaListEntry } from "./media-data"

export function MediaCardEditButton({
  media,
  watchListInfo,
}: {
  media: AnilistMedia
  watchListInfo: AnilistMediaListEntry
}) {
  const fetcher = useFetcher()

  const currentStatus =
    fetcher.submission?.formData.get("status") ?? watchListInfo.status

  const button = (
    <MediaCardActionButton tooltip="Edit" loading={!!fetcher.submission}>
      <PencilAltIcon className="w-5" />
    </MediaCardActionButton>
  )

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
    <Popover trigger={button}>
      <div className="bg-slate-800 shadow rounded-lg p-4">
        <div className="flex gap-8 px-1.5">
          {statusItems.map((item) => (
            <UpdateMediaListEntryForm
              key={item.status}
              as={fetcher.Form}
              data={{ mediaId: media.id, status: item.status }}
            >
              <Button
                type="submit"
                className={
                  item.status === currentStatus
                    ? activeClearButtonClass
                    : clearButtonClass
                }
              >
                {item.icon}
                {item.text}
              </Button>
            </UpdateMediaListEntryForm>
          ))}
        </div>
      </div>
    </Popover>
  )

  // return (
  //   <Menu
  //     side="bottom"
  //     align="center"
  //     returnFocusOnClose={false}
  //     trigger={
  //       <MediaCardActionButton tooltip="Edit" loading={!!fetcher.submission}>
  //         <PencilAltIcon className="w-5" />
  //       </MediaCardActionButton>
  //     }
  //     items={
  //       <>
  //         {statusItems
  //           .filter((item) => watchListInfo.status !== item.status)
  //           .map((item) => (
  //             <UpdateMediaListEntryForm
  //               key={item.status}
  //               as={fetcher.Form}
  //               mediaId={media.id}
  //               status={item.status}
  //             >
  //               <Menu.Item>
  //                 <Button type="submit" className={Menu.itemClass}>
  //                   {item.icon}
  //                   {item.text}
  //                 </Button>
  //               </Menu.Item>
  //             </UpdateMediaListEntryForm>
  //           ))}

  //         <DeleteFromWatchingForm
  //           as={fetcher.Form}
  //           mediaListId={watchListInfo.mediaListId}
  //         >
  //           <Menu.Item>
  //             <Button type="submit" className={Menu.itemClass}>
  //               <XCircleIcon className={Menu.leftIconClass} />
  //               Remove
  //             </Button>
  //           </Menu.Item>
  //         </DeleteFromWatchingForm>
  //       </>
  //     }
  //   />
  // )
}
