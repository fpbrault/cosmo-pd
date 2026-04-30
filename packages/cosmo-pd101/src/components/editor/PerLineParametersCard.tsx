import { memo } from "react";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import Card from "@/components/primitives/Card";

interface PerLineParametersCardProps {
	color: string;
	warpAmount: number;
	setWarpAmount: (value: number) => void;
	level: number;
	setLevel: (value: number) => void;
	octave: number;
	setOctave: (value: number) => void;
	fineDetune: number;
	setFineDetune: (value: number) => void;
	lineIndex: 1 | 2;
}

function PerLineParametersCardInner({
	color,
	warpAmount,
	setWarpAmount,
	level,
	setLevel,
	octave,
	setOctave,
	fineDetune,
	setFineDetune,
	lineIndex,
}: PerLineParametersCardProps) {
	return (
		<Card
			variant="subtle"
			className="p-3 col-span-1 min-h-0 flex flex-col grow"
		>
			<div className="mb-3 text-3xs uppercase tracking-[0.24em] text-cz-cream">
				Parameters
			</div>
			<div className="flex-1 min-h-0 grid grid-cols-2  gap-3 place-items-center content-start">
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "warpAAmount" : "warpBAmount"}
					label="DCW Amt"
					value={warpAmount}
					color={color}
					modDestination={lineIndex === 1 ? "line1DcwBase" : "line2DcwBase"}
					onChange={setWarpAmount}
				/>
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1Level" : "line2Level"}
					label="Level"
					value={level}
					color="#9cb937"
					modDestination={lineIndex === 1 ? "line1DcaBase" : "line2DcaBase"}
					onChange={setLevel}
				/>
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1Octave" : "line2Octave"}
					label="Oct"
					value={octave}
					color="#7f9de4"
					min={-2}
					max={2}
					step={1}
					onChange={(v) => setOctave(Math.round(v))}
				/>
				<SynthParamKnob
					paramKey={lineIndex === 1 ? "line1Detune" : "line2Detune"}
					label="Fine"
					value={fineDetune}
					color="#9cb937"
					min={-100}
					max={100}
					step={1}
					onChange={(v) => setFineDetune(Math.round(v))}
				/>
			</div>
		</Card>
	);
}

const PerLineParametersCard = memo(PerLineParametersCardInner);

export default PerLineParametersCard;
