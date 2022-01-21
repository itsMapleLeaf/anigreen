import { ExternalLinkIcon, LinkIcon } from "@heroicons/react/solid"
import type { MediaResource } from "~/media/media"
import { MediaCardActionButton } from "~/media/media-card-action-button"
import { Menu } from "~/ui/menu"

export function MediaCardLinksButton({ media }: { media: MediaResource }) {
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
      items={media.externalLinks
        .sort((a, b) => a.site.localeCompare(b.site))
        .map((link) => (
          <Menu.Item key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={Menu.itemClass}
            >
              <ExternalLinkIcon className="w-5 -ml-1" />
              <div className="flex flex-col">
                <div>{link.site}</div>
                {(nameCounts.get(link.site) ?? 0) >= 2 && (
                  <div className="text-xs text-gray-600 leading-none">
                    {getDomain(link.url)}
                  </div>
                )}
              </div>
            </a>
          </Menu.Item>
        ))}
    />
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
