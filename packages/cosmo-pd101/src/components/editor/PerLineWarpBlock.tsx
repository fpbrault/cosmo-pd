import { memo } from "react";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import AlgoSectionCard from "@/components/editor/AlgoSectionCard";
import { SynthSingleCycleDisplay } from "@/components/editor/SingleCycleDisplay";
import Card from "@/components/primitives/Card";
import type {
	AlgoControlValueV1,
	BaseWaveform,
	StepEnvData,
} from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { PD_ALGOS } from "@/lib/synth/pdAlgorithms";
import { BaseWaveSelector } from "./BaseWaveSelector";
import { EnvelopesSection } from "./EnvelopesSection";
import PerLineParametersCard from "./PerLineParametersCard";
import { formatAlgoBlendReadout } from "./perLineWarpUtils";
import { usePerLineWarp } from "./usePerLineWarp";

interface PerLineWarpBlockProps {
	label: string;
	color: string;
	algo: PdAlgo;
	setAlgo: (a: PdAlgo) => void;
	algo2: PdAlgo | null;
	setAlgo2: (a: PdAlgo | null) => void;
	algoBlend: number;
	setAlgoBlend: (v: number) => void;
	warpAmount: number;
	setWarpAmount: (v: number) => void;
	level: number;
	setLevel: (v: number) => void;
	octave: number;
	setOctave: (v: number) => void;
	detuneOctave?: number;
	setDetuneOctave?: (v: number) => void;
	detuneNote?: number;
	setDetuneNote?: (v: number) => void;
	fineDetune?: number;
	setFineDetune?: (v: number) => void;
	dcoEnv: StepEnvData;
	setDcoEnv: (e: StepEnvData) => void;
	dcwEnv: StepEnvData;
	setDcwEnv: (e: StepEnvData) => void;
	dcaEnv: StepEnvData;
	setDcaEnv: (e: StepEnvData) => void;
	baseWaveformA: BaseWaveform;
	setBaseWaveformA: (v: BaseWaveform) => void;
	baseWaveformB: BaseWaveform;
	setBaseWaveformB: (v: BaseWaveform) => void;
	algoControlsA: AlgoControlValueV1[];
	setAlgoControlsA: (value: AlgoControlValueV1[]) => void;
	algoControlsB: AlgoControlValueV1[];
	setAlgoControlsB: (value: AlgoControlValueV1[]) => void;
	/** 1 or 2, used to resolve mod-matrix destinations. Defaults to 1. */
	lineIndex?: LineIndex;
	activeSection?: "algos" | "envelopes";
}

