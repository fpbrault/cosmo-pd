import { useRef } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import FxSlotFrame from "../FxSlotFrame";

export default function FxConsoleDrawer() {
	const reorderFxSlots = useSynthStore((s) => s.reorderFxSlots);
	const draggedSlot = useRef<number | null>(null);

	const handleDrop = (toSlot: number) => {
		const fromSlot = draggedSlot.current;
		draggedSlot.current = null;
		if (fromSlot == null || fromSlot === toSlot) {
			return;
		}
		reorderFxSlots(fromSlot, toSlot);
	};

	return (
		<div className="grid h-full min-h-0 grid-cols-3 grid-rows-2 gap-2">
			{[0, 1, 2, 3, 4, 5].map((slot) => (
				// biome-ignore lint/a11y/noStaticElementInteractions: Drag-and-drop requires pointer drag handlers on a non-button wrapper.
				<div
					key={slot}
					draggable
					onDragStart={() => {
						draggedSlot.current = slot;
					}}
					onDragOver={(event) => {
						event.preventDefault();
					}}
					onDrop={() => {
						handleDrop(slot);
					}}
					onDragEnd={() => {
						draggedSlot.current = null;
					}}
					className="min-h-0"
				>
					<FxSlotFrame slot={slot} />
				</div>
			))}
		</div>
	);
}
