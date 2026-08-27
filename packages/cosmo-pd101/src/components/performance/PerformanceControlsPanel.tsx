import { memo } from "react";
import { MacroKnob } from "@/components/panels/macro/MacroKnobsPanel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CollapsedEffectsSummary from "./CollapsedEffectsSummary";
import CollapsedEnvelopeSummary from "./CollapsedEnvelopeSummary";
import CollapsedSoundSummary from "./CollapsedSoundSummary";
import PerformanceEffectsPanel from "./PerformanceEffectsPanel";
import PerformanceEnvelopePanel from "./PerformanceEnvelopePanel";
import PerformanceSoundPanel from "./PerformanceSoundPanel";

export default memo(function PerformanceControlsPanel() {
	const expandedSection = useSynthUiStore(
		(state) => state.simpleExpandedSection,
	);
	const setExpandedSection = useSynthUiStore(
		(state) => state.setSimpleExpandedSection,
	);
	const sectionColumns = {
		sound: "grid-cols-[minmax(0,1fr)_8.5rem_8.5rem]",
		envelope: "grid-cols-[8.5rem_minmax(0,1fr)_8.5rem]",
		effects: "grid-cols-[8.5rem_8.5rem_minmax(0,1fr)]",
	}[expandedSection];

	return (
		<section
			className="flex h-48 shrink-0 items-stretch gap-2 p-1 shadow-lg"
			data-testid="performance-controls"
		>
			<div className="flex w-[12.5rem] shrink-0 flex-col rounded-lg bg-cz-surface/95 p-1">
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.6rem]">
					Macros
				</h2>
				<div className="grid h-full grid-cols-2 items-center justify-around gap-1">
					{[0, 1, 2, 3].map((index) => (
						<MacroKnob key={index} macroIndex={index} size={54} />
					))}
				</div>
			</div>
			<div
				className={`grid min-w-0 flex-1 gap-1 overflow-hidden rounded-lg bg-cz-surface/95 p-1 ${sectionColumns}`}
				data-testid="simple-section-rack"
			>
				<div className="min-w-0 overflow-hidden">
					{expandedSection === "sound" ? (
						<PerformanceSoundPanel />
					) : (
						<CollapsedSoundSummary
							onExpand={() => setExpandedSection("sound")}
						/>
					)}
				</div>
				<div className="min-w-0 overflow-hidden">
					{expandedSection === "envelope" ? (
						<div className="flex h-full min-w-0 flex-col border-cz-border border-l pl-2">
							<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.6rem]">
								Envelope
							</h2>
							<PerformanceEnvelopePanel />
						</div>
					) : (
						<CollapsedEnvelopeSummary
							onExpand={() => setExpandedSection("envelope")}
						/>
					)}
				</div>
				<div className="min-w-0 overflow-hidden">
					{expandedSection === "effects" ? (
						<PerformanceEffectsPanel />
					) : (
						<CollapsedEffectsSummary
							onExpand={() => setExpandedSection("effects")}
						/>
					)}
				</div>
			</div>
		</section>
	);
});
