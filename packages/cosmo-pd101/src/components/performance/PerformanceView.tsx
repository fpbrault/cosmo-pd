import { memo } from "react";
import { usePresetManager } from "@/context/PresetManagerContext";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import PerformanceAudioDisplay from "./PerformanceAudioDisplay";
import PerformanceControlsPanel from "./PerformanceControlsPanel";

export default memo(function PerformanceView() {
	const { activePresetName, allPresetEntries, activePresetId } =
		usePresetManager();
	const displayMode = useSynthUiStore((state) => state.scopeVisualizationMode);
	const activeEntry = allPresetEntries.find(
		(entry) => entry.id === activePresetId,
	);
	const author = activeEntry?.author?.trim() || "Purr Audio";
	const tags = activeEntry?.tags?.slice(0, 2).join(" · ") || "Phase distortion";

	return (
		<main
			className="@container/performance flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden bg-cz-panel px-2 py-1"
			data-testid="performance-view"
		>
			<section className="relative min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-cz-border bg-cz-lcd-bg shadow-inner">
				<PerformanceAudioDisplay mode={displayMode} />
				<div className="pointer-events-none absolute top-6 left-8 z-10 text-shadow-lg">
					<h1 className="font-bold font-mono text-3xl text-cz-cream uppercase tracking-[0.08em]">
						{activePresetName}
					</h1>
					<p className="mt-1 font-mono text-cz-light-blue text-sm uppercase tracking-[0.16em]">
						{author}
					</p>
					<p className="mt-1 font-mono text-3xs text-cz-cream/75 uppercase tracking-[0.15em]">
						{tags}
					</p>
				</div>
				<div className="pointer-events-none absolute right-20 bottom-11 left-48 flex justify-between font-mono text-[0.5rem] text-cz-cream/60">
					{displayMode === "spectrumWaterfall" ||
					displayMode === "spectrogram" ? (
						<>
							<span>20</span>
							<span>100</span>
							<span>1k</span>
							<span>10k</span>
							<span>20k Hz</span>
						</>
					) : displayMode === "scopeHistory" || displayMode === "waveform" ? (
						<>
							<span>0</span>
							<span>0.5</span>
							<span>1</span>
							<span>1.5</span>
							<span>2 cycles</span>
						</>
					) : null}
				</div>
			</section>
			<PerformanceControlsPanel />
		</main>
	);
});
