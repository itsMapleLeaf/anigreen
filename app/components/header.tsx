export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="sticky top-0 border-b border-white/20 bg-black/50 shadow-md shadow-black/25 backdrop-blur">
      <header className="container flex h-16 items-center">
        <div className="flex-1">
          <h1 className="-translate-y-0.5 font-condensed text-3xl">
            <span className="text-sky-400">ani</span>
            <span className="text-emerald-400">green</span>
          </h1>
        </div>
        {children}
      </header>
    </div>
  )
}
