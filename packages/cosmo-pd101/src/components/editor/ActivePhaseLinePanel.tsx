import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import { useSynthStore } from "@/features/synth/synthStore";
import { KarpunkLinePanel } from "./KarpunkLinePanel";
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
	const synthesisMethod = useSynthStore((state) =>
		lineIndex === 1 ? state.line1SynthesisMethod : state.line2SynthesisMethod,
	);

	if (section === "envelopes") {
		return (
			<PhaseLineEnvelopePanel
				envelopes={model.envelopes}
				lineIndex={model.meta.lineIndex}
				lineColor={model.meta.color}
			/>
		);
	}

	if (synthesisMethod === "karpunk") {
		return (
			<KarpunkLinePanel
				lineIndex={model.meta.lineIndex}
				color={model.meta.color}
				parameters={model.parameters}
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
