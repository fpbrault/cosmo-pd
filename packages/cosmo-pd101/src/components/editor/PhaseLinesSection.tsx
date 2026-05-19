import { useEffect } from "react";
import Card, { joinClasses } from "@/components/primitives/Card";
import CzTabButton from "@/components/primitives/CzTabButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { PhaseLinePanelTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type {
	Algo,
	AlgoControlValueV1,
	BaseWaveform,
	StepEnvData,
} from "@/lib/synth/bindings/synth";
import { PerLineWarpBlock } from "./PerLineWarpBlock";

export type LineSelect = "L1" | "L2" | "L1+L1'" | "L1+L2'";

export type EnvOverrideHandlers = {
	onLine1DcoEnvChange?: (next: StepEnvData) => void;
	onLine1DcwEnvChange?: (next: StepEnvData) => void;
	onLine1DcaEnvChange?: (next: StepEnvData) => void;
	onLine2DcoEnvChange?: (next: StepEnvData) => void;
	onLine2DcwEnvChange?: (next: StepEnvData) => void;
	onLine2DcaEnvChange?: (next: StepEnvData) => void;
};

export type PhaseLinesSectionProps = {
	onActiveTabChange?: (v: "line1" | "line2") => void;
	className?: string;
	envOverrideHandlers?: EnvOverrideHandlers;
};

