import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import { PhaseLineAlgoPanel } from "./PhaseLineAlgoPanel";
import { PhaseLineEnvelopePanel } from "./PhaseLineEnvelopePanel";
import type { PhaseLineSection } from "./phaseLineTypes";
import { usePhaseLineModel } from "./usePhaseLineModel";

type ActivePhaseLinePanelProps = {
	lineIndex: LineIndex;
	section: PhaseLineSection;
};

export function ActivePhaseLinePanel({
	lineIndex,
	section,
}: ActivePhaseLinePanelProps) {
	const model = usePhaseLineModel(lineIndex);

	if (section === "envelopes") {
		return (
			<PhaseLineEnvelopePanel
				envelopes={model.envelopes}
				lineIndex={model.meta.lineIndex}
				lineColor={model.meta.color}
			/>
		);
	}

	return (
		<PhaseLineAlgoPanel
			algo={model.algo}
			parameters={model.parameters}
			lineIndex={model.meta.lineIndex}
			color={model.meta.color}
		/>
	);
}
