import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import AlgoSectionCard from "./AlgoSectionCard";
import { BaseWaveSelector } from "./BaseWaveSelector";
import type { AlgoSlotViewModel, PhaseLineAlgoModel } from "./phaseLineTypes";

type PhaseLineAlgoSideSectionProps = {
	section: "A" | "B";
	algo: PhaseLineAlgoModel;
	slot: AlgoSlotViewModel;
	baseWaveEnabled: boolean;
	lineIndex: LineIndex;
	color: string;
};

export function PhaseLineAlgoSideSection({
	section,
	algo,
	slot,
	baseWaveEnabled,
	lineIndex,
	color,
}: PhaseLineAlgoSideSectionProps) {
	const baseWaveValue =
		section === "A" ? algo.baseWaveformA : algo.baseWaveformB;
	const onBaseWaveChange =
		section === "A" ? algo.setBaseWaveformA : algo.setBaseWaveformB;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-0">
			<div
				className="mb-1 bg-cz-inset px-1.5 py-0.5 font-semibold text-3xs uppercase tracking-[0.24em]"
				style={{ color }}
			>
				Algo {section}
			</div>
			<div className="flex min-h-0 flex-1 flex-col gap-2">
				<AlgoSectionCard slot={slot} lineIndex={lineIndex} color={color} />
				<BaseWaveSelector
					title={`Base Wave ${section}`}
					value={baseWaveValue}
					onChange={onBaseWaveChange}
					disabled={!baseWaveEnabled}
					color={color}
				/>
			</div>
		</div>
	);
}
