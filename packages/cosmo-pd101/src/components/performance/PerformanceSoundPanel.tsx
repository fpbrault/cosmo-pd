import { memo, useEffect } from "react";
import { usePhaseLineAlgorithms } from "@/components/editor/usePhaseLineAlgorithms";
import { usePhaseLineModel } from "@/components/editor/usePhaseLineModel";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import CompactAlgorithmControls, {
	CompactAlgorithmPicker,
} from "./CompactAlgorithmControls";
import CompactEnvelopePreset from "./CompactEnvelopePreset";
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
	const setLine = useSynthUiStore((state) => state.setSimpleEditedLine);
	const algo = useSynthUiStore((state) => state.simpleEditedAlgo);
	const setAlgo = useSynthUiStore((state) => state.setSimpleEditedAlgo);
	const lineColor = line === 1 ? "text-[#7f9de4]" : "text-[#c45c5c]";

	useEffect(() => {
		if (!algoBEnabled && algo === "b") setAlgo("a");
	}, [algo, algoBEnabled, setAlgo]);
	useEffect(() => {
		if (line === 1 && !line1Editable && line2Editable) setLine(2);
		if (line === 2 && !line2Editable && line1Editable) setLine(1);
	}, [line, line1Editable, line2Editable, setLine]);

	const toggleClass =
		"btn btn-xs size-8 min-h-0 rounded-sm border border-cz-border p-0 font-mono text-[0.62rem] aria-pressed:border-current aria-pressed:text-white";

	return (
		<div className="flex w-[4.6rem] shrink-0 flex-col items-center justify-center gap-1">
			<span className="font-mono text-[0.44rem] text-cz-cream/65 uppercase tracking-[0.14em]">
				Line
			</span>
			<div className="flex gap-1">
				{([1, 2] as const).map((value) => (
					<button
						key={value}
						type="button"
						aria-label={`Edit line ${value}`}
						aria-pressed={line === value}
						disabled={value === 1 ? !line1Editable : !line2Editable}
						onClick={() => setLine(value)}
						className={`${toggleClass} ${line === value ? (value === 1 ? "border-[#7f9de4] bg-[#7f9de4] text-white" : "border-[#c45c5c] bg-[#c45c5c] text-white") : value === 1 ? "bg-cz-inset text-[#7f9de4]" : "bg-cz-inset text-[#c45c5c]"} disabled:opacity-30`}
					>
						{value}
					</button>
				))}
			</div>
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
						className={`${toggleClass} bg-cz-inset disabled:opacity-30`}
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
			<div className="flex w-[20rem] min-w-0 shrink-0 flex-col gap-1">
				<div
					className={`text-center font-mono text-[0.5rem] uppercase tracking-[0.15em] ${colorClass}`}
				>
					Line {selectedLine} · Algo {selectedAlgo.toUpperCase()}
				</div>
				<div className="flex min-h-0 flex-1 gap-1">
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
			<div className="flex min-w-0 flex-1 items-center gap-1 border-cz-border border-l pl-1">
				{(["dco", "dcw", "dca"] as const).map((envKind) => {
					const entry = line.envelopes.envs[envKind];
					return (
						<CompactEnvelopePreset
							key={envKind}
							envKind={envKind}
							envelope={entry.env}
							color={entry.envColor}
							onApply={entry.setEnv}
						/>
					);
				})}
			</div>
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
			className="group flex h-full w-[5.5rem] shrink-0 flex-col items-center bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
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
			<div className="flex gap-1" aria-hidden="true">
				<span className="size-2 rounded-sm bg-[#9cb937]" />
				<span className="size-2 rounded-sm bg-[#60a5fa]" />
				<span className="size-2 rounded-sm bg-[#f97316]" />
			</div>
		</button>
	);
});
