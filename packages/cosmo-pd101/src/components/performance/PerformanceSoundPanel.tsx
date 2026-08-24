import { memo, useEffect } from "react";
import { usePhaseLineAlgorithms } from "@/components/editor/usePhaseLineAlgorithms";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import CompactAlgorithmControls, {
	CompactAlgorithmPicker,
} from "./CompactAlgorithmControls";
import CompactLineEditToggle, {
	SIMPLE_EDIT_TOGGLE_CLASS,
} from "./CompactLineEditToggle";
import CompactLineParameters from "./CompactLineParameters";
import CompactRoutingControls from "./CompactRoutingControls";

function EditToggles({
	algoBEnabled,
	line1Editable,
	line2Editable,
}: {
	algoBEnabled: boolean;
	line1Editable: boolean;
	line2Editable: boolean;
}) {
	const line = useSynthUiStore((state) => state.simpleEditedLine);
	const algo = useSynthUiStore((state) => state.simpleEditedAlgo);
	const setAlgo = useSynthUiStore((state) => state.setSimpleEditedAlgo);
	const lineColor = line === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";

	useEffect(() => {
		if (!algoBEnabled && algo === "b") setAlgo("a");
	}, [algo, algoBEnabled, setAlgo]);
	return (
		<div className="flex w-[4.6rem] shrink-0 flex-col items-center justify-center gap-1">
			<CompactLineEditToggle
				line1Editable={line1Editable}
				line2Editable={line2Editable}
			/>
			<span className="mt-0.5 font-mono text-[0.44rem] text-cz-cream/65 uppercase tracking-[0.14em]">
				Algo
			</span>
			<div className={`flex gap-1 ${lineColor}`}>
				{(["a", "b"] as const).map((value) => (
					<button
						key={value}
						type="button"
						aria-label={`Edit algorithm ${value.toUpperCase()}`}
						aria-pressed={algo === value}
						disabled={value === "b" && !algoBEnabled}
						onClick={() => setAlgo(value)}
						className={`${SIMPLE_EDIT_TOGGLE_CLASS} bg-cz-inset disabled:opacity-30`}
					>
						{value.toUpperCase()}
					</button>
				))}
			</div>
		</div>
	);
}

export default memo(function PerformanceSoundPanel() {
	const selectedLine = useSynthUiStore((state) => state.simpleEditedLine);
	const selectedAlgo = useSynthUiStore((state) => state.simpleEditedAlgo);
	const line1 = usePhaseLineModel(1);
	const line2 = usePhaseLineModel(2);
	const line = selectedLine === 1 ? line1 : line2;
	const algorithms = usePhaseLineAlgorithms(line.algo);
	const slot = selectedAlgo === "a" ? algorithms.slotA : algorithms.slotB;
	const colorClass = selectedLine === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";

	return (
		<div
			className="flex min-h-0 flex-1 gap-1 p-1"
			data-testid="simple-sound-panel"
		>
			<CompactRoutingControls />
			<EditToggles
				algoBEnabled={algorithms.algoBEnabled}
				line1Editable={line1.meta.isAudible}
				line2Editable={line2.meta.isAudible}
			/>
			<div className="flex w-[20rem] min-w-0 shrink-0 flex-col justify-center gap-1">
				<div
					className={`text-center font-mono text-[0.5rem] uppercase tracking-[0.15em] ${colorClass}`}
				>
					Line {selectedLine} · Algo {selectedAlgo.toUpperCase()}
				</div>
				<div className="flex h-28 min-h-0 gap-1">
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
	const line = useSynthUiStore((state) => state.simpleEditedLine);
	const slot = useSynthUiStore((state) => state.simpleEditedAlgo);
	const { value: lineSelect } = useSynthParam("lineSelect");
	const { value: modMode } = useSynthParam("modMode");
	const { value: line1A } = useSynthParam("warpAAlgo");
	const { value: line1B } = useSynthParam("algo2A");
	const { value: line2A } = useSynthParam("warpBAlgo");
	const { value: line2B } = useSynthParam("algo2B");
	const selectedAlgo =
		line === 1
			? slot === "a"
				? line1A
				: line1B
			: slot === "a"
				? line2A
				: line2B;
	const algoLabel =
		PD_ALGOS.find((algo) => algo.value === selectedAlgo)?.label ?? "Off";

	return (
		<button
			type="button"
			onClick={onExpand}
			aria-label="Expand Sound section"
			className="group flex h-full w-[7rem] shrink-0 flex-col items-center bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			data-testid="simple-sound-summary"
		>
			<span className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center px-0 py-0 text-[0.48rem] tracking-[0.12em] transition-[filter] group-hover:brightness-125">
				Sound +
			</span>
			<div className="my-auto flex flex-col gap-1 font-mono text-[0.44rem] uppercase tracking-[0.05em]">
				<span>{lineSelect.replaceAll("'", "′")}</span>
				<span>{modMode}</span>
				<span>
					L{line} · {slot.toUpperCase()}
				</span>
				<span className="max-w-20 truncate text-cz-gold">{algoLabel}</span>
			</div>
		</button>
	);
});
