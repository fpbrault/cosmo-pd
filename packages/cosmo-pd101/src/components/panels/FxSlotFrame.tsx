import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import DelayModule from "./drawer-modules/DelayModule";
import { FX_SLOT_MODULE_CONFIGS } from "./drawer-modules/fxSlotModuleConfig";
import GenericFxSlotModule from "./drawer-modules/GenericFxSlotModule";
import PhaseModModule from "./drawer-modules/PhaseModModule";
import VibratoModule from "./drawer-modules/VibratoModule";
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
];

/** For active slots: includes a "Remove" option at the top. */
const FX_CHANGE_OPTIONS: { value: FxSlotType; label: string }[] = [
	{ value: "empty", label: "Remove" },
	...FX_EFFECT_OPTIONS,
];

// ---------------------------------------------------------------------------
// TypeSelectorPopover — portal-based so overflow:hidden parents don't clip it
// ---------------------------------------------------------------------------

type PopoverPos = { top: number; right: number };

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
				right: window.innerWidth - pos.right,
				zIndex: 9999,
			}}
			className="w-36 overflow-hidden rounded border border-cz-border bg-cz-panel py-1 shadow-[0_8px_24px_rgba(0,0,0,0.65)]"
		>
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					onClick={() => onSelect(o.value)}
					className={[
						"w-full px-3 py-1 text-left font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors hover:bg-white/10",
						o.value === "empty"
							? "text-red-400/80 hover:text-red-300"
							: currentType === o.value
								? "text-white"
								: "text-cz-cream-dim",
					].join(" ")}
				>
					{o.label}
				</button>
			))}
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
			setPopoverPos({ top: rect.bottom + 4, right: rect.right });
		}
	};

	const handleSelect = (type: FxSlotType) => {
		setFxSlotType(slot, type);
		setPopoverPos(null);
	};

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={openPopover}
				aria-label="Change effect type"
				className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded opacity-60 transition-opacity hover:opacity-100"
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
			</button>
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
			// Center the popover horizontally on the trigger button
			setPopoverPos({
				top: rect.bottom + 8,
				right: rect.left + rect.width / 2 + 72,
			});
		}
	};

	const handleSelect = (type: FxSlotType) => {
		if (type !== "empty") setFxSlotType(slot, type);
		setPopoverPos(null);
	};

	return (
		<div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-white/15">
			<button
				ref={triggerRef}
				type="button"
				onClick={openPopover}
				aria-label="Add effect to slot"
				className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xl text-white/40 transition-all hover:border-white/50 hover:text-white/80"
			>
				+
			</button>
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
	// Modules with custom layouts handled by dedicated components
	if (type === "delay") return <DelayModule slot={slot} />;
	if (type === "vibrato") return <VibratoModule />;
	if (type === "phaseMod") return <PhaseModModule />;

	// All other slot-based FX modules are driven by config
	const config = FX_SLOT_MODULE_CONFIGS[type];
	if (config) return <GenericFxSlotModule config={config} slot={slot} />;

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
		dragAttributes: attributes as Record<
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
