import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxChainMode } from "@/lib/synth/bindings/synth";
import FxSlotFrame from "../FxSlotFrame";

const SLOT_IDS = [0, 1, 2, 3, 4, 5];

function SeriesIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Series</title>
			<path d="M2 9h11M9 5l5 4-5 4" />
		</svg>
	);
}

function ParallelIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Parallel</title>
			<path d="M2 5h11M9 2l4 3-4 3" />
			<path d="M2 13h11M9 10l4 3-4 3" />
		</svg>
	);
}

export default function FxConsoleDrawer() {
	const reorderFxSlots = useSynthStore((s) => s.reorderFxSlots);
	const fxChainMode = useSynthStore((s) => s.fxChainMode);
	const setFxChainMode = useSynthStore((s) => s.setFxChainMode);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 180,
				tolerance: 10,
			},
		}),
	);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (over && active.id !== over.id) {
			reorderFxSlots(Number(active.id), Number(over.id));
		}
	};

	const toggleMode = () => {
		setFxChainMode(
			(fxChainMode === "series" ? "parallel" : "series") as FxChainMode,
		);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={SLOT_IDS} strategy={rectSortingStrategy}>
				<div className="relative h-full min-h-0">
					<div className="grid h-full min-h-0 grid-cols-3 grid-rows-2 gap-2">
						{SLOT_IDS.map((slot) => (
							<FxSlotFrame key={slot} slot={slot} />
						))}
					</div>
					<div className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
						<button
							type="button"
							onClick={toggleMode}
							title={
								fxChainMode === "series"
									? "Switch to parallel FX chain"
									: "Switch to series FX chain"
							}
							className="btn btn-xs btn-square flex items-center justify-center rounded-md border border-cz-border/40 bg-cz-surface text-cz-cream-dim shadow-sm transition-colors hover:border-cz-gold/60 hover:text-cz-gold"
						>
							{fxChainMode === "series" ? <SeriesIcon /> : <ParallelIcon />}
						</button>
					</div>
				</div>
			</SortableContext>
		</DndContext>
	);
}
