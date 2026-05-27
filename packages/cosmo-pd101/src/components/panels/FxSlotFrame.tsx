import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import Button from "@/components/controls/Button";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import FxSlotModuleRenderer from "./drawer-modules/FxSlotModuleRenderer";
import { FX_SLOT_MODULE_CONFIGS } from "./drawer-modules/fxSlotModuleConfig";
import { FxSlotContext } from "./FxSlotContext";
import type { PopoverPos } from "./FxTypeSelectorPopover";
import FxTypeSelectorPopover, {
	getTypeSelectorPosition,
} from "./FxTypeSelectorPopover";
import { getFxTypeLabel } from "./fxTypeCategories";

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

	const currentLabel = getFxTypeLabel(currentType);

	return (
		<>
			<Button
				ref={triggerRef}
				type="button"
				onClick={openPopover}
				aria-label={`Change effect type (${currentLabel})`}
				className="btn btn-xs btn-ghost btn-neutral btn-square"
			>
				<MdArrowDropDown className="h-6 w-6 shrink-0" />
			</Button>
			{popoverPos && (
				<FxTypeSelectorPopover
					pos={popoverPos}
					currentType={currentType}
					showRemove
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
				<FxTypeSelectorPopover
					pos={popoverPos}
					currentType="empty"
					showRemove={false}
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
	} = useSortable({
		id: slot,
		animateLayoutChanges: (args) => {
			if (args.wasDragging) {
				return false;
			}

			return defaultAnimateLayoutChanges(args);
		},
	});

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
