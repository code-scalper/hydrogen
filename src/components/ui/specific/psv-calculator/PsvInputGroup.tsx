export function PsvInputGroup({
	title,
	x,
	y,
	children,
}: {
	title: string;
	x: number | string;
	y: number | string;
	children: React.ReactNode;
}) {
	return (
		<section
			className="absolute z-10"
			style={{
				left: typeof x === "number" ? `${x}px` : x,
				top: typeof y === "number" ? `${y}px` : y,
			}}
		>
			<div className="mb-2 flex items-center gap-1">
				<span className="text-amber-400">•</span>
				<h3 className="text-[12px] font-semibold text-amber-300">{title}</h3>
			</div>

			<div className="w-[360px] rounded-md border border-slate-700 bg-slate-800/80 p-2 shadow">
				{children}
			</div>
		</section>
	);
}
