import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import CollapsedSectionSummary from "./CollapsedSectionSummary";
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
		<CollapsedSectionSummary
			title="VOICE +"
			ariaLabel="Expand Sound section"
			testId="simple-sound-summary"
			onExpand={onExpand}
			headerClassName="text-[0.48rem] tracking-[0.12em]"
		>
			<div className="pointer-events-none my-auto flex w-full flex-col justify-center gap-2 px-1.5">
				{lines.map((line) => (
					<LineAlgorithmCard
						key={line.meta.lineIndex}
						lineIndex={line.meta.lineIndex}
						algoA={line.algo.algoA}
						algoB={line.algo.algoB}
						selectedLine={selectedLine}
						selectedAlgo={selectedAlgos[line.meta.lineIndex]}
						compact
						inactive={!line.meta.isAudible}
					/>
				))}
			</div>
		</CollapsedSectionSummary>
	);
});
