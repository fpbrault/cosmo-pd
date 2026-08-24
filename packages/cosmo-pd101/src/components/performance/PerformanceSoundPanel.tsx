import { memo } from "react";
import { useTranslation } from "react-i18next";
import { usePhaseLineAlgorithms } from "@/components/editor/usePhaseLineAlgorithms";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import type { Algo } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import CompactAlgorithmControls, {
	AlgorithmMark,
	CompactAlgorithmPicker,
} from "./CompactAlgorithmControls";
import { useCoerceSimpleEditedLine } from "./CompactLineEditToggle";
import CompactLineParameters from "./CompactLineParameters";
import CompactRoutingControls from "./CompactRoutingControls";

type AlgoChoice = {
	algo: PdAlgo;
	inactive: boolean;
	slot: "a" | "b";
};

function getAlgoChoices(algoA: Algo, algoB: Algo | null, blend: number) {
	return [
		{ algo: algoA, inactive: false, slot: "a" },
		{
			algo: algoB ?? PD_ALGOS[0].value,
			inactive: blend <= 0.001,
			slot: "b",
		},
	] satisfies AlgoChoice[];
}

export function LineAlgorithmCard({
	lineIndex,
	algoA,
	algoB,
	blend,
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
	const choices = getAlgoChoices(algoA, algoB, blend);
	const colorClass = lineIndex === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";
	const borderClass =
		lineIndex === 1 ? "border-[#7f9de4]/65" : "border-[#c45c5c]/65";

	return (
		<fieldset
			aria-label={`Line ${lineIndex} algorithms${inactive ? " (inactive)" : ""}`}
			className={`m-0 grid w-full min-w-0 grid-cols-2 self-center overflow-hidden rounded-sm border bg-cz-inset/55 p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.25)] ${borderClass} ${compact ? "h-[4.35rem]" : "h-[4.7rem]"} ${inactive ? "opacity-55 saturate-50" : ""}`}
		>
			{choices.map(({ algo, inactive: algoInactive, slot }, index) => {
				const definition = PD_ALGOS.find((entry) => entry.value === algo);
				if (!definition) return null;
				const selected = selectedLine === lineIndex && selectedAlgo === slot;
				const content = (
					<>
						<span className="font-mono text-[0.38rem] uppercase tracking-[0.12em] opacity-75">
							L{lineIndex} · {slot.toUpperCase()}
						</span>
						<span className={compact ? "scale-[0.62]" : "scale-[0.72]"}>
							<AlgorithmMark value={algo} />
						</span>
						<span className="max-w-full truncate border-current border-b px-1 pb-0.5 font-bold font-mono text-[0.38rem] uppercase tracking-[0.07em]">
							{definition.label}
						</span>
					</>
				);
				const className = `flex min-w-0 flex-col items-center justify-center px-1 ${colorClass} ${index > 0 ? "border-cz-border/70 border-l" : ""} ${selected ? "bg-current/10 shadow-[inset_0_0_0_1px_currentColor]" : "bg-transparent"} ${algoInactive && !inactive ? "opacity-40 grayscale" : ""}`;

				return onSelect ? (
					<button
						key={slot}
						type="button"
						aria-label={`Edit line ${lineIndex} algorithm ${slot.toUpperCase()}`}
						aria-pressed={selected}
						onClick={() => onSelect(lineIndex, slot)}
						className={`${className} hover:bg-current/10 focus:outline-none focus:ring-1 focus:ring-current focus:ring-inset`}
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

function LineAlgorithmSelector({
	line1,
	line2,
}: {
	line1: ReturnType<typeof usePhaseLineModel>;
	line2: ReturnType<typeof usePhaseLineModel>;
}) {
	const selectedAlgo = useSynthUiStore((state) => state.simpleEditedAlgo);
	const setAlgo = useSynthUiStore((state) => state.setSimpleEditedAlgo);
	const { line: selectedLine, setLine } = useCoerceSimpleEditedLine(
		line1.meta.isAudible,
		line2.meta.isAudible,
	);

	const select = (line: 1 | 2, algo: "a" | "b") => {
		setLine(line);
		setAlgo(algo);
	};

	return (
		<div className="flex w-[7rem] shrink-0 flex-col justify-center gap-1">
			<LineAlgorithmCard
				lineIndex={1}
				algoA={line1.algo.algoA}
				algoB={line1.algo.algoB}
				blend={line1.algo.blend}
				selectedLine={selectedLine}
				selectedAlgo={selectedAlgo}
				onSelect={select}
				inactive={!line1.meta.isAudible}
			/>
			<LineAlgorithmCard
				lineIndex={2}
				algoA={line2.algo.algoA}
				algoB={line2.algo.algoB}
				blend={line2.algo.blend}
				selectedLine={selectedLine}
				selectedAlgo={selectedAlgo}
				onSelect={select}
				inactive={!line2.meta.isAudible}
			/>
		</div>
	);
}

export default memo(function PerformanceSoundPanel() {
	const { t } = useTranslation("synth");
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const selectedAlgo = useSynthUiStore((state) => state.simpleEditedAlgo);
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const line = selectedLine === 1 ? line1 : line2;
	const line1Algorithms = usePhaseLineAlgorithms(line1.algo);
	const line2Algorithms = usePhaseLineAlgorithms(line2.algo);
	const algorithms = selectedLine === 1 ? line1Algorithms : line2Algorithms;
	const slot = selectedAlgo === "a" ? algorithms.slotA : algorithms.slotB;
	const colorClass = selectedLine === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";
	const inactiveMessage = !line.meta.isAudible
		? t("tooltips.phaseLine.inactive", {
				line: line.meta.label,
				mode: line.meta.inactiveModeLabel,
			})
		: selectedAlgo === "b" && !algorithms.algoBEnabled
			? t("tooltips.phaseLine.algoInactive")
			: null;

	return (
		<div
			className="flex min-h-0 flex-1 gap-1 p-1"
			data-testid="simple-sound-panel"
		>
			<CompactRoutingControls />
			<LineAlgorithmSelector line1={line1} line2={line2} />
			<div className="flex w-[18rem] min-w-0 shrink-0 flex-col justify-center gap-1">
				<div
					className={`text-center font-mono text-[0.5rem] uppercase tracking-[0.15em] ${colorClass}`}
				>
					Line {selectedLine} · Algo {selectedAlgo.toUpperCase()}
				</div>
				<div className="relative flex h-28 min-h-0 gap-1">
					<CompactAlgorithmPicker
						value={slot.value}
						disabled={slot.disabled}
						colorClass={colorClass}
						onChange={slot.onChange}
					/>
					<CompactAlgorithmControls
						slot={slot}
						lineIndex={selectedLine}
						color={line.meta.color}
					/>
					{inactiveMessage ? (
						<div className="absolute inset-0 z-30 flex items-center justify-center rounded bg-black/70 backdrop-blur-[5px]">
							<div className="px-3 text-center font-semibold text-cz-cream/80 text-xs tracking-wide">
								{inactiveMessage}
							</div>
						</div>
					) : null}
				</div>
				<label className="grid grid-cols-[1rem_1fr_1rem] items-center gap-1 font-mono text-[0.43rem] text-cz-cream/65 uppercase">
					<span>A</span>
					<input
						type="range"
						aria-label={`Line ${selectedLine} algorithm blend`}
						min={0}
						max={1}
						step={0.001}
						value={line.algo.blend}
						onChange={(event) => line.algo.setBlend(Number(event.target.value))}
						className="range range-xs [--range-shdw:var(--color-cz-gold)]"
					/>
					<span>B</span>
				</label>
			</div>
			<CompactLineParameters
				lineIndex={selectedLine}
				parameters={line.parameters}
				color={line.meta.color}
			/>
		</div>
	);
});

export const CollapsedSoundSummary = memo(function CollapsedSoundSummary({
	onExpand,
}: {
	onExpand: () => void;
}) {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const selectedAlgo = useSynthUiStore((state) => state.simpleEditedAlgo);
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
				Sound +
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
						selectedAlgo={selectedAlgo}
						inactive={!line.meta.isAudible}
						compact
					/>
				))}
			</div>
		</div>
	);
});
