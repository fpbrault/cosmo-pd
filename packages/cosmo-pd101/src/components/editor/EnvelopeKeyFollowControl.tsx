import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import SynthParamSlider from "@/components/controls/SynthParamSlider";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { PhaseLineEnvelopeModel } from "./phaseLineTypes";

type EnvelopeKeyFollowControlProps = {
	envKind: EnvTab;
	lineIndex: LineIndex;
	envelopes: PhaseLineEnvelopeModel;
};

export function EnvelopeKeyFollowControl({
	envKind,
	lineIndex,
	envelopes,
}: EnvelopeKeyFollowControlProps) {
	if (envKind === "dcw") {
		return (
			<SynthParamSlider
				paramKey={lineIndex === 1 ? "line1DcwKeyFollow" : "line2DcwKeyFollow"}
				label="Key Follow"
				value={envelopes.dcwKeyFollow}
				min={0}
				showTicks={false}
				centerDetent={false}
				max={9}
				className="w-64"
				step={1}
				onChange={(value) => envelopes.setDcwKeyFollow(Math.round(value))}
				orientation="horizontal"
			/>
		);
	}

	if (envKind === "dca") {
		return (
			<SynthParamKnob
				paramKey={lineIndex === 1 ? "line1DcaKeyFollow" : "line2DcaKeyFollow"}
				label="Key Follow"
				value={envelopes.dcaKeyFollow}
				size={44}
				min={0}
				max={9}
				step={1}
				onChange={(value) => envelopes.setDcaKeyFollow(Math.round(value))}
			/>
		);
	}

	return null;
}
