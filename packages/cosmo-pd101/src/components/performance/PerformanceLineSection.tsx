import { memo } from "react";
import { useTranslation } from "react-i18next";
import AlgorithmMark from "@/components/controls/algo/AlgorithmMark";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import type { PhaseLineModel } from "@/components/editor/phaseLineTypes";
import { usePhaseLineAlgorithms } from "@/components/editor/usePhaseLineAlgorithms";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import PerformanceAlgorithmCard from "./PerformanceAlgorithmCard";

export const LINE_BASE_OCTAVE_MIN = -2;
export const LINE_BASE_OCTAVE_MAX = 2;
export const LINE_DETUNE_OCTAVE_MIN = -3;
export const LINE_DETUNE_OCTAVE_MAX = 3;

const LINE_LABEL_CLASS =
	"max-w-16 truncate text-[0.46rem] uppercase tracking-[0.08em]";

function formatOctave(value: number) {
	return `${value >= 0 ? "+" : ""}${Math.round(value)} OCT`;
}

export default memo(function PerformanceLineSection({
	line,
	expanded,
	onToggle,
	onActivate,
	embedded,
}: {
	line: PhaseLineModel;
	expanded: boolean;
	onToggle?: () => void;
	onActivate: (slot: "a" | "b") => void;
	embedded?: boolean;
}) {
	const { t } = useTranslation("synth");
	const algorithms = usePhaseLineAlgorithms(line.algo);
	const lineIndex = line.meta.lineIndex;
	const lineColor = line.meta.color;
	const blendParam = lineIndex === 1 ? "algoBlendA" : "algoBlendB";
	const blendDestination: ModDestination =
		lineIndex === 1 ? "line1AlgoBlend" : "line2AlgoBlend";
	const lineInactive = !line.meta.isAudible;

	return (
		<section
			className={`${embedded ? "flex w-[12.5rem] shrink-0 flex-col overflow-hidden" : "flex min-w-0 flex-col overflow-hidden border border-cz-border bg-cz-surface/80"} ${expanded && !embedded ? "flex-1" : !expanded ? "w-[5.25rem] shrink-0" : ""} ${lineInactive ? "opacity-55 saturate-50" : ""}`}
			data-testid={`simple-line-${lineIndex}-section`}
			data-line-index={lineIndex}
		>
			{!embedded && (
				<button
					type="button"
					aria-expanded={expanded}
					aria-label={`${expanded ? "Collapse" : "Expand"} Line ${lineIndex}`}
					onClick={onToggle}
					className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.54rem] hover:brightness-110 focus:outline-none focus:ring-1 focus:ring-cz-light-blue focus:ring-inset"
				>
					<span className="truncate">Line {lineIndex}</span>
					<span className="ml-auto text-cz-cream/70" aria-hidden="true">
						{expanded ? "−" : "+"}
					</span>
				</button>
			)}

			{!expanded ? (
				<div className="mx-1 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-1">
					{([algorithms.slotA, algorithms.slotB] as const).map(
						(slot, index) => (
							<div
								key={index === 0 ? "a" : "b"}
								className="flex flex-col items-center text-cz-cream/60"
							>
								<span className="font-mono text-[0.4rem] uppercase">
									{index === 0 ? "A" : "B"}
								</span>
								{index === 1 && !algorithms.algoBEnabled ? (
									<span className="font-mono text-xl">—</span>
								) : (
									<div>
										{slot.value ? <AlgorithmMark value={slot.value} /> : null}
									</div>
								)}
							</div>
						),
					)}
				</div>
			) : (
				<div
					className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-0.5"
					data-testid="simple-line-editor"
					data-line-index={lineIndex}
				>
					<div className="mx-0.5 flex min-h-0 min-w-0 items-center justify-center gap-2">
						<PerformanceAlgorithmCard
							lineIndex={lineIndex}
							slot={algorithms.slotA}
							color={lineColor}
							onActivate={() => onActivate("a")}
							disabled={lineInactive}
						/>
						<PerformanceAlgorithmCard
							lineIndex={lineIndex}
							slot={algorithms.slotB}
							color={lineColor}
							onActivate={() => onActivate("b")}
							disabled={lineInactive}
						/>
					</div>

					<div
						className={`grid min-w-0 items-center gap-1 ${algorithms.algoBEnabled ? "grid-cols-4" : "grid-cols-3"}`}
					>
						<SynthParamKnob
							paramKey={lineIndex === 1 ? "line1Level" : "line2Level"}
							label={t("simpleMode.volume")}
							labelClassName={LINE_LABEL_CLASS}
							value={line.parameters.level}
							onChange={line.parameters.setLevel}
							size={48}
							variant="accent"
							color={lineColor}
							modDestination={lineIndex === 1 ? "line1DcaBase" : "line2DcaBase"}
							valueFormatter={(value) => `${Math.round(value * 100)}%`}
						/>
						<SynthParamKnob
							paramKey={lineIndex === 1 ? "warpAAmount" : "warpBAmount"}
							label={t("simpleMode.dcw")}
							labelClassName={LINE_LABEL_CLASS}
							value={line.parameters.warpAmount}
							onChange={line.parameters.setWarpAmount}
							size={48}
							variant="accent"
							color={lineColor}
							modDestination={lineIndex === 1 ? "line1DcwBase" : "line2DcwBase"}
							valueFormatter={(value) => `${Math.round(value * 100)}%`}
						/>
						<SynthParamKnob
							paramKey={lineIndex === 1 ? "lineOctave" : "line2DetuneOctave"}
							label={t("simpleMode.octave")}
							labelClassName={LINE_LABEL_CLASS}
							value={
								lineIndex === 1
									? line.parameters.octave
									: (line.parameters.detuneOctave ?? 0)
							}
							onChange={
								lineIndex === 1
									? (value) => line.parameters.setOctave(Math.round(value))
									: (value) =>
											line.parameters.setDetuneOctave?.(Math.round(value))
							}
							size={48}
							min={
								lineIndex === 1 ? LINE_BASE_OCTAVE_MIN : LINE_DETUNE_OCTAVE_MIN
							}
							max={
								lineIndex === 1 ? LINE_BASE_OCTAVE_MAX : LINE_DETUNE_OCTAVE_MAX
							}
							step={1}
							bipolar
							variant="accent"
							color={lineColor}
							modDestination={
								lineIndex === 1 ? "line1Octave" : "line2DetuneOctave"
							}
							tooltip={
								lineIndex === 1
									? "Transposes both lines by octave steps."
									: t("params.line2DetuneOctave.tooltip")
							}
							valueFormatter={formatOctave}
						/>
						{algorithms.algoBEnabled ? (
							<SynthParamKnob
								paramKey={blendParam}
								label={t("simpleMode.blend")}
								labelClassName={LINE_LABEL_CLASS}
								value={line.algo.blend}
								onChange={line.algo.setBlend}
								min={0}
								max={1}
								step={0.001}
								size={48}
								variant="accent"
								color={lineColor}
								modDestination={blendDestination}
								disabled={lineInactive}
								valueFormatter={(value) => `${Math.round(value * 100)}%`}
							/>
						) : null}
					</div>
				</div>
			)}
		</section>
	);
});
