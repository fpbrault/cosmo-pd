import { memo, useCallback, useEffect } from "react";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "@/components/controls/algo/algoControlTypes";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import AlgoSectionCard from "@/components/editor/AlgoSectionCard";
import { SynthSingleCycleDisplay } from "@/components/editor/SingleCycleDisplay";
import Card from "@/components/primitives/Card";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { buildDefaultAlgoControls } from "@/lib/synth/algoRef";
import type {
	AlgoControlValueV1,
	AlgoDefinitionV1,
	BaseWaveform,
	StepEnvData,
} from "@/lib/synth/bindings/synth";
import { ALGO_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import {
	algoUsesBaseWaveform,
	getPdAlgoDef,
	PD_ALGOS,
} from "@/lib/synth/pdAlgorithms";
import { BaseWaveSelector } from "./BaseWaveSelector";
import type { EnvMapEntry } from "./EnvelopesSection";
import { EnvelopesSection } from "./EnvelopesSection";
import PerLineParametersCard from "./PerLineParametersCard";
import type { StepEnvelopeVoiceMarker } from "./StepEnvelopeEditor";

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
	fineDetune: number;
	setFineDetune: (v: number) => void;
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
	activeSection?: SectionTab;
}

type SectionTab = "algos" | "envelopes";

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function formatAlgoBlendReadout(value: number) {
	const blendB = Math.round(clamp(value, 0, 1) * 100);
	const blendA = 100 - blendB;
	return `A ${blendA}% | B ${blendB}%`;
}

function getEnvelopeVoiceProgress(
	env: StepEnvData,
	step: number,
	value: number,
) {
	const stepIndex = clamp(Math.round(step), 0, Math.max(0, env.stepCount - 1));
	const currentStep = env.steps[stepIndex];
	if (!currentStep) {
		return undefined;
	}

	const isEndStep = stepIndex === env.stepCount - 1;
	const targetLevel = isEndStep ? 0 : currentStep.level / 99;
	const previousStep = stepIndex > 0 ? env.steps[stepIndex - 1] : null;
	const previousLevel = previousStep ? previousStep.level / 99 : 0;
	const distance = targetLevel - previousLevel;
	if (Math.abs(distance) < 0.0001) {
		return undefined;
	}

	return clamp((value - previousLevel) / distance, 0, 1);
}

