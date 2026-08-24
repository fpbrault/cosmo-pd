import { memo } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import type { PhaseLineParametersModel } from "@/components/editor/phaseLineTypes";

export default memo(function CompactLineParameters({
	lineIndex,
	parameters,
	color,
}: {
	lineIndex: 1 | 2;
	parameters: PhaseLineParametersModel;
	color: string;
}) {
	const labelClassName =
		"max-w-12 truncate text-[0.44rem] uppercase tracking-[0.08em]";

	return (
		<div
			className="grid w-[9rem] shrink-0 grid-cols-3 grid-rows-2 place-items-center gap-x-0.5 border-cz-border border-l pl-1"
			data-testid="simple-line-parameters"
		>
			<SynthParamKnob
				paramKey={lineIndex === 1 ? "line1Level" : "line2Level"}
				label="Volume"
				labelClassName={labelClassName}
				value={parameters.level}
				onChange={parameters.setLevel}
				size={34}
				variant="accent"
				color={color}
				modDestination={lineIndex === 1 ? "line1DcaBase" : "line2DcaBase"}
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<SynthParamKnob
				paramKey={lineIndex === 1 ? "warpAAmount" : "warpBAmount"}
				label="DCW"
				labelClassName={labelClassName}
				value={parameters.warpAmount}
				onChange={parameters.setWarpAmount}
				size={34}
				variant="accent"
				color={color}
				modDestination={lineIndex === 1 ? "line1DcwBase" : "line2DcwBase"}
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<SynthParamKnob
				paramKey="lineOctave"
				label="Tune"
				labelClassName={labelClassName}
				value={parameters.octave}
				onChange={(value) => parameters.setOctave(Math.round(value))}
				size={34}
				min={-2}
				max={2}
				step={1}
				bipolar
				variant="accent"
				color={color}
				modDestination="line1Octave"
				valueFormatter={(value) =>
					`${value >= 0 ? "+" : ""}${Math.round(value)} oct`
				}
			/>
			<SynthParamKnob
				paramKey="line2DetuneOctave"
				label={`${parameters.detuneLabelPrefix} Oct`}
				labelClassName={labelClassName}
				value={parameters.detuneOctave ?? 0}
				onChange={(value) => parameters.setDetuneOctave?.(Math.round(value))}
				disabled={parameters.detuneDisabled}
				size={34}
				min={-3}
				max={3}
				step={1}
				bipolar
				variant="accent"
				color="#c45c5c"
				modDestination="line2DetuneOctave"
			/>
			<SynthParamKnob
				paramKey="line2DetuneNote"
				label={`${parameters.detuneLabelPrefix} Note`}
				labelClassName={labelClassName}
				value={parameters.detuneNote ?? 0}
				onChange={(value) => parameters.setDetuneNote?.(Math.round(value))}
				disabled={parameters.detuneDisabled}
				size={34}
				min={-11}
				max={11}
				step={1}
				bipolar
				variant="accent"
				color="#c45c5c"
				modDestination="line2DetuneNote"
			/>
			<SynthParamKnob
				paramKey="line2DetuneFine"
				label={`${parameters.detuneLabelPrefix} Fine`}
				labelClassName={labelClassName}
				value={parameters.fineDetune ?? 0}
				onChange={(value) => parameters.setFineDetune?.(Math.round(value))}
				disabled={parameters.detuneDisabled}
				size={34}
				min={-60}
				max={60}
				step={1}
				bipolar
				variant="accent"
				color="#c45c5c"
				modDestination="line2DetuneFine"
			/>
		</div>
	);
});