export default function PhaseLinesSection({
	onActiveTabChange,
	className,
	envOverrideHandlers,
}: PhaseLinesSectionProps) {
	const { value: warpAAmount, setValue: setWarpAAmount } =
		useSynthParam("warpAAmount");
	const { value: warpBAmount, setValue: setWarpBAmount } =
		useSynthParam("warpBAmount");
	const { value: warpAAlgo, setValue: setWarpAAlgo } =
		useSynthParam("warpAAlgo");
	const { value: warpBAlgo, setValue: setWarpBAlgo } =
		useSynthParam("warpBAlgo");
	const { value: algo2A, setValue: setAlgo2A } = useSynthParam("algo2A");
	const { value: algo2B, setValue: setAlgo2B } = useSynthParam("algo2B");
	const { value: algoBlendA, setValue: setAlgoBlendA } =
		useSynthParam("algoBlendA");
	const { value: algoBlendB, setValue: setAlgoBlendB } =
		useSynthParam("algoBlendB");
	const { value: line1Level, setValue: setLine1Level } =
		useSynthParam("line1Level");
	const { value: line2Level, setValue: setLine2Level } =
		useSynthParam("line2Level");
	const { value: lineOctave, setValue: setLineOctave } =
		useSynthParam("lineOctave");
	const { value: line2DetuneOctave, setValue: setLine2DetuneOctave } =
		useSynthParam("line2DetuneOctave");
	const { value: line2DetuneNote, setValue: setLine2DetuneNote } =
		useSynthParam("line2DetuneNote");
	const { value: line2DetuneFine, setValue: setLine2DetuneFine } =
		useSynthParam("line2DetuneFine");
	const { value: line1DcoEnv, setValue: setLine1DcoEnv } =
		useSynthParam("line1DcoEnv");
	const { value: line1DcwEnv, setValue: setLine1DcwEnv } =
		useSynthParam("line1DcwEnv");
	const { value: line1DcaEnv, setValue: setLine1DcaEnv } =
		useSynthParam("line1DcaEnv");
	const { value: line1AlgoControlsA, setValue: setLine1AlgoControlsA } =
		useSynthParam("line1AlgoControlsA");
	const { value: line1AlgoControlsB, setValue: setLine1AlgoControlsB } =
		useSynthParam("line1AlgoControlsB");
	const { value: line1BaseWaveformA, setValue: setLine1BaseWaveformA } =
		useSynthParam("line1BaseWaveformA");
	const { value: line1BaseWaveformB, setValue: setLine1BaseWaveformB } =
		useSynthParam("line1BaseWaveformB");
	const { value: line2DcoEnv, setValue: setLine2DcoEnv } =
		useSynthParam("line2DcoEnv");
	const { value: line2DcwEnv, setValue: setLine2DcwEnv } =
		useSynthParam("line2DcwEnv");
	const { value: line2DcaEnv, setValue: setLine2DcaEnv } =
		useSynthParam("line2DcaEnv");
	const { value: line2AlgoControlsA, setValue: setLine2AlgoControlsA } =
		useSynthParam("line2AlgoControlsA");
	const { value: line2AlgoControlsB, setValue: setLine2AlgoControlsB } =
		useSynthParam("line2AlgoControlsB");
	const { value: line2BaseWaveformA, setValue: setLine2BaseWaveformA } =
		useSynthParam("line2BaseWaveformA");
	const { value: line2BaseWaveformB, setValue: setLine2BaseWaveformB } =
		useSynthParam("line2BaseWaveformB");
	const line1 = {
		warpAmount: warpAAmount as number,
		setWarpAmount: setWarpAAmount,
		algo: warpAAlgo as Algo,
		setAlgo: setWarpAAlgo as (value: Algo) => void,
		algo2: algo2A as Algo | null,
		setAlgo2: setAlgo2A as (value: Algo | null) => void,
		algoBlend: algoBlendA as number,
		setAlgoBlend: setAlgoBlendA,
		level: line1Level as number,
		setLevel: setLine1Level,
		octave: lineOctave as number,
		setOctave: setLineOctave,
		detuneOctave: line2DetuneOctave as number,
		setDetuneOctave: setLine2DetuneOctave,
		detuneNote: line2DetuneNote as number,
		setDetuneNote: setLine2DetuneNote,
		fineDetune: line2DetuneFine as number,
		setFineDetune: setLine2DetuneFine,
		dcoEnv: line1DcoEnv as StepEnvData,
		setDcoEnv: envOverrideHandlers?.onLine1DcoEnvChange ?? setLine1DcoEnv,
		dcwEnv: line1DcwEnv as StepEnvData,
		setDcwEnv: envOverrideHandlers?.onLine1DcwEnvChange ?? setLine1DcwEnv,
		dcaEnv: line1DcaEnv as StepEnvData,
		setDcaEnv: envOverrideHandlers?.onLine1DcaEnvChange ?? setLine1DcaEnv,
		algoControlsA: line1AlgoControlsA as AlgoControlValueV1[],
		setAlgoControlsA: setLine1AlgoControlsA,
		algoControlsB: line1AlgoControlsB as AlgoControlValueV1[],
		setAlgoControlsB: setLine1AlgoControlsB,
		baseWaveformA: line1BaseWaveformA as BaseWaveform,
		setBaseWaveformA: setLine1BaseWaveformA,
		baseWaveformB: line1BaseWaveformB as BaseWaveform,
		setBaseWaveformB: setLine1BaseWaveformB,
	};

	const line2 = {
		warpAmount: warpBAmount as number,
		setWarpAmount: setWarpBAmount,
		algo: warpBAlgo as Algo,
		setAlgo: setWarpBAlgo as (value: Algo) => void,
		algo2: algo2B as Algo | null,
		setAlgo2: setAlgo2B as (value: Algo | null) => void,
		algoBlend: algoBlendB as number,
		setAlgoBlend: setAlgoBlendB,
		level: line2Level as number,
		setLevel: setLine2Level,
		octave: lineOctave as number,
		setOctave: setLineOctave,
		detuneOctave: line2DetuneOctave as number,
		setDetuneOctave: setLine2DetuneOctave,
		detuneNote: line2DetuneNote as number,
		setDetuneNote: setLine2DetuneNote,
		fineDetune: line2DetuneFine as number,
		setFineDetune: setLine2DetuneFine,
		dcoEnv: line2DcoEnv as StepEnvData,
		setDcoEnv: envOverrideHandlers?.onLine2DcoEnvChange ?? setLine2DcoEnv,
		dcwEnv: line2DcwEnv as StepEnvData,
		setDcwEnv: envOverrideHandlers?.onLine2DcwEnvChange ?? setLine2DcwEnv,
		dcaEnv: line2DcaEnv as StepEnvData,
		setDcaEnv: envOverrideHandlers?.onLine2DcaEnvChange ?? setLine2DcaEnv,
		algoControlsA: line2AlgoControlsA as AlgoControlValueV1[],
		setAlgoControlsA: setLine2AlgoControlsA,
		algoControlsB: line2AlgoControlsB as AlgoControlValueV1[],
		setAlgoControlsB: setLine2AlgoControlsB,
		baseWaveformA: line2BaseWaveformA as BaseWaveform,
		setBaseWaveformA: setLine2BaseWaveformA,
		baseWaveformB: line2BaseWaveformB as BaseWaveform,
		setBaseWaveformB: setLine2BaseWaveformB,
	};

	const activeTab = useSynthUiStore((s) => s.phaseLinePanelTab);
	const setActiveTab = useSynthUiStore((s) => s.setPhaseLinePanelTab);
	const { value: lineSelect } = useSynthParam("lineSelect");

	const activeLine: "line1" | "line2" = activeTab.startsWith("line1")
		? "line1"
		: "line2";
	const activeSection: "algos" | "envelopes" = activeTab.endsWith("algos")
		? "algos"
		: "envelopes";
	const activeLineConfig = activeLine === "line1" ? line1 : line2;
	const activeLineLabel = activeLine === "line1" ? "Line 1" : "Line 2";

	const isLineAudible = (line: "line1" | "line2"): boolean => {
		if (lineSelect === "L1+L2'") return true;
		if (lineSelect === "L1" || lineSelect === "L1+L1'") return line === "line1";
		if (lineSelect === "L2") return line === "line2";
		return true;
	};
	const activeLineIsAudible = isLineAudible(activeLine);
	const inaudibleLineSelectLabel = lineSelect as string;

	useEffect(() => {
		onActiveTabChange?.(activeLine);
	}, [activeLine, onActiveTabChange]);

	const panelClassName = joinClasses("h-full min-h-0 flex flex-col", className);
	const leftTabGroups: Array<{
		label: "L1" | "L2";
		color: "red" | "blue";
		tabs: Array<{
			id: PhaseLinePanelTab;
			bottomLabel: string;
		}>;
	}> = [
		{
			label: "L1",
			color: "blue",
			tabs: [
				{ id: "line1-algos", bottomLabel: "WAVE FORM" },
				{ id: "line1-envelopes", bottomLabel: "ENV" },
			],
		},
		{
			label: "L2",
			color: "red",
			tabs: [
				{ id: "line2-algos", bottomLabel: "WAVE FORM" },
				{ id: "line2-envelopes", bottomLabel: "ENV" },
			],
		},
	];

	return (
		<Card variant="panel-slanted" padding="none" className={panelClassName}>
			<div className="cz-collapse-header cz-section-slanted-title shrink-0 justify-center py-0">
				Phase Lines
			</div>
			<div className="flex min-h-0 min-w-0 flex-1 overflow-hidden bg-cz-panel p-2">
				<div className="flex max-h-127 min-h-0 min-w-0 flex-1 items-stretch gap-2">
					<div className="flex w-16 shrink-0 flex-col justify-evenly gap-5 self-stretch">
						{leftTabGroups.map((group) => {
							return (
								<div
									key={group.label}
									className="flex h-full flex-col justify-center gap-4 rounded-lg bg-cz-inset/80 p-1.5 py-3 pb-10"
								>
									<div className="text-center font-bold text-[0.6rem] text-cz-cream tracking-[0.12em]">
										{group.label}
									</div>
									{group.tabs.map((tab) => (
										<CzTabButton
											key={tab.id}
											active={activeTab === tab.id}
											onClick={() => setActiveTab(tab.id)}
											topLabel=""
											bottomLabel={tab.bottomLabel}
											color={group.color}
											showLed
										/>
									))}
								</div>
							);
						})}
					</div>

					<div className="relative min-h-0 min-w-0 flex-1">
						{!activeLineIsAudible && (
							<div className="absolute inset-0 z-30 flex items-center justify-center rounded bg-black/70 backdrop-blur-[5px]">
								<div className="px-3 text-center font-semibold text-cz-cream/80 text-xs tracking-wide">
									{activeLineLabel} is currently inactive in{" "}
									{inaudibleLineSelectLabel} mode
								</div>
							</div>
						)}
						<PerLineWarpBlock
							key={activeLineLabel}
							label={activeLineLabel}
							color={activeLine === "line1" ? "#7f9de4" : "#c45c5c"}
							lineIndex={activeLine === "line1" ? 1 : 2}
							algo={activeLineConfig.algo}
							setAlgo={activeLineConfig.setAlgo}
							algo2={activeLineConfig.algo2}
							setAlgo2={activeLineConfig.setAlgo2}
							algoBlend={activeLineConfig.algoBlend}
							setAlgoBlend={activeLineConfig.setAlgoBlend}
							warpAmount={activeLineConfig.warpAmount}
							setWarpAmount={activeLineConfig.setWarpAmount}
							level={activeLineConfig.level}
							setLevel={activeLineConfig.setLevel}
							octave={activeLineConfig.octave}
							setOctave={activeLineConfig.setOctave}
							detuneOctave={activeLineConfig.detuneOctave}
							setDetuneOctave={activeLineConfig.setDetuneOctave}
							detuneNote={activeLineConfig.detuneNote}
							setDetuneNote={activeLineConfig.setDetuneNote}
							fineDetune={activeLineConfig.fineDetune}
							setFineDetune={activeLineConfig.setFineDetune}
							dcoEnv={activeLineConfig.dcoEnv}
							setDcoEnv={activeLineConfig.setDcoEnv}
							dcwEnv={activeLineConfig.dcwEnv}
							setDcwEnv={activeLineConfig.setDcwEnv}
							dcaEnv={activeLineConfig.dcaEnv}
							setDcaEnv={activeLineConfig.setDcaEnv}
							baseWaveformA={activeLineConfig.baseWaveformA}
							setBaseWaveformA={activeLineConfig.setBaseWaveformA}
							baseWaveformB={activeLineConfig.baseWaveformB}
							setBaseWaveformB={activeLineConfig.setBaseWaveformB}
							algoControlsA={activeLineConfig.algoControlsA}
							setAlgoControlsA={activeLineConfig.setAlgoControlsA}
							algoControlsB={activeLineConfig.algoControlsB}
							setAlgoControlsB={activeLineConfig.setAlgoControlsB}
							activeSection={activeSection}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}
