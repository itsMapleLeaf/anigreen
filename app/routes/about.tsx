import { Code, Image } from "lucide-react"
import { ExternalLink } from "~/components/external-link"
import { LogoText } from "~/components/logo-text"

export default function About() {
  return (
    <main className="grid gap-2 border border-white/20 bg-black/50 p-4 shadow-md shadow-black/25 backdrop-blur">
      <p>
        <LogoText /> is an open-source app built by{" "}
        <ExternalLink
          href="https://mapleleaf.dev"
          className="link link-underline"
        >
          MapleLeaf
        </ExternalLink>{" "}
        with{" "}
        <ExternalLink href="https://react.dev" className="link link-underline">
          React
        </ExternalLink>{" "}
        and{" "}
        <ExternalLink href="https://remix.run" className="link link-underline">
          Remix
        </ExternalLink>
        . Not affiliated with AniList.
      </p>
      <p>
        <ExternalLink
          href="https://github.com/itsMapleLeaf/anigreen"
          className="link"
        >
          <Code aria-hidden className="inline align-text-top s-5" />{" "}
          <span className="link-underline">View Source on GitHub</span>
        </ExternalLink>
      </p>
      <p>
        <ExternalLink
          href="https://www.pixiv.net/en/artworks/104730528"
          className="link"
        >
          <Image aria-hidden className="inline align-text-top s-5" />{" "}
          <span className="link-underline">Background Art Source</span>
        </ExternalLink>
      </p>
      <aside className="text-sm">{`Name meaning: "green" as in "up to date", and "ani" as in... well, y'know`}</aside>
    </main>
  )
}
