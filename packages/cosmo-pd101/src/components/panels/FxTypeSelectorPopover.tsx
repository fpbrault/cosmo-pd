import type { Placement } from "@floating-ui/react";
import Popover from "@/components/primitives/Popover";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import { FX_UI_META } from "./drawer-modules/fxSlotModuleConfig";
import {
	FX_CATEGORIES,
	FX_TYPE_ICONS,
	getFxTypeLabel,
} from "./fxTypeCategories";

// ---------------------------------------------------------------------------
// Column layout — which categories appear in which column
// ---------------------------------------------------------------------------

const COLUMN_LAYOUT: { key: string; categoryIndices: number[] }[] = [
	{ key: "delay-dist", categoryIndices: [0, 4] },
	{ key: "mod", categoryIndices: [1] },
	{ key: "filt-dyn", categoryIndices: [2, 3] },
];

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
	const iconPath = FX_TYPE_ICONS[type];

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={[
				"group flex w-full items-center gap-2 rounded-md border px-2 py-1.5 transition-all duration-100",
				isActive
					? "border-white/15 bg-white/10"
					: "border-transparent hover:border-white/10 hover:bg-white/[0.04]",
			].join(" ")}
		>
			<span
				className="h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125"
				style={{ backgroundColor: color }}
			/>
			{iconPath && (
				<svg
					viewBox="0 0 24 24"
					width={16}
					height={16}
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
			<span className="truncate font-bold font-mono text-[0.55rem] text-cz-cream-dim/80 uppercase tracking-[0.08em] group-hover:text-cz-cream">
				{label}
			</span>
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
// Category section inside a column
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
			<div className="mb-1 flex items-center gap-1.5">
				<span className="font-bold font-mono text-[0.5rem] text-cz-cream-dim/50 uppercase tracking-[0.2em]">
					{label}
				</span>
				<span className="h-px flex-1 bg-cz-border/30" />
			</div>
			<div className="flex flex-col gap-0.5">
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

export interface FxTypeSelectorPopoverProps {
	open: boolean;
	triggerRef: React.RefObject<Element | null>;
	placement?: Placement;
	currentType: FxSlotType;
	showRemove: boolean;
	onSelect: (t: FxSlotType) => void;
	onClose: () => void;
}

export default function FxTypeSelectorPopover({
	open,
	triggerRef,
	placement = "bottom",
	currentType,
	showRemove,
	onSelect,
	onClose,
}: FxTypeSelectorPopoverProps) {
	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			role="dialog"
			ariaLabel="Select effect type"
			placement={placement}
		>
			{/* Header */}
			<div className="flex items-center gap-2 border-cz-border/60 border-b bg-cz-surface/80 px-3 py-2">
				<span className="font-bold font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.22em]">
					Effect Type
				</span>
			</div>

			{/* Body */}
			<div className="min-h-0 flex-1 overflow-y-auto p-3">
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

				<div className="flex gap-3">
					{COLUMN_LAYOUT.map((col) => (
						<div key={col.key} className="flex min-w-0 flex-1 flex-col gap-3">
							{col.categoryIndices.map((catIdx) => {
								const cat = FX_CATEGORIES[catIdx];
								return (
									<FxCategorySection
										key={cat.id}
										label={cat.label}
										effects={cat.effects}
										currentType={currentType}
										onSelect={onSelect}
									/>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</Popover>
	);
}
