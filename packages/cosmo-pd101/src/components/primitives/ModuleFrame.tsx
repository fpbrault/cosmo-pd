/** Returns "black" or "white" — whichever has better contrast against the given hex color. */
function contrastColor(hex: string): "black" | "white" {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
	return luminance > 0.55 ? "black" : "white";
}

type ModuleFrameProps = {
	title: string;
	color: string; // hex accent color — border, header bg, LED glow
	meta?: string; // optional subtitle shown right-aligned in header
	headerControl?: React.ReactNode;
	enabled: boolean;
	onToggle?: () => void;
	className?: string;
	columns?: number; // number of columns for the content grid (default: 2)
	children: React.ReactNode;
	showLed?: boolean; // whether to show the LED indicator (default: true)
};

export default function ModuleFrame({
	title,
	color,
	meta,
	headerControl,
	enabled,
	onToggle,
	className,
	columns = 4,
	children,
	showLed = true,
}: ModuleFrameProps) {
	const canToggle = Boolean(onToggle);
	const dimmed = canToggle && !enabled;
	const textColor = contrastColor(color);

	return (
		<section
			style={{ borderColor: color }}
			className={[
				`relative flex min-h-0 flex-col overflow-hidden border-4 rounded-b-sm bg-cz-surface shadow-lg rounded-t-lg transition-[filter]`,
				dimmed ? "brightness-80" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{/* Header — toggle surface plus optional right-side control */}
			<div
				data-header
				style={{ backgroundColor: color }}
				className={`relative flex w-full items-center px-2 py-1 ${
					canToggle
						? "select-none hover:brightness-125 transition-all duration-200"
						: "cursor-default"
				}`}
			>
				{canToggle && (
					<button
						type="button"
						onClick={onToggle}
						aria-label={`Toggle ${title} module`}
						className="absolute inset-0 z-0 cursor-pointer"
					/>
				)}
				{/* LED dot — green indicator */}
				{showLed && (
					<span
						className={`relative z-10 inline-block h-1.5 w-3 shrink-0 rounded-[1px] transition-colors ${
							enabled
								? "bg-green-400 shadow-[0_0_5px_2px_rgba(74,222,128,0.8)]"
								: "bg-green-950/80"
						}`}
					/>
				)}
				{/* Title centered in the full header width */}
				<span
					style={{ color: textColor }}
					className="z-10 border-none pointer-events-none absolute inset-0 flex items-center justify-center font-mono font-bold uppercase tracking-[0.28em]"
				>
					{title}
				</span>
				{/* Right side: optional meta and header control */}
				<span className="relative z-10 ml-auto inline-flex shrink-0 items-center gap-2" aria-hidden>
					{meta && (
						<span
							style={{ color: textColor }}
							className="font-mono text-5xs uppercase tracking-[0.15em] opacity-60"
						>
							{meta}
						</span>
					)}
					{headerControl && (
						<span
							style={{ color: textColor }}
							className="pointer-events-auto"
						>
							{headerControl}
						</span>
					)}
					{!meta && !headerControl && (
						<span className="inline-block h-1.5 w-3 opacity-0" />
					)}
				</span>
			</div>

			{/* Content area */}
			<div
				className={`flex min-h-0 flex-1 items-center justify-center px-3 py-3 ${
					dimmed ? "bg-cz-inset/20" : "bg-cz-inset/60"
				}`}
			>
				<div className={`grid grid-cols-${columns} gap-2.5 w-full`}>
					{children}
				</div>
			</div>
		</section>
	);
}
