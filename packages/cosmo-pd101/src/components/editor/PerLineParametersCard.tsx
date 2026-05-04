import { memo } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import Card from "@/components/primitives/Card";
import { useSynthParam } from "@/features/synth/SynthParamController";

interface PerLineParametersCardProps {
	color?: string;
	warpAmount: number;
	setWarpAmount: (value: number) => void;
	level: number;
	setLevel: (value: number) => void;
	/** Shared OCT value for both lines */
	octave: number;
	setOctave: (value: number) => void;
	/** L2 relative octave offset (line 2 only) */
	detuneOctave?: number;
	setDetuneOctave?: (value: number) => void;
	/** L2 semitone offset ±11 (line 2 only) */
	detuneNote?: number;
	setDetuneNote?: (value: number) => void;
	/** L2 fine detune in CZ units ±60 (line 2 only) */
	fineDetune?: number;
	setFineDetune?: (value: number) => void;
	lineIndex: 1 | 2;
}

function PerLineParametersCardInner({
	warpAmount,
	setWarpAmount,
	level,
	setLevel,
	octave,
	setOctave,
	detuneOctave,
	setDetuneOctave,
	detuneNote,
	setDetuneNote,
	fineDetune,
	setFineDetune,
	lineIndex,
}: PerLineParametersCardProps) {
	const { value: lineSelect } = useSynthParam("lineSelect");
	const detuneDisabled = lineSelect === "L1" || lineSelect === "L2";
	const detuneLabelPrefix = lineSelect === "L1+L1'" ? "L1'" : "L2";

	return (
		<Card
			variant="subtle"
			className="p-3 col-span-1 min-h-0 flex flex-col grow"
		>
			<div className="mb-3 text-3xs uppercase tracking-[0.24em] text-cz-cream">
				Parameters
			</div>
			<div className="flex-1 min-h-0 grid grid-cols-3  gap-3 place-items-center content-start">
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "warpAAmount" : "warpBAmount"}
					label="DCW Amt"
					value={warpAmount}
					size={64}
					variant="accent"
					color="#9cb937"
					modDestination={lineIndex === 1 ? "line1DcwBase" : "line2DcwBase"}
					onChange={setWarpAmount}
				/>
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1Level" : "line2Level"}
					label="Level"
					value={level}
					size={64}
					variant="accent"
					color="#9cb937"
					modDestination={lineIndex === 1 ? "line1DcaBase" : "line2DcaBase"}
					onChange={setLevel}
				/>
				<SynthParamKnob
					paramKey="lineOctave"
					label="Oct"
					value={octave}
					size={64}
					bipolar
					variant="accent"
					color="#9cb937"
					min={-2}
					max={2}
					step={1}
					onChange={(v) => setOctave(Math.round(v))}
				/>
				{setDetuneOctave != null && (
					<SynthParamKnob
						paramKey="line2DetuneOctave"
						label={`${detuneLabelPrefix} Oct`}
						value={detuneOctave ?? 0}
						variant="accent"
						bipolar
						disabled={detuneDisabled}
						size={64}
						color="var(--color-cz-tab-red)"
						min={-3}
						max={3}
						step={1}
						onChange={(v) => setDetuneOctave(Math.round(v))}
					/>
				)}
				{setDetuneNote != null && (
					<SynthParamKnob
						paramKey="line2DetuneNote"
						label={`${detuneLabelPrefix} Note`}
						value={detuneNote ?? 0}
						variant="accent"
						size={64}
						bipolar
						disabled={detuneDisabled}
						color="var(--color-cz-tab-red)"
						min={-11}
						max={11}
						step={1}
						modDestination="line2DetuneNote"
						onChange={(v) => setDetuneNote(Math.round(v))}
					/>
				)}
				{setFineDetune != null && (
					<SynthParamKnob
						paramKey="line2DetuneFine"
						label={`${detuneLabelPrefix} Fine`}
						value={fineDetune ?? 0}
						variant="accent"
						bipolar
						disabled={detuneDisabled}
						color="var(--color-cz-tab-red)"
						size={64}
						min={-60}
						max={60}
						step={1}
						modDestination="line2DetuneFine"
						onChange={(v) => setFineDetune(Math.round(v))}
					/>
				)}
			</div>
		</Card>
	);
}

const PerLineParametersCard = memo(PerLineParametersCardInner);

export default PerLineParametersCard;
