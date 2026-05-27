import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import { FX_UI_META } from "./drawer-modules/fxSlotModuleConfig";
import {
	FX_CATEGORIES,
	FX_TYPE_ICONS,
	getFxTypeLabel,
} from "./fxTypeCategories";

// ---------------------------------------------------------------------------
// Position helpers
// ---------------------------------------------------------------------------

const TYPE_SELECTOR_WIDTH = 480;
const TYPE_SELECTOR_MARGIN = 12;

type PopoverPos = { top: number; left: number; maxHeight: number };

function getTypeSelectorPosition(rect: DOMRect, align: "right" | "center") {
	const maxHeight = Math.min(
		440,
		window.innerHeight - TYPE_SELECTOR_MARGIN * 2,
	);
	const preferredTop = rect.bottom + 6;
	const availableBelow =
		window.innerHeight - preferredTop - TYPE_SELECTOR_MARGIN;
	const top =
		availableBelow < 250
			? Math.max(TYPE_SELECTOR_MARGIN, rect.top - maxHeight - 6)
			: Math.min(
					preferredTop,
					window.innerHeight - maxHeight - TYPE_SELECTOR_MARGIN,
				);
	const preferredLeft =
		align === "center"
			? rect.left + rect.width / 2 - TYPE_SELECTOR_WIDTH / 2
			: rect.right - TYPE_SELECTOR_WIDTH;
	const left = Math.min(
		Math.max(TYPE_SELECTOR_MARGIN, preferredLeft),
		window.innerWidth - TYPE_SELECTOR_WIDTH - TYPE_SELECTOR_MARGIN,
	);

	return { top, left, maxHeight };
}

// ---------------------------------------------------------------------------
// Effect tile
// ---------------------------------------------------------------------------

function FxTypeTile({
	type,
	currentType,
	onClick,
}: {
	type: FxSlotType;
	currentType: FxSlotType;
	onClick: () => void;
}) {
	const isActive = type === currentType;
	const color = FX_UI_META[type]?.color ?? "#666";
	const label = getFxTypeLabel(type);
	const shortTitle = FX_UI_META[type]?.shortTitle ?? label;
	const iconPath = FX_TYPE_ICONS[type];

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={[
				"group flex items-center gap-1.5 rounded-md border px-2 py-1.5 transition-all duration-100",
				isActive
					? "border-white/15 bg-white/10"
					: "border-transparent hover:border-white/10 hover:bg-white/[0.04]",
			].join(" ")}
		>
			{/* Color accent dot */}
			<span
				className="h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125"
				style={{ backgroundColor: color }}
			/>
			{/* SVG Icon */}
			{iconPath && (
				<svg
					viewBox="0 0 24 24"
					width={18}
					height={18}
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					className="shrink-0 text-cz-cream-dim/60 group-hover:text-cz-cream"
				>
					<path d={iconPath} />
				</svg>
			)}
			{/* Short title */}
			<span className="truncate font-bold font-mono text-[0.55rem] text-cz-cream-dim/70 uppercase tracking-[0.08em] group-hover:text-cz-cream">
				{shortTitle}
			</span>
			{/* Active indicator */}
			{isActive && (
				<span
					className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
					style={{ backgroundColor: color }}
				/>
			)}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Category section
// ---------------------------------------------------------------------------

function FxCategorySection({
	label,
	effects,
	currentType,
	onSelect,
}: {
	label: string;
	effects: FxSlotType[];
	currentType: FxSlotType;
	onSelect: (t: FxSlotType) => void;
}) {
	return (
		<section>
			<div className="mb-1.5 flex items-center gap-2 px-1">
				<span className="h-px flex-1 bg-cz-border/40" />
				<span className="font-bold font-mono text-[0.5rem] text-cz-cream-dim/50 uppercase tracking-[0.2em]">
					{label}
				</span>
				<span className="h-px flex-1 bg-cz-border/40" />
			</div>
			<div className="grid grid-cols-3 gap-1">
				{effects.map((type) => (
					<FxTypeTile
						key={type}
						type={type}
						currentType={currentType}
						onClick={() => onSelect(type)}
					/>
				))}
			</div>
		</section>
	);
}

// ---------------------------------------------------------------------------
// Main popover component
// ---------------------------------------------------------------------------

export default function FxTypeSelectorPopover({
	pos,
	currentType,
	showRemove,
	onSelect,
	onClose,
}: {
	pos: PopoverPos;
	currentType: FxSlotType;
	showRemove: boolean;
	onSelect: (t: FxSlotType) => void;
	onClose: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handlePointerDown = (e: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		};
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("touchstart", handlePointerDown);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("touchstart", handlePointerDown);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	return createPortal(
		<div
			ref={ref}
			style={{
				position: "fixed",
				top: pos.top,
				left: pos.left,
				maxHeight: pos.maxHeight,
				zIndex: 9999,
			}}
			role="dialog"
			aria-label="Select effect type"
			className="flex w-[480px] flex-col overflow-hidden rounded-xl border border-cz-gold/30 bg-cz-panel shadow-2xl"
		>
			{/* Header */}
			<div className="flex items-center gap-2 border-cz-border/60 border-b bg-cz-surface/80 px-3 py-2">
				<span className="font-bold font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.22em]">
					Effect Type
				</span>
			</div>

			{/* Body */}
			<div className="min-h-0 flex-1 overflow-y-auto p-3">
				{/* Remove button for active slots */}
				{showRemove && (
					<button
						type="button"
						onClick={() => onSelect("empty")}
						className="mb-3 flex w-full items-center gap-2 rounded-md border border-red-400/20 px-2.5 py-2 font-mono text-[0.55rem] text-red-400/70 uppercase tracking-[0.12em] transition-colors hover:border-red-400/40 hover:bg-red-500/8 hover:text-red-300"
					>
						<span className="h-px flex-1 bg-red-400/20" />
						Remove Effect
						<span className="h-px flex-1 bg-red-400/20" />
					</button>
				)}

				{/* Category sections */}
				<div className="space-y-3">
					{FX_CATEGORIES.map((category) => (
						<FxCategorySection
							key={category.id}
							label={category.label}
							effects={category.effects}
							currentType={currentType}
							onSelect={onSelect}
						/>
					))}
				</div>
			</div>
		</div>,
		document.body,
	);
}

export type { PopoverPos };
export { getTypeSelectorPosition };
