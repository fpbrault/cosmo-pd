import PerformanceEffectSlot from "./PerformanceEffectSlot";

export default function PerformanceEffectsPanel() {
	return (
		<div
			className="flex h-full min-w-0 flex-1 flex-col border-cz-border border-l pl-2"
			data-testid="simple-effects-panel"
		>
			<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.6rem]">
				Effects
			</h2>
			<div
				className="flex min-h-0 flex-1 gap-1.5"
				data-testid="performance-fx-slots"
			>
				{[0, 1, 2, 3, 4, 5].map((slot) => (
					<PerformanceEffectSlot key={slot} slot={slot} />
				))}
			</div>
		</div>
	);
}
