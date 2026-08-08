import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import SynthParamSlider from "@/components/controls/parameters/SynthParamSlider";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type { PhaseLineEnvelopeModel } from "../../phase-lines/phaseLineTypes";

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
				className="w-52"
				step={1}
				labelPlacement="inline"
				onChange={(value) => envelopes.setDcwKeyFollow(Math.round(value))}
				orientation="horizontal"
			/>
		);
	}

	if (envKind === "dca") {
		return (
			<SynthParamSlider
				paramKey={lineIndex === 1 ? "line1DcaKeyFollow" : "line2DcaKeyFollow"}
				label="Key Follow"
				value={envelopes.dcaKeyFollow}
				min={0}
				showTicks={false}
				centerDetent={false}
				max={9}
				className="w-52"
				step={1}
				labelPlacement="inline"
				onChange={(value) => envelopes.setDcaKeyFollow(Math.round(value))}
				orientation="horizontal"
			/>
		);
	}

	return null;
}