export const PerLineWarpBlock = memo(function PerLineWarpBlock({
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
	activeSection: activeSectionProp,
}: PerLineWarpBlockProps) {
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const synthController = useOptionalSynthController();
	const activeSection = activeSectionProp;
	const algoBEnabled = algoBlend > 0.001;

	// Auto-set algo2 to first algo when blend is raised from 0 with nothing selected
	useEffect(() => {
		if (algoBlend > 0 && algo2 == null) {
			setAlgo2(PD_ALGOS[0].value);
		}
	}, [algoBlend, algo2, setAlgo2]);

	const envMap: Record<EnvTab, EnvMapEntry> = {
		dco: {
			title: `${label} DCO`,
			env: dcoEnv,
			setEnv: setDcoEnv,
			envColor: "#9cb937",
		},
		dcw: {
			title: `${label} DCW`,
			env: dcwEnv,
			setEnv: setDcwEnv,
			envColor: "#60a5fa",
		},
		dca: {
			title: `${label} DCA`,
			env: dcaEnv,
			setEnv: setDcaEnv,
			envColor: "#f97316",
		},
	};

	const activeEnv = envMap[activeEnvTab];
	const liveVoiceStates = synthController?.getLiveVoiceStates() ?? [];
	const activeVoiceMarkers: StepEnvelopeVoiceMarker[] = liveVoiceStates
		.filter((voice) => voice.active)
		.map((voice) => {
			const lineState = lineIndex === 1 ? voice.line1 : voice.line2;
			const envState = lineState[activeEnvTab];
			return {
				id: voice.index,
				step: envState.step,
				progress: getEnvelopeVoiceProgress(
					activeEnv.env,
					envState.step,
					envState.value,
				),
				releasing: envState.releasing || voice.isReleasing,
				color: voice.isReleasing ? "#f59e0b" : "#f8fafc",
			};
		});

	const handleAlgoChange = useCallback(
		(nextAlgo: PdAlgo) => {
			setAlgo(nextAlgo);
			const definitions = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];
			const nextDefinition = definitions.find((entry) => entry.id === nextAlgo);
			if (nextDefinition?.defaultBaseWaveform) {
				setBaseWaveformA(nextDefinition.defaultBaseWaveform);
			}
			setAlgoControlsA(buildDefaultAlgoControls(nextAlgo));
		},
		[setAlgo, setAlgoControlsA, setBaseWaveformA],
	);

	const handleAlgo2Change = useCallback(
		(nextAlgo: PdAlgo) => {
			setAlgo2(nextAlgo);
			const definitions = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];
			const nextDefinition = definitions.find((entry) => entry.id === nextAlgo);
			if (nextDefinition?.defaultBaseWaveform) {
				setBaseWaveformB(nextDefinition.defaultBaseWaveform);
			}
			setAlgoControlsB(buildDefaultAlgoControls(nextAlgo));
		},
		[setAlgo2, setAlgoControlsB, setBaseWaveformB],
	);

	const algoDefinitions = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];
	const baseWaveEnabledA = algoUsesBaseWaveform(algo);
	const baseWaveEnabledB =
		algoBEnabled && algo2 != null && algoUsesBaseWaveform(algo2);
	const activeAlgoDefinition = algoDefinitions.find(
		(entry) => entry.id === algo,
	);
	const activeAlgoDefinitionB = algoDefinitions.find(
		(entry) => entry.id === (algo2 ?? PD_ALGOS[0].value),
	);
	const algoDefinitionControlsA = activeAlgoDefinition?.controls ?? [];
	const algoDefinitionControlsB = activeAlgoDefinitionB?.controls ?? [];

	// Map each "number"-kind control to a 1-based slot index for ModDestination
	// (line1AlgoParam1…8 / line2AlgoParam1…8). Max 8 slots per line.
	// Algo A takes slots 1..N, Algo B continues from N+1..8.
	const algoParamSlotIndex: Record<string, number> = {};
	let slotCounter = 1;
	for (const ctrl of algoDefinitionControlsA) {
		if ((ctrl.kind ?? "number") === "number") {
			if (slotCounter <= 8) {
				algoParamSlotIndex[ctrl.id] = slotCounter++;
			}
		}
	}
	const algoParamSlotIndexB: Record<string, number> = {};
	for (const ctrl of algoDefinitionControlsB) {
		if ((ctrl.kind ?? "number") === "number") {
			if (slotCounter <= 8) {
				algoParamSlotIndexB[ctrl.id] = slotCounter++;
			}
		}
	}

	const getAlgoControlValue = (
		entries: AlgoControlValueV1[],
		id: string,
		fallback: number,
	) => {
		const existing = entries.find((entry) => entry.id === id);
		return existing ? existing.value : fallback;
	};

	const upsertAlgoControlValue = (
		entries: AlgoControlValueV1[],
		id: string,
		value: number,
	) => {
		const nextValue = Number.isFinite(value) ? value : 0;
		const index = entries.findIndex((entry) => entry.id === id);
		if (index >= 0) {
			const next = [...entries];
			next[index] = { ...next[index], value: nextValue };
			return next;
		}
		return [...entries, { id, value: nextValue }];
	};

	const setAlgoControlValue = (
		entries: AlgoControlValueV1[],
		setEntries: (value: AlgoControlValueV1[]) => void,
		id: string,
		value: number,
	) => {
		setEntries(upsertAlgoControlValue(entries, id, value));
	};

	const applyOptionAssignments = (
		entries: AlgoControlValueV1[],
		setEntries: (value: AlgoControlValueV1[]) => void,
		option: AlgoControlOptionRuntime,
	) => {
		let nextEntries = entries;
		for (const assignment of option.set) {
			nextEntries = upsertAlgoControlValue(
				nextEntries,
				assignment.controlId,
				assignment.value,
			);
		}
		setEntries(nextEntries);
	};

	const createControlBindings = (
		controls: AlgoControlRuntime[],
		entries: AlgoControlValueV1[],
		setEntries: (value: AlgoControlValueV1[]) => void,
	): Record<string, AlgoControlBinding> =>
		Object.fromEntries(
			controls.map((control) => {
				const controlKind = control.kind ?? "number";
				if (controlKind === "select") {
					return [
						control.id,
						{
							getNumber: () =>
								getAlgoControlValue(entries, control.id, control.default ?? 0),
							setNumber: (value: number) =>
								setAlgoControlValue(entries, setEntries, control.id, value),
						} satisfies AlgoControlBinding,
					];
				}

				if (controlKind === "toggle") {
					return [
						control.id,
						{
							getToggle: () =>
								getAlgoControlValue(
									entries,
									control.id,
									control.defaultToggle ? 1 : 0,
								) >= 0.5,
							setToggle: (value: boolean) =>
								setAlgoControlValue(
									entries,
									setEntries,
									control.id,
									value ? 1 : 0,
								),
						} satisfies AlgoControlBinding,
					];
				}

				return [control.id, {} satisfies AlgoControlBinding];
			}),
		);

	const controlBindingsA = createControlBindings(
		algoDefinitionControlsA,
		algoControlsA,
		setAlgoControlsA,
	);

	const controlBindingsB = createControlBindings(
		algoDefinitionControlsB,
		algoControlsB,
		setAlgoControlsB,
	);

	const getActiveSelectOption = (
		entries: AlgoControlValueV1[],
		control: AlgoControlRuntime,
		localBindings: Record<string, AlgoControlBinding>,
	) => {
		const options = control.options ?? [];

		if (options.some((option) => option.set.length > 0)) {
			return (
				options.find((option) =>
					option.set.every((assignment) => {
						const currentValue =
							localBindings[assignment.controlId]?.getNumber?.() ??
							getAlgoControlValue(entries, assignment.controlId, Number.NaN);
						if (!Number.isFinite(currentValue)) {
							return false;
						}
						return Math.round(currentValue) === Math.round(assignment.value);
					}),
				) ?? null
			);
		}

		const binding = localBindings[control.id];
		if (!binding) {
			return null;
		}

		const currentIndex = binding.getNumber?.();
		const dynamicValue = getAlgoControlValue(
			entries,
			control.id,
			control.default ?? 0,
		);
		const selectedIndex = currentIndex ?? dynamicValue;
		if (selectedIndex === undefined) {
			return null;
		}

		return options[Math.round(selectedIndex)] ?? null;
	};

	return (
		<>
			{activeSection === "algos" ? (
				<div className="flex-1 grid grid-cols-3 min-h-0 gap-4">
					<div className="min-h-0 flex-1 flex flex-col gap-2">
						<BaseWaveSelector
							title="Base Wave A"
							value={baseWaveformA}
							onChange={setBaseWaveformA}
							disabled={!baseWaveEnabledA}
						/>
						<AlgoSectionCard
							title="Algo A"
							algoLabel={getPdAlgoDef(algo)?.label}
							value={algo}
							onChange={handleAlgoChange}
							controls={algoDefinitionControlsA}
							controlBindings={controlBindingsA}
							lineIndex={lineIndex}
							algoParamSlotIndex={algoParamSlotIndex}
							getAlgoControlValue={(id, fallback) =>
								getAlgoControlValue(algoControlsA, id, fallback)
							}
							setAlgoControlValue={(id, value) =>
								setAlgoControlValue(algoControlsA, setAlgoControlsA, id, value)
							}
							getActiveSelectOption={(control) =>
								getActiveSelectOption(algoControlsA, control, controlBindingsA)
							}
							applyOptionAssignments={(option) =>
								applyOptionAssignments(algoControlsA, setAlgoControlsA, option)
							}
						/>
					</div>
					<div className="flex min-h-0 flex-col gap-4">
						<Card
							variant="subtle"
							className="flex flex-col items-center justify-center"
						>
							<SynthParamKnob
								paramKey={lineIndex === 2 ? "algoBlendB" : "algoBlendA"}
								label="Blend"
								labelClassName="text-lg font-bold tracking-[0.3em] text-base-content/75"
								value={algoBlend}
								size={96}
								onChange={setAlgoBlend}
								color="#7f9de4"
								valueFormatter={formatAlgoBlendReadout}
							/>
						</Card>
						<Card
							variant="subtle"
							padding="none"
							className="flex flex-col overflow-hidden"
						>
							<div className="px-3 pt-2 pb-1 text-3xs uppercase tracking-[0.24em] text-cz-cream">
								Single Cycle
							</div>
							<SynthSingleCycleDisplay width={200} height={64} />
						</Card>
						<PerLineParametersCard
							color={color}
							warpAmount={warpAmount}
							setWarpAmount={setWarpAmount}
							level={level}
							setLevel={setLevel}
							octave={octave}
							setOctave={setOctave}
							fineDetune={fineDetune}
							setFineDetune={setFineDetune}
							lineIndex={lineIndex}
						/>
					</div>
					<div className="min-h-0 flex-1 flex flex-col gap-2">
						<BaseWaveSelector
							title="Base Wave B"
							value={baseWaveformB}
							onChange={setBaseWaveformB}
							disabled={!baseWaveEnabledB}
						/>
						<AlgoSectionCard
							title="Algo B"
							algoLabel={algo2 ? getPdAlgoDef(algo2)?.label : undefined}
							value={algo2 ?? PD_ALGOS[0].value}
							onChange={handleAlgo2Change}
							disabled={!algoBEnabled}
							controls={algoDefinitionControlsB}
							controlBindings={controlBindingsB}
							lineIndex={lineIndex}
							algoParamSlotIndex={algoParamSlotIndexB}
							getAlgoControlValue={(id, fallback) =>
								getAlgoControlValue(algoControlsB, id, fallback)
							}
							setAlgoControlValue={(id, value) =>
								setAlgoControlValue(algoControlsB, setAlgoControlsB, id, value)
							}
							getActiveSelectOption={(control) =>
								getActiveSelectOption(algoControlsB, control, controlBindingsB)
							}
							applyOptionAssignments={(option) =>
								applyOptionAssignments(algoControlsB, setAlgoControlsB, option)
							}
						/>
					</div>
				</div>
			) : (
				<EnvelopesSection
					envMap={envMap}
					voiceMarkers={activeVoiceMarkers}
					lineIndex={lineIndex}
				/>
			)}
		</>
	);
});

export default PerLineWarpBlock;
