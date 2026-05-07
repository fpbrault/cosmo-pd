import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/controls/Button";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import FxSlotModuleRenderer from "./drawer-modules/FxSlotModuleRenderer";
import { FX_SLOT_MODULE_CONFIGS } from "./drawer-modules/fxSlotModuleConfig";
import { FxSlotContext } from "./FxSlotContext";

// ---------------------------------------------------------------------------
// FX type option lists
// ---------------------------------------------------------------------------

const FX_EFFECT_OPTIONS: { value: FxSlotType; label: string }[] = [
	{ value: "chorus", label: "Chorus" },
	{ value: "phaser", label: "Phaser" },
	{ value: "delay", label: "Delay" },
	{ value: "reverb", label: "Reverb" },
	{ value: "vibrato", label: "Vibrato" },
	{ value: "phaseMod", label: "Phase Mod" },
	{ value: "compressor", label: "Compressor" },
	{ value: "eq5Band", label: "5-Band EQ" },
	{ value: "grainDelay", label: "Grain Delay" },
	{ value: "bitcrusher", label: "Bitcrusher" },
	{ value: "shimmerVerb", label: "Shimmer Verb" },
	{ value: "distortion", label: "Distortion" },
	{ value: "junoChorus", label: "Juno Chorus" },
	{ value: "ringMod", label: "Ring Mod" },
	{ value: "tremolo", label: "Tremolo" },
	{ value: "wavefolder", label: "Wavefolder" },
	{ value: "loFi", label: "LoFi" },
];

/** For active slots: includes a "Remove" option at the top. */
const FX_CHANGE_OPTIONS: { value: FxSlotType; label: string }[] = [
	{ value: "empty", label: "Remove" },
	...FX_EFFECT_OPTIONS,
];

// ---------------------------------------------------------------------------
// TypeSelectorPopover — portal-based so overflow:hidden parents don't clip it
// ---------------------------------------------------------------------------

const TYPE_SELECTOR_WIDTH = 176;
const TYPE_SELECTOR_MARGIN = 12;

type PopoverPos = { top: number; left: number; maxHeight: number };

function getTypeSelectorPosition(rect: DOMRect, align: "right" | "center") {
	const maxHeight = Math.min(
		360,
		window.innerHeight - TYPE_SELECTOR_MARGIN * 2,
	);
	const preferredTop = rect.bottom + 6;
	const availableBelow =
		window.innerHeight - preferredTop - TYPE_SELECTOR_MARGIN;
	const top =
		availableBelow < 180
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

function TypeSelectorPopover({
	pos,
	currentType,
	options,
	onSelect,
	onClose,
}: {
	pos: PopoverPos;
	currentType: FxSlotType;
	options: { value: FxSlotType; label: string }[];
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
			className="flex w-44 flex-col overflow-hidden rounded-xl border border-cz-gold/30 bg-cz-panel shadow-2xl"
			role="dialog"
			aria-label="Select effect type"
		>
			<div className="border-cz-border/60 border-b bg-cz-surface/80 px-3 py-2 font-bold font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.22em]">
				Effect Type
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto p-1.5">
				{options.map((o) => (
					<Button
						key={o.value}
						type="button"
						onClick={() => onSelect(o.value)}
						className={[
							"btn btn-ghost btn-sm h-8 min-h-0 w-full justify-start rounded-md px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] hover:bg-white/10",
							o.value === "empty"
								? "text-red-400/80 hover:text-red-300"
								: currentType === o.value
									? "bg-cz-gold/10 text-white"
									: "text-cz-cream-dim",
						].join(" ")}
					>
						{o.label}
					</Button>
				))}
			</div>
		</div>,
		document.body,
	);
}

// ---------------------------------------------------------------------------
// TypeSelectorTrigger — triangle button + popover; rendered via context
// ---------------------------------------------------------------------------

function TypeSelectorTrigger({
	slot,
	currentType,
}: {
	slot: number;
	currentType: FxSlotType;
}) {
	const [popoverPos, setPopoverPos] = useState<PopoverPos | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const setFxSlotType = useSynthStore((s) => s.setFxSlotType);

	const openPopover = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPopoverPos(getTypeSelectorPosition(rect, "right"));
		}
	};

	const handleSelect = (type: FxSlotType) => {
		setFxSlotType(slot, type);
		setPopoverPos(null);
	};

	return (
		<>
			<Button
				ref={triggerRef}
				type="button"
				onClick={openPopover}
				aria-label="Change effect type"
				className="btn btn-ghost btn-square btn-xs h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
			>
				{/* Downward-pointing triangle */}
				<svg
					aria-label="Change effect type"
					viewBox="0 0 8 5"
					className="h-1.5 w-1.5"
					fill="currentColor"
				>
					<path d="M4 5 L0 0 L8 0 Z" />
				</svg>
			</Button>
			{popoverPos && (
				<TypeSelectorPopover
					pos={popoverPos}
					currentType={currentType}
					options={FX_CHANGE_OPTIONS}
					onSelect={handleSelect}
					onClose={() => setPopoverPos(null)}
				/>
			)}
		</>
	);
}

