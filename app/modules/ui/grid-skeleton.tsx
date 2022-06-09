import { range } from "~/modules/common/range"
import { GridSection } from "~/modules/ui/grid-section"

export function GridSkeleton() {
  return (
    <GridSection
      title={
        <div className="h-[1em] w-48 bg-slate-700/30 rounded-sm animate-pulse inline-block">
          <span className="sr-only">Loading...</span>
        </div>
      }
      subtitle={
        <div className="h-[1em] w-32 bg-slate-700/30 rounded-sm animate-pulse inline-block"></div>
      }
    >
      {range(12).map((n) => (
        <div
          key={n}
          className="bg-slate-700/30 rounded-md h-56 animate-pulse shadow"
        />
      ))}
    </GridSection>
  )
}