const PerLineWarpBlock = memo(function PerLineWarpBlock({
	label,
	color,
	algo,
	setAlgo,
	algo2,
	setAlgo2,
	algoBlend,
	setAlgoBlend,
	warpAmount,
	setWarpAmount,
	level,
	setLevel,
	octave,
	setOctave,
	detuneOctave,
	setDetuneOctave,
	detuneNote,
	setDetuneNote,
	fineDetune,
	setFineDetune,
	dcoEnv,
	setDcoEnv,
	dcwEnv,
	setDcwEnv,
	dcaEnv,
	setDcaEnv,
	baseWaveformA,
	setBaseWaveformA,
	baseWaveformB,
	setBaseWaveformB,
	algoControlsA = [],
	setAlgoControlsA = () => {},
	algoControlsB = [],
	setAlgoControlsB = () => {},
	lineIndex = 1,
	activeSection,
}: PerLineWarpBlockProps) {
	const {
		algoBEnabled,
		envMap,
		activeVoiceMarkers,
		handleAlgoChange,
		handleAlgo2Change,
		baseWaveEnabledA,
		baseWaveEnabledB,
		algoDefinitionControlsA,
		algoDefinitionControlsB,
		algoParamSlotIndex,
		algoParamSlotIndexB,
		controlBindingsA,
		controlBindingsB,
		getAlgoControlValueA,
		setAlgoControlValueA,
		getActiveSelectOptionA,
		applyOptionAssignmentsA,
		getAlgoControlValueB,
		setAlgoControlValueB,
		getActiveSelectOptionB,
		applyOptionAssignmentsB,
	} = usePerLineWarp({
		label,
		color,
		algo,
		setAlgo,
		algo2,
		setAlgo2,
		algoBlend,
		setAlgoBlend,
		algoControlsA,
		setAlgoControlsA,
		algoControlsB,
		setAlgoControlsB,
		baseWaveformA,
		setBaseWaveformA,
		baseWaveformB,
		setBaseWaveformB,
		dcoEnv,
		setDcoEnv,
		dcwEnv,
		setDcwEnv,
		dcaEnv,
		setDcaEnv,
		lineIndex,
		activeSection,
	});

	return (
		<>
			{activeSection === "algos" ? (
				<div className="grid h-full min-h-0 flex-1 grid-cols-3 gap-4">
					<div className="flex min-h-0 flex-1 flex-col gap-0">
						<div
							className="mb-1 bg-cz-inset px-1.5 py-0.5 font-semibold text-3xs uppercase tracking-[0.24em]"
							style={{ color }}
						>
							Algo A
						</div>
						<div className="flex min-h-0 flex-1 flex-col gap-2">
							<AlgoSectionCard
								sectionId="a"
								value={algo}
								onChange={handleAlgoChange}
								controls={algoDefinitionControlsA}
								controlBindings={controlBindingsA}
								lineIndex={lineIndex}
								algoParamSlotIndex={algoParamSlotIndex}
								getAlgoControlValue={getAlgoControlValueA}
								setAlgoControlValue={setAlgoControlValueA}
								getActiveSelectOption={getActiveSelectOptionA}
								applyOptionAssignments={applyOptionAssignmentsA}
								color={color}
							/>
							<BaseWaveSelector
								title="Base Wave A"
								value={baseWaveformA}
								onChange={setBaseWaveformA}
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
						<PerLineParametersCard
							color={color}
							warpAmount={warpAmount}
							setWarpAmount={setWarpAmount}
							level={level}
							setLevel={setLevel}
							octave={octave}
							setOctave={setOctave}
							detuneOctave={detuneOctave}
							setDetuneOctave={setDetuneOctave}
							detuneNote={detuneNote}
							setDetuneNote={setDetuneNote}
							fineDetune={fineDetune}
							setFineDetune={setFineDetune}
							lineIndex={lineIndex}
						/>

						<div className="mt-2 grow rounded-none bg-cz-surface/50 pb-1.5">
							<SynthParamKnob
								paramKey={lineIndex === 2 ? "algoBlendB" : "algoBlendA"}
								label="Blend"
								labelClassName="text-lg font-bold tracking-[0.3em] text-base-content/75"
								value={algoBlend}
								size={100}
								variant="light"
								onChange={setAlgoBlend}
								color={color}
								valueFormatter={formatAlgoBlendReadout}
							/>
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
							<AlgoSectionCard
								sectionId="b"
								value={algo2 ?? PD_ALGOS[0].value}
								onChange={handleAlgo2Change}
								disabled={!algoBEnabled}
								controls={algoDefinitionControlsB}
								controlBindings={controlBindingsB}
								lineIndex={lineIndex}
								algoParamSlotIndex={algoParamSlotIndexB}
								getAlgoControlValue={getAlgoControlValueB}
								setAlgoControlValue={setAlgoControlValueB}
								getActiveSelectOption={getActiveSelectOptionB}
								applyOptionAssignments={applyOptionAssignmentsB}
								color={color}
							/>
							<BaseWaveSelector
								title="Base Wave B"
								value={baseWaveformB}
								onChange={setBaseWaveformB}
								disabled={!baseWaveEnabledB}
								color={color}
							/>
						</div>
					</div>
				</div>
			) : (
				<EnvelopesSection
					envMap={envMap}
					voiceMarkers={activeVoiceMarkers}
					lineIndex={lineIndex}
					lineColor={color}
				/>
			)}
		</>
	);
});

export default PerLineWarpBlock;
