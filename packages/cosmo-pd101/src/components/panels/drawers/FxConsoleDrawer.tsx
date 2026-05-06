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
import FxSlotFrame from "../FxSlotFrame";

const SLOT_IDS = [0, 1, 2, 3, 4, 5];

export default function FxConsoleDrawer() {
	const reorderFxSlots = useSynthStore((s) => s.reorderFxSlots);

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
