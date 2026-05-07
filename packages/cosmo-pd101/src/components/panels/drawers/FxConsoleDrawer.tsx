import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useSynthStore } from "@/features/synth/synthStore";
import FxSlotFrame from "../FxSlotFrame";

const SLOT_IDS = [0, 1, 2, 3, 4, 5];

export default function FxConsoleDrawer() {
	const reorderFxSlots = useSynthStore((s) => s.reorderFxSlots);

	// PointerSensor handles both mouse and touch.
	// distance:8 activation prevents accidental drags on button clicks.
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
	);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (over && active.id !== over.id) {
			reorderFxSlots(Number(active.id), Number(over.id));
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={SLOT_IDS} strategy={rectSortingStrategy}>
				<div className="h-full grid min-h-0 grid-cols-3 grid-rows-2 gap-2">
					{SLOT_IDS.map((slot) => (
						<FxSlotFrame key={slot} slot={slot} />
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
