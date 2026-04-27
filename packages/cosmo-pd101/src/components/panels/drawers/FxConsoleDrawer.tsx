import FxSlotFrame from "../FxSlotFrame";

export default function FxConsoleDrawer() {
	return (
		<div className="grid h-full min-h-0 grid-cols-3 grid-rows-2 gap-2">
			{[0, 1, 2, 3, 4, 5].map((slot) => (
				<FxSlotFrame key={slot} slot={slot} />
			))}
		</div>
	);
}
