import PerformanceEffectSlot from "./PerformanceEffectSlot";
import SimpleSectionHeader from "./SimpleSectionHeader";

export default function PerformanceEffectsPanel() {
	return (
		<div
			className="flex h-full min-w-0 flex-1 flex-col border-cz-border border-l pl-2"
			data-testid="simple-effects-panel"
		>
			<SimpleSectionHeader className="text-[0.6rem]">
				Effects
			</SimpleSectionHeader>
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
