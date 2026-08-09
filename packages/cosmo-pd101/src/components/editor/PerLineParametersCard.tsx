import { memo } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import Card from "@/components/primitives/Card";
import type { PhaseLineParametersModel } from "./phaseLineTypes";

interface PerLineParametersCardProps {
	parameters: PhaseLineParametersModel;
	lineIndex: 1 | 2;
}

function PerLineParametersCardInner({
	parameters,
	lineIndex,
}: PerLineParametersCardProps) {
	return (
		<Card
			variant="subtle"
			className="col-span-1 flex min-h-0 grow flex-col p-3 [@container_phase_(max-height:620px)]:p-1.5"
		>
			<div className="mb-3 text-3xs text-cz-cream uppercase tracking-[0.24em] [@container_phase_(max-height:620px)]:mb-1">
				Parameters
			</div>
			<div className="grid min-h-0 flex-1 grid-cols-3 place-items-center content-center gap-3 [@container_phase_(max-height:620px)]:gap-1">
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1DcwAmount" : "line2DcwAmount"}
					label="DCW Amt"
					value={parameters.dcwAmount}
					size={64}
					variant="accent"
					color="#9cb937"
					modDestination={lineIndex === 1 ? "line1DcwBase" : "line2DcwBase"}
					onChange={parameters.setDcwAmount}
				/>
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1Level" : "line2Level"}
					label="Level"
					value={parameters.level}
					size={64}
					variant="accent"
					color="#9cb937"
					modDestination={lineIndex === 1 ? "line1DcaBase" : "line2DcaBase"}
					onChange={parameters.setLevel}
				/>
				<SynthParamKnob
					paramKey="lineOctave"
					label="Oct"
					value={parameters.octave}
					size={64}
					bipolar
					variant="accent"
					color="#9cb937"
					min={-2}
					max={2}
					step={1}
					modDestination="line1Octave"
					onChange={(v) => parameters.setOctave(Math.round(v))}
				/>
				<SynthParamKnob
					paramKey="line2DetuneOctave"
					label={`${parameters.detuneLabelPrefix} Oct`}
					value={parameters.detuneOctave ?? 0}
					variant="accent"
					bipolar
					disabled={parameters.detuneDisabled}
					size={64}
					color="var(--color-cz-tab-red)"
					min={-3}
					max={3}
					step={1}
					modDestination="line2DetuneOctave"
					onChange={(v) => parameters.setDetuneOctave?.(Math.round(v))}
				/>
				<SynthParamKnob
					paramKey="line2DetuneNote"
					label={`${parameters.detuneLabelPrefix} Note`}
					value={parameters.detuneNote ?? 0}
					variant="accent"
					size={64}
					bipolar
					disabled={parameters.detuneDisabled}
					color="var(--color-cz-tab-red)"
					min={-11}
					max={11}
					step={1}
					modDestination="line2DetuneNote"
					onChange={(v) => parameters.setDetuneNote?.(Math.round(v))}
				/>

				<SynthParamKnob
					paramKey="line2DetuneFine"
					label={`${parameters.detuneLabelPrefix} Fine`}
					value={parameters.fineDetune ?? 0}
					variant="accent"
					bipolar
					disabled={parameters.detuneDisabled}
					color="var(--color-cz-tab-red)"
					size={64}
					min={-60}
					max={60}
					step={1}
					modDestination="line2DetuneFine"
					onChange={(v) => parameters.setFineDetune?.(Math.round(v))}
				/>
			</div>
		</Card>
	);
}

const PerLineParametersCard = memo(PerLineParametersCardInner);

export default PerLineParametersCard;
