import type { ReactNode } from "react"

export default function AspectBox({
	ratio,
	children,
}: {
	ratio: number
	children: ReactNode
}) {
	return (
		<div
			className="w-full relative"
			style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
		>
			<div className="absolute inset-0">{children}</div>
		</div>
	)
}
