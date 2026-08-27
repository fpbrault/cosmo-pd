import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import LineAlgorithmCard from "./LineAlgorithmCard";

export default memo(function CollapsedSoundSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const selectedAlgos = useSynthUiStore(
		(state) => state.simpleEditedAlgoByLine,
	);
	const lines = [usePhaseLineModel(1), usePhaseLineModel(2)];

	return (
		<div
			className="group relative flex h-full w-full min-w-0 flex-col items-center bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset"
			data-testid="simple-sound-summary"
		>
			<button
				type="button"
				onClick={onExpand}
				aria-label="Expand Sound section"
				className="absolute inset-0 z-10 focus:outline-none focus:ring-1 focus:ring-cz-light-blue focus:ring-inset"
			/>
			<span className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center px-0 py-0 text-[0.48rem] tracking-[0.12em] transition-[filter] group-hover:brightness-125">
				VOICE +
			</span>
			<div className="pointer-events-none my-auto flex w-full flex-col justify-center gap-2 px-1.5">
				{lines.map((line) => (
					<LineAlgorithmCard
						key={line.meta.lineIndex}
						lineIndex={line.meta.lineIndex}
						algoA={line.algo.algoA}
						algoB={line.algo.algoB}
						blend={line.algo.blend}
						selectedLine={selectedLine}
						selectedAlgo={selectedAlgos[line.meta.lineIndex]}
						compact
						inactive={!line.meta.isAudible}
					/>
				))}
			</div>
		</div>
	);
});
