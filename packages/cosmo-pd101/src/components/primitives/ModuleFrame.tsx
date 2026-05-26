import { MdDragIndicator, MdPowerSettingsNew } from "react-icons/md";
import Button from "@/components/controls/Button";
import { useFxSlotContext } from "@/components/panels/FxSlotContext";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";

// --- UTILS ---
function contrastColor(hex: string): "black" | "white" {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
	return luminance > 0.55 ? "black" : "white";
}

// --- TYPES ---
type ModulePresetOption = {
	id: string;
	label?: string;
};

// --- HEADER COMPONENT ---
type ModuleHeaderProps = {
	title: string;
	color: string;
	textColor: "black" | "white";
	meta?: string;
	headerAction?: React.ReactNode;
	enabled: boolean;
	onToggleEnabled?: () => void;
};

function ModuleHeader({
	title,
	color,
	textColor,
	headerAction,
	enabled,
	onToggleEnabled,
}: ModuleHeaderProps) {
	const slotCtx = useFxSlotContext();
	const resolvedHeaderAction = headerAction ?? slotCtx?.typeSelector;

	return (
		<div
			data-header
			style={{ backgroundColor: color, color: textColor }}
			className="relative flex w-full items-center gap-1 px-1.5 pb-1"
		>
			<Button
				type="button"
				onClick={onToggleEnabled}
				disabled={!onToggleEnabled}
				aria-label={enabled ? `Disable ${title}` : `Enable ${title}`}
				className={`btn btn-circle btn-neutral size-6 p-0 ${enabled ? "text-cyan-300" : ""}`}
			>
				<MdPowerSettingsNew />
			</Button>

			<div
				{...(slotCtx?.dragListeners as React.HTMLAttributes<HTMLDivElement>)}
				{...(slotCtx?.dragAttributes as React.HTMLAttributes<HTMLDivElement>)}
				className={`z-10 flex items-center justify-center ${
					slotCtx
						? "group/drag relative flex-1 cursor-grab touch-none select-none gap-1.5 active:cursor-grabbing"
						: "pointer-events-none absolute inset-0"
				}`}
			>
				{slotCtx && (
					<MdDragIndicator className="h-2.5 w-2.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover/drag:opacity-35" />
				)}
				<span className="pointer-events-none font-bold font-mono text-xs uppercase tracking-[0.28em]">
					{title}
				</span>
			</div>

			<span className="inline-block h-4 w-4 shrink-0" />

			<div className="relative z-20 flex shrink-0 items-center">
				{resolvedHeaderAction}
			</div>
		</div>
	);
}

// --- MAIN FRAME COMPONENT ---
type ModuleFrameProps = {
	title: string;
	color: string;
	headerAction?: React.ReactNode;
	presetValue?: string;
	presetOptions?: ModulePresetOption[];
	onPresetChange?: (value: string) => void;
	presetDisabled?: boolean;
	enabled: boolean;
	onToggleEnabled?: () => void;
	className?: string;
	columns?: number;
	children: React.ReactNode;
};

const MODULE_GRID_COLUMN_CLASS: Record<number, string> = {
	1: "grid-cols-1",
	2: "grid-cols-2",
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
	6: "grid-cols-6",
	7: "grid-cols-7",
	8: "grid-cols-8",
};

export default function ModuleFrame({
	title,
	color,
	headerAction,
	presetValue,
	presetOptions,
	onPresetChange,
	presetDisabled = false,
	enabled,
	onToggleEnabled,
	className = "",
	columns = 4,
	children,
}: ModuleFrameProps) {
	const dimmed = !enabled;
	const textColor = contrastColor(color);
	const showPresetFooter =
		presetOptions !== undefined && onPresetChange !== undefined;

	const safeColumns = Math.min(Math.max(columns, 1), 8);
	const columnClass = MODULE_GRID_COLUMN_CLASS[safeColumns] ?? "grid-cols-4";

	return (
		<section
			style={{ borderColor: color }}
			// Removed overflow-hidden so the popover isn't clipped
			className={`relative flex h-full min-h-0 flex-col rounded-t-lg rounded-b-sm border-4 bg-cz-surface shadow-lg transition-[filter] ${
				dimmed ? "brightness-80" : ""
			} ${className}`}
		>
			<ModuleHeader
				title={title}
				color={color}
				textColor={textColor}
				headerAction={headerAction}
				enabled={enabled}
				onToggleEnabled={onToggleEnabled}
			/>

			<div className="flex min-h-0 flex-1 px-3 py-3">
				<div className="flex w-full flex-1 flex-col gap-2">
					<div
						className={`grid ${columnClass} my-auto w-full items-start justify-center justify-items-center gap-2.5`}
					>
						{children}
					</div>
				</div>
			</div>

			{showPresetFooter ? (
				<div
					data-footer
					style={{ backgroundColor: color, color: textColor }}
					className="relative flex w-full items-end justify-end pt-1 font-medium text-xs"
				>
					<ModulePresetPopover
						title={`${title} Presets`}
						value={presetValue ?? ""}
						options={presetOptions}
						onChange={onPresetChange}
						accentColor={color}
						disabled={presetDisabled || presetOptions.length === 0}
					/>
				</div>
			) : null}
		</section>
	);
}
