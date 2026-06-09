import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import SynthParamSlider from "@/components/controls/SynthParamSlider";
import { SynthSingleCycleDisplay } from "@/components/editor/SingleCycleDisplay";
import Card from "@/components/primitives/Card";
import AlgoSectionCard from "./AlgoSectionCard";
import { BaseWaveSelector } from "./BaseWaveSelector";
import PerLineParametersCard from "./PerLineParametersCard";
import { formatAlgoBlendReadout } from "./perLineWarpUtils";
import type {
	PhaseLineAlgoModel,
	PhaseLineParametersModel,
} from "./phaseLineTypes";
import { usePhaseLineAlgorithms } from "./usePhaseLineAlgorithms";

type PhaseLineAlgoPanelProps = {
	algo: PhaseLineAlgoModel;
	parameters: PhaseLineParametersModel;
	lineIndex: LineIndex;
	color: string;
};

export function PhaseLineAlgoPanel({
	algo,
	parameters,
	lineIndex,
	color,
}: PhaseLineAlgoPanelProps) {
	const { baseWaveEnabledA, baseWaveEnabledB, slotA, slotB } =
		usePhaseLineAlgorithms(algo);

	return (
		<div className="grid h-full min-h-0 flex-1 grid-cols-3 gap-4">
			<div className="flex min-h-0 flex-1 flex-col gap-0">
				<div
					className="mb-1 bg-cz-inset px-1.5 py-0.5 font-semibold text-3xs uppercase tracking-[0.24em]"
					style={{ color }}
				>
					Algo A
				</div>
				<div className="flex min-h-0 flex-1 flex-col gap-2">
					<AlgoSectionCard slot={slotA} lineIndex={lineIndex} color={color} />
					<BaseWaveSelector
						title="Base Wave A"
						value={algo.baseWaveformA}
						onChange={algo.setBaseWaveformA}
						disabled={!baseWaveEnabledA}
						color={color}
					/>
				</div>
			</div>

			<div className="flex min-h-0 flex-col gap-4">
				<Card
					variant="subtle"
					padding="none"
					className="flex flex-col overflow-hidden"
				>
					<div className="px-3 pt-2 pb-1 text-3xs text-cz-cream uppercase tracking-[0.24em]">
						Single Cycle
					</div>
					<SynthSingleCycleDisplay
						width={200}
						height={100}
						lineIndex={lineIndex}
						color={color}
					/>
				</Card>
				<PerLineParametersCard parameters={parameters} lineIndex={lineIndex} />

				<div className="mt-2 grow rounded-none bg-cz-surface/50 pb-1.5">
					<div className="flex w-full flex-col items-center gap-1 overflow-hidden px-4 pt-4">
						<div className="flex w-full max-w-60 items-center justify-between px-1 font-semibold text-cz-cream/80 text-xs uppercase tracking-[0.22em]">
							<span>A</span>
							<span>Blend</span>
							<span>B</span>
						</div>
						<SynthParamSlider
							paramKey={lineIndex === 2 ? "algoBlendB" : "algoBlendA"}
							orientation="horizontal"
							label=""
							labelClassName="text-lg font-bold tracking-[0.3em] text-base-content/75"
							value={algo.blend}
							onChange={algo.setBlend}
							color={color}
							showTicks
							centerMarker
							centerDetent
							majorTickEvery={2}
							trackThickness={20}
							valueFormatter={formatAlgoBlendReadout}
							className="w-full max-w-60 pb-4"
						/>
					</div>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-0">
				<div
					className="mb-1 bg-cz-inset px-1.5 py-0.5 font-semibold text-3xs uppercase tracking-[0.24em]"
					style={{ color }}
				>
					Algo B
				</div>
				<div className="flex min-h-0 flex-1 flex-col gap-2">
					<AlgoSectionCard slot={slotB} lineIndex={lineIndex} color={color} />
					<BaseWaveSelector
						title="Base Wave B"
						value={algo.baseWaveformB}
						onChange={algo.setBaseWaveformB}
						disabled={!baseWaveEnabledB}
						color={color}
					/>
				</div>
			</div>
		</div>
	);
}
