import { memo } from "react";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import type { Algo } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { AlgorithmMark } from "./CompactAlgorithmControls";
import {
	PerformanceRoutingSection,
	PerformanceVoiceRack,
	PerformanceVoiceSection,
} from "./PerformanceCzSections";
import PerformanceLineSection from "./PerformanceLineSection";

type AlgoChoice = {
	algo: PdAlgo | null;
	inactive: boolean;
	slot: "a" | "b";
};

function getAlgoChoices(algoA: Algo, algoB: Algo | null) {
	return [
		{ algo: algoA, inactive: false, slot: "a" },
		{
			algo: algoB,
			inactive: algoB === null,
			slot: "b",
		},
	] satisfies AlgoChoice[];
}

export function LineAlgorithmCard({
	lineIndex,
	algoA,
	algoB,
	selectedLine,
	selectedAlgo,
	onSelect,
	compact = false,
	inactive = false,
}: {
	lineIndex: 1 | 2;
	algoA: Algo;
	algoB: Algo | null;
	blend: number;
	selectedLine?: 1 | 2;
	selectedAlgo?: "a" | "b";
	onSelect?: (line: 1 | 2, algo: "a" | "b") => void;
	compact?: boolean;
	inactive?: boolean;
}) {
	const choices = getAlgoChoices(algoA, algoB);
	const colorClass = lineIndex === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";

	return (
		<fieldset
			aria-label={`Line ${lineIndex} algorithms${inactive ? " (inactive)" : ""}`}
			className={`m-0 grid w-full min-w-0 grid-cols-2 gap-1 self-center border-0 p-0 ${compact ? "h-[4.35rem]" : "h-[4.7rem]"} ${inactive ? "opacity-55 saturate-50" : ""}`}
		>
			{choices.map(({ algo, inactive: algoInactive, slot }) => {
				const definition = algo
					? PD_ALGOS.find((entry) => entry.value === algo)
					: null;
				if (algo && !definition) return null;
				const selected = selectedLine === lineIndex && selectedAlgo === slot;
				const content = (
					<>
						<span className="flex h-4 w-full shrink-0 items-center bg-cz-inset px-1 font-bold font-mono text-[0.38rem] text-cz-cream/75 uppercase tracking-[0.08em]">
							{lineIndex}
							{slot.toUpperCase()}
						</span>
						<span className="flex min-h-0 flex-1 items-center justify-center text-cz-gold">
							{algo ? (
								<span className={compact ? "scale-[0.62]" : "scale-[0.72]"}>
									<AlgorithmMark value={algo} />
								</span>
							) : (
								<span className="font-mono text-xl">—</span>
							)}
						</span>
						<span
							className={`flex h-[1.15rem] w-full shrink-0 items-center justify-center truncate border-cz-border border-t bg-cz-inset px-1 font-bold font-mono text-[0.38rem] uppercase tracking-[0.07em] ${colorClass}`}
						>
							{definition?.label ?? "None"}
						</span>
					</>
				);
				const className = `flex min-w-0 flex-col items-center overflow-hidden border border-cz-border bg-cz-surface ${selected ? `shadow-[inset_0_0_0_1px_currentColor] ${colorClass}` : ""} ${algoInactive && !inactive ? "opacity-40 grayscale" : ""}`;

				return onSelect ? (
					<button
						key={slot}
						type="button"
						aria-label={`Edit line ${lineIndex} algorithm ${slot.toUpperCase()}`}
						aria-pressed={selected}
						disabled={inactive}
						onClick={() => onSelect(lineIndex, slot)}
						className={`${className} focus:outline-none focus:ring-1 focus:ring-current focus:ring-inset`}
					>
						{content}
					</button>
				) : (
					<span key={slot} className={className}>
						{content}
					</span>
				);
			})}
		</fieldset>
	);
}

export default memo(function PerformanceSoundPanel() {
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const setLine = useSynthUiStore((state) => state.setSimpleEditedLine);

	return (
		<div
			className="flex min-h-0 min-w-0 flex-1 gap-1"
			data-testid="simple-sound-panel"
		>
			<PerformanceVoiceRack>
				<PerformanceLineSection
					line={line1}
					expanded
					onActivate={() => setLine(1)}
					embedded
				/>
				<PerformanceLineSection
					line={line2}
					expanded
					onActivate={() => setLine(2)}
					embedded
				/>
				<PerformanceRoutingSection embedded />
				<PerformanceVoiceSection embedded />
			</PerformanceVoiceRack>
		</div>
	);
});

export const CollapsedSoundSummary = memo(function CollapsedSoundSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const selectedAlgos = useSynthUiStore(
		(state) => state.simpleEditedAlgoByLine,
	);
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const lines = [line1, line2];

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
