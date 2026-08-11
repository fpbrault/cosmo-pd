import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import { useSynthStore } from "@/features/synth/synthStore";
import { PhaseLineAlgoPanel } from "./PhaseLineAlgoPanel";
import { PhaseLineEnvelopePanel } from "./PhaseLineEnvelopePanel";
import type { PhaseLineSection } from "./phaseLineTypes";
import { usePhaseLineModel } from "./usePhaseLineModel";
import { VzLinePanel } from "./VzLinePanel";

type ActivePhaseLinePanelProps = {
	lineIndex: LineIndex;
	section: PhaseLineSection;
};

export function ActivePhaseLinePanel({
	lineIndex,
	section,
}: ActivePhaseLinePanelProps) {
	const model = usePhaseLineModel(lineIndex);
	const isLine1 = lineIndex === 1;
	const synthesisMethod = useSynthStore((state) =>
		isLine1 ? state.line1SynthesisMethod : state.line2SynthesisMethod,
	);
	const vz = useSynthStore((state) =>
		isLine1 ? state.line1Vz : state.line2Vz,
	);
	const setVz = useSynthStore((state) =>
		isLine1 ? state.setLine1Vz : state.setLine2Vz,
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

	if (synthesisMethod === "vz") {
		return (
			<VzLinePanel
				lineIndex={model.meta.lineIndex}
				color={model.meta.color}
				vz={vz}
				onChange={setVz}
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
