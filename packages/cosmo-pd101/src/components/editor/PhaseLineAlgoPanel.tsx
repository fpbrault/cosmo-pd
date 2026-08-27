import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import SynthParamSlider from "@/components/controls/SynthParamSlider";
import { SynthSingleCycleDisplay } from "@/components/editor/SingleCycleDisplay";
import Card from "@/components/primitives/Card";
import PerLineParametersCard from "./PerLineParametersCard";
import { PhaseLineAlgoSideSection } from "./PhaseLineAlgoSideSection";
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
	const { slotA, slotB } = usePhaseLineAlgorithms(algo);

	return (
		<div
			className="grid h-full min-h-0 @max-[780px]/phase:grid-cols-[minmax(0,1fr)_minmax(13rem,1fr)_minmax(0,1fr)] grid-cols-[minmax(0,1fr)_minmax(15rem,1fr)_minmax(0,1fr)] gap-4 [@container_phase_(max-height:620px)]:gap-2"
			data-testid="phase-line-algo-layout"
		>
			<PhaseLineAlgoSideSection
				section="A"
				algo={algo}
				slot={slotA}
				lineIndex={lineIndex}
				color={color}
			/>

			<div className="flex min-h-0 flex-1 flex-col gap-4 [@container_phase_(max-height:620px)]:gap-2">
				<Card
					variant="subtle"
					padding="none"
					className="flex max-h-fit grow flex-col content-center overflow-hidden [@container_phase_(max-height:500px)]:hidden"
				>
					<div className="px-3 pt-2 pb-1 text-3xs text-cz-cream uppercase tracking-[0.24em]">
						Single Cycle
					</div>
					<SynthSingleCycleDisplay lineIndex={lineIndex} color={color} />
				</Card>
				<PerLineParametersCard parameters={parameters} lineIndex={lineIndex} />

				<div className="mt-2 flex w-full grow flex-col items-center justify-center gap-1 overflow-hidden rounded-none bg-cz-surface/50 px-4 pt-4 pb-1.5 [@container_phase_(max-height:620px)]:mt-0 [@container_phase_(max-height:620px)]:px-2 [@container_phase_(max-height:620px)]:pt-1 [@container_phase_(max-height:620px)]:pb-0.5">
					<div className="flex w-full max-w-60 items-center justify-between px-1 font-semibold text-cz-cream/80 text-xs uppercase tracking-[0.22em]">
						<span>A</span>
						<span>Blend</span>
						<span>B</span>
					</div>
					<SynthParamSlider
						paramKey={lineIndex === 2 ? "algoBlendB" : "algoBlendA"}
						orientation="horizontal"
						trackLength={240}
						label=""
						modDestination={
							lineIndex === 2 ? "line2AlgoBlend" : "line1AlgoBlend"
						}
						labelClassName="text-lg font-bold tracking-[0.3em] text-base-content/75"
						value={algo.blend}
						onChange={algo.setBlend}
						disabled={algo.algoB === null}
						color={color}
						showTicks={false}
						centerMarker
						centerDetent
						majorTickEvery={2}
						trackThickness={40}
						valueFormatter={formatAlgoBlendReadout}
						className="w-full max-w-60 pb-4 [@container_phase_(max-height:620px)]:pb-1"
					/>
				</div>
			</div>

			<PhaseLineAlgoSideSection
				section="B"
				algo={algo}
				slot={slotB}
				lineIndex={lineIndex}
				color={color}
			/>
		</div>
	);
}
