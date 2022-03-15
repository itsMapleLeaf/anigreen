import { ExternalLinkIcon, LinkIcon } from "@heroicons/react/solid"
import type { ReactNode } from "react"
import { MediaCardActionButton } from "~/modules/media/media-card-action-button"
import { Menu } from "~/modules/ui/menu"
import type { AnilistMedia } from "./media-data"

export function MediaCardLinksButton({ media }: { media: AnilistMedia }) {
  // duplicate names (those with count 2+) should show their domain
  const nameCounts = new Map<string, number>()
  for (const link of media.externalLinks) {
    nameCounts.set(link.site, (nameCounts.get(link.site) ?? 0) + 1)
  }

  return (
    <Menu
      side="bottom"
      align="center"
      returnFocusOnClose={false}
      trigger={
        <MediaCardActionButton tooltip="External links">
          <LinkIcon className="w-5" />
        </MediaCardActionButton>
      }
      items={
        <>
          <LinkItem
            name="AniList"
            url={media.anilistUrl || `https://anilist.co/anime/${media.id}`}
            icon={anilistLogoIcon}
          />
          <Menu.Separator />
          {media.externalLinks
            .sort((a, b) => a.site.localeCompare(b.site))
            .map((link) =>
              link.url ? (
                <LinkItem
                  key={link.id}
                  name={link.site}
                  url={link.url}
                  icon={<ExternalLinkIcon className="w-5" />}
                  subtext={
                    (nameCounts.get(link.site) ?? 0) >= 2 && (
                      <div className="text-xs text-gray-600 leading-none">
                        {getDomain(link.url)}
                      </div>
                    )
                  }
                />
              ) : undefined,
            )}
        </>
      }
    />
  )
}

function LinkItem({
  name,
  url,
  icon,
  subtext,
}: {
  name: string
  url: string
  icon: ReactNode
  subtext?: ReactNode
}) {
  return (
    <Menu.Item>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={Menu.itemClass}
      >
        {icon}
        <div className="flex flex-col">
          <div>{name}</div>
          {subtext}
        </div>
      </a>
    </Menu.Item>
  )
}

function getDomain(urlString: string) {
  try {
    const url = new URL(urlString)
    return url.hostname
  } catch {
    return ""
  }
}

const anilistLogoIcon = (
  <svg
    className="w-5"
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.938 0L0 14.053h3.836l.836-2.43H8.85l.817 2.43h3.817L8.565 0H4.938zm.607 8.508l1.197-3.893 1.31 3.893H5.545zM14.854 14.053h4.291c.551 0 .855-.303.855-.854v-1.88c0-.55-.304-.855-.855-.855h-5.032V.854c0-.55-.304-.854-.855-.854h-1.88c-.55 0-.855.304-.855.855v.825l4.331 12.373z"
      fill="currentColor"
    />
  </svg>
)