// ---------------------------------------------------------------------------
// EmptySlot — centered plus button with effect type picker
// ---------------------------------------------------------------------------

function EmptySlot({ slot }: { slot: number }) {
	const [popoverPos, setPopoverPos] = useState<PopoverPos | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const setFxSlotType = useSynthStore((s) => s.setFxSlotType);

	const openPopover = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPopoverPos(getTypeSelectorPosition(rect, "center"));
		}
	};

	const handleSelect = (type: FxSlotType) => {
		if (type !== "empty") setFxSlotType(slot, type);
		setPopoverPos(null);
	};

	return (
		<div className="flex h-full items-center justify-center rounded-lg border-2 border-white/15 border-dashed">
			<Button
				ref={triggerRef}
				type="button"
				onClick={openPopover}
				aria-label="Add effect to slot"
				className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/40 text-xl transition-all hover:border-white/50 hover:text-white/80"
			>
				+
			</Button>
			{popoverPos && (
				<TypeSelectorPopover
					pos={popoverPos}
					currentType="empty"
					options={FX_EFFECT_OPTIONS}
					onSelect={handleSelect}
					onClose={() => setPopoverPos(null)}
				/>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// SlotModule — renders the right drawer module for a given FX type
// ---------------------------------------------------------------------------

function SlotModule({ type, slot }: { type: FxSlotType; slot: number }) {
	const config = FX_SLOT_MODULE_CONFIGS[type];
	if (config) return <FxSlotModuleRenderer config={config} slot={slot} />;

	return null;
}

// ---------------------------------------------------------------------------
// FxSlotFrame — sortable wrapper + context provider
// ---------------------------------------------------------------------------

export default memo(function FxSlotFrame({ slot }: { slot: number }) {
	const fxSlots = useSynthStore((s) => s.fxSlots);
	const currentType = fxSlots[slot]?.type ?? "empty";

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: slot });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : undefined,
		opacity: isDragging ? 0.55 : 1,
	};

	if (currentType === "empty") {
		return (
			<div ref={setNodeRef} style={style} className="h-full min-h-0">
				<EmptySlot slot={slot} />
			</div>
		);
	}

	// Provide drag handle + type selector to ModuleFrame via context
	const ctx = {
		dragListeners: listeners as
			| Record<string, React.EventHandler<React.SyntheticEvent>>
			| undefined,
		dragAttributes: attributes as unknown as Record<
			string,
			string | boolean | number | undefined
		>,
		typeSelector: <TypeSelectorTrigger slot={slot} currentType={currentType} />,
	};

	return (
		<div ref={setNodeRef} style={style} className="h-full min-h-0">
			<FxSlotContext.Provider value={ctx}>
				<SlotModule type={currentType} slot={slot} />
			</FxSlotContext.Provider>
		</div>
	);
});
