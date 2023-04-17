import { Link } from "@remix-run/react"
import { route } from "routes-gen"
import { LogoText } from "./logo-text"

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="sticky top-0 border-b border-white/20 bg-black/50 shadow-md shadow-black/25 backdrop-blur">
      <header className="container flex h-16 items-center">
        <Link to={route("/")} className="mr-auto">
          <h1 className="-translate-y-0.5 font-condensed text-3xl">
            <LogoText />
          </h1>
        </Link>
        {children}
      </header>
    </div>
  )
}
