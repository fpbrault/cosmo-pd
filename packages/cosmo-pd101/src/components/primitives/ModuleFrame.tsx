import Button from "@/components/controls/Button";
import { useFxSlotContext } from "@/components/panels/FxSlotContext";

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
	color: string; // hex accent color — border and header background
	meta?: string; // optional subtitle shown right-aligned in header
	headerControl?: React.ReactNode;
	enabled: boolean;
	onToggle?: () => void;
	className?: string;
	columns?: number; // number of columns for the content grid (default: 2)
	children: React.ReactNode;
};

const MODULE_GRID_COLUMN_CLASS: Record<number, string> = {
	1: "grid-cols-1",
	2: "grid-cols-2",
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
	6: "grid-cols-6",
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
}: ModuleFrameProps) {
	const canToggle = Boolean(onToggle);
	const dimmed = canToggle && !enabled;
	const textColor = contrastColor(color);

	const slotCtx = useFxSlotContext();
	const safeColumns = Math.min(Math.max(columns, 1), 6);
	const columnClass = MODULE_GRID_COLUMN_CLASS[safeColumns] ?? "grid-cols-4";

	return (
		<section
			style={{ borderColor: color }}
			className={[
				"relative flex h-full min-h-0 flex-col overflow-hidden border-4 rounded-b-sm bg-cz-surface shadow-lg rounded-t-lg transition-[filter]",
				dimmed ? "brightness-80" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{/* Header */}
			<div
				data-header
				style={{ backgroundColor: color, color: textColor }}
				className="relative flex w-full items-center gap-1 px-1.5 py-1"
			>
				{/* Left: power button when toggleable, otherwise a spacer to preserve alignment */}
				{canToggle ? (
					<Button
						type="button"
						onClick={onToggle}
						aria-label={enabled ? `Disable ${title}` : `Enable ${title}`}
						className={[
							"relative z-20 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black transition-all duration-200",
							enabled
								? "text-cyan-300 shadow-[0_0_5px_2px_rgba(103,232,249,0.45)]"
								: "text-white",
						].join(" ")}
					>
						{/* Power symbol */}
						<svg
							aria-label={enabled ? "On" : "Off"}
							viewBox="0 0 10 10"
							className="h-2 w-2"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<path d="M5 1.5v3" strokeLinecap="round" />
							<path d="M2.5 2.8A3.5 3.5 0 1 0 7.5 2.8" strokeLinecap="round" />
						</svg>
					</Button>
				) : (
					<span className="inline-block h-4 w-4 shrink-0" />
				)}

				{/* Center: drag handle (when in FX slot context) + title */}
				{slotCtx ? (
					<div
						{...(slotCtx.dragListeners as React.HTMLAttributes<HTMLDivElement>)}
						{...(slotCtx.dragAttributes as React.HTMLAttributes<HTMLDivElement>)}
						className="group/drag relative z-10 flex flex-1 cursor-grab select-none items-center justify-center gap-1.5 active:cursor-grabbing"
					>
						{/* 4-direction move icon — fades in on hover */}
						<svg
							aria-label="Drag to reorder"
							viewBox="0 0 14 14"
							className="h-2.5 w-2.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover/drag:opacity-35"
							fill="currentColor"
							aria-hidden
						>
							<path d="M7 0L5 3h4L7 0ZM7 14l-2-3h4l-2 3ZM0 7l3-2v4L0 7ZM14 7l-3-2v4l3-2Z" />
						</svg>
						<span className="pointer-events-none font-mono text-xs font-bold uppercase tracking-[0.28em]">
							{title}
						</span>
					</div>
				) : (
					/* No drag context — plain centered title */
					<span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-mono text-xs font-bold uppercase tracking-[0.28em]">
						{title}
					</span>
				)}

				{/* Right: type selector (FX slot context) or meta label */}
				<div className="relative z-20 flex shrink-0 items-center">
					{slotCtx?.typeSelector ??
						(meta ? (
							<span className="font-mono text-5xs uppercase tracking-[0.15em] opacity-60">
								{meta}
							</span>
						) : (
							<span className="inline-block h-4 w-4" />
						))}
				</div>
			</div>

			{/* Content area */}
			<div className={`flex min-h-0 flex-1 px-3 py-3`}>
				<div className="flex w-full flex-1 flex-col gap-2">
					{headerControl && (
						<div className="flex justify-end">{headerControl}</div>
					)}
					<div
						className={`grid ${columnClass} w-full content-start items-start gap-2.5 ${
							headerControl ? "" : "my-auto"
						}`}
					>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}
