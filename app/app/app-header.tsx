import { buttonClass, maxWidthContainerClass } from "../components"

export function AppHeader() {
  return (
    <header className="shadow bg-slate-800">
      <div className={maxWidthContainerClass}>
        <div className="flex items-center justify-between h-16">
          <a href="/" title="Home" className="translate-y-[-2px]">
            <h1 className="text-3xl font-light">
              <span className="text-sky-400">ani</span>
              <span className="text-emerald-400">green</span>
            </h1>
          </a>
          <a href="/" className={buttonClass({ variant: "clear" })}>
            log in with AniList
          </a>
        </div>
      </div>
    </header>
  )
}
