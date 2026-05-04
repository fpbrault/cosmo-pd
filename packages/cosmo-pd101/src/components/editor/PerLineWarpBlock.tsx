import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import { algoUsesBaseWaveform, PD_ALGOS } from "@/lib/synth/pdAlgorithms";
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
	activeSection?: SectionTab;
}

type SectionTab = "algos" | "envelopes";

const ALGO_DEFINITIONS = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];

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
	activeSection: activeSectionProp,
}: PerLineWarpBlockProps) {
	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const synthController = useOptionalSynthController();
	const activeSection = activeSectionProp;
	const algoBEnabled = algoBlend > 0.001;
	const [voiceMarkerTick, setVoiceMarkerTick] = useState(0);

	useEffect(() => {
		if (activeSection !== "envelopes") return;
		const id = setInterval(() => setVoiceMarkerTick((t) => t + 1), 32);
		return () => clearInterval(id);
	}, [activeSection]);

	// Auto-set algo2 to first algo when blend is raised from 0 with nothing selected
	useEffect(() => {
		if (algoBlend > 0 && algo2 == null) {
			setAlgo2(PD_ALGOS[0].value);
		}
	}, [algoBlend, algo2, setAlgo2]);

	const envMap = useMemo<Record<EnvTab, EnvMapEntry>>(
		() => ({
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
		}),
		[label, dcoEnv, setDcoEnv, dcwEnv, setDcwEnv, dcaEnv, setDcaEnv],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Necessary for envelope voice markers>
	const activeVoiceMarkers = useMemo<StepEnvelopeVoiceMarker[]>(() => {
		if (activeSection !== "envelopes") {
			return [];
		}

		const activeEnv = envMap[activeEnvTab];
		const liveVoiceStates = synthController?.getLiveVoiceStates() ?? [];
		return liveVoiceStates
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
	}, [
		activeSection,
		activeEnvTab,
		envMap,
		lineIndex,
		synthController,
		voiceMarkerTick,
	]);

	const handleAlgoChange = useCallback(
		(nextAlgo: PdAlgo) => {
			setAlgo(nextAlgo);
			const nextDefinition = ALGO_DEFINITIONS.find(
				(entry) => entry.id === nextAlgo,
			);
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
			const nextDefinition = ALGO_DEFINITIONS.find(
				(entry) => entry.id === nextAlgo,
			);
			if (nextDefinition?.defaultBaseWaveform) {
				setBaseWaveformB(nextDefinition.defaultBaseWaveform);
			}
			setAlgoControlsB(buildDefaultAlgoControls(nextAlgo));
		},
		[setAlgo2, setAlgoControlsB, setBaseWaveformB],
	);

	const baseWaveEnabledA = algoUsesBaseWaveform(algo);
	const baseWaveEnabledB =
		algoBEnabled && algo2 != null && algoUsesBaseWaveform(algo2);
	const activeAlgoDefinition = useMemo(
		() => ALGO_DEFINITIONS.find((entry) => entry.id === algo),
		[algo],
	);
	const activeAlgoDefinitionB = useMemo(
		() =>
			ALGO_DEFINITIONS.find(
				(entry) => entry.id === (algo2 ?? PD_ALGOS[0].value),
			),
		[algo2],
	);
	const algoDefinitionControlsA = activeAlgoDefinition?.controls ?? [];
	const algoDefinitionControlsB = activeAlgoDefinitionB?.controls ?? [];

	// Map each "number"-kind control to a 1-based slot index for ModDestination
	// (line1AlgoParam1…8 / line2AlgoParam1…8). Max 8 slots per line.
	// Algo A takes slots 1..N, Algo B continues from N+1..8.
	const { algoParamSlotIndex, algoParamSlotIndexB } = useMemo(() => {
		const nextSlotIndexA: Record<string, number> = {};
		let slotCounter = 1;
		for (const ctrl of algoDefinitionControlsA) {
			if ((ctrl.kind ?? "number") === "number" && slotCounter <= 8) {
				nextSlotIndexA[ctrl.id] = slotCounter++;
			}
		}

		const nextSlotIndexB: Record<string, number> = {};
		for (const ctrl of algoDefinitionControlsB) {
			if ((ctrl.kind ?? "number") === "number" && slotCounter <= 8) {
				nextSlotIndexB[ctrl.id] = slotCounter++;
			}
		}

		return {
			algoParamSlotIndex: nextSlotIndexA,
			algoParamSlotIndexB: nextSlotIndexB,
		};
	}, [algoDefinitionControlsA, algoDefinitionControlsB]);

	const getAlgoControlValue = useCallback(
		(entries: AlgoControlValueV1[], id: string, fallback: number) => {
			const existing = entries.find((entry) => entry.id === id);
			return existing ? existing.value : fallback;
		},
		[],
	);

	const upsertAlgoControlValue = useCallback(
		(entries: AlgoControlValueV1[], id: string, value: number) => {
			const nextValue = Number.isFinite(value) ? value : 0;
			const index = entries.findIndex((entry) => entry.id === id);
			if (index >= 0) {
				const next = [...entries];
				next[index] = { ...next[index], value: nextValue };
				return next;
			}
			return [...entries, { id, value: nextValue }];
		},
		[],
	);

	const setAlgoControlValue = useCallback(
		(
			entries: AlgoControlValueV1[],
			setEntries: (value: AlgoControlValueV1[]) => void,
			id: string,
			value: number,
		) => {
			setEntries(upsertAlgoControlValue(entries, id, value));
		},
		[upsertAlgoControlValue],
	);

	const applyOptionAssignments = useCallback(
		(
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
		},
		[upsertAlgoControlValue],
	);

	const createControlBindings = useCallback(
		(
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
									getAlgoControlValue(
										entries,
										control.id,
										control.default ?? 0,
									),
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
			),
		[getAlgoControlValue, setAlgoControlValue],
	);

	const controlBindingsA = useMemo(
		() =>
			createControlBindings(
				algoDefinitionControlsA,
				algoControlsA,
				setAlgoControlsA,
			),
		[
			algoControlsA,
			algoDefinitionControlsA,
			createControlBindings,
			setAlgoControlsA,
		],
	);

	const controlBindingsB = useMemo(
		() =>
			createControlBindings(
				algoDefinitionControlsB,
				algoControlsB,
				setAlgoControlsB,
			),
		[
			algoControlsB,
			algoDefinitionControlsB,
			createControlBindings,
			setAlgoControlsB,
		],
	);

	const getActiveSelectOption = useCallback(
		(
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
		},
		[getAlgoControlValue],
	);

	const getAlgoControlValueA = useCallback(
		(id: string, fallback: number) =>
			getAlgoControlValue(algoControlsA, id, fallback),
		[algoControlsA, getAlgoControlValue],
	);
	const setAlgoControlValueA = useCallback(
		(id: string, value: number) =>
			setAlgoControlValue(algoControlsA, setAlgoControlsA, id, value),
		[algoControlsA, setAlgoControlValue, setAlgoControlsA],
	);
	const getActiveSelectOptionA = useCallback(
		(control: AlgoControlRuntime) =>
			getActiveSelectOption(algoControlsA, control, controlBindingsA),
		[algoControlsA, controlBindingsA, getActiveSelectOption],
	);
	const applyOptionAssignmentsA = useCallback(
		(option: AlgoControlOptionRuntime) =>
			applyOptionAssignments(algoControlsA, setAlgoControlsA, option),
		[algoControlsA, applyOptionAssignments, setAlgoControlsA],
	);

	const getAlgoControlValueB = useCallback(
		(id: string, fallback: number) =>
			getAlgoControlValue(algoControlsB, id, fallback),
		[algoControlsB, getAlgoControlValue],
	);
	const setAlgoControlValueB = useCallback(
		(id: string, value: number) =>
			setAlgoControlValue(algoControlsB, setAlgoControlsB, id, value),
		[algoControlsB, setAlgoControlValue, setAlgoControlsB],
	);
	const getActiveSelectOptionB = useCallback(
		(control: AlgoControlRuntime) =>
			getActiveSelectOption(algoControlsB, control, controlBindingsB),
		[algoControlsB, controlBindingsB, getActiveSelectOption],
	);
	const applyOptionAssignmentsB = useCallback(
		(option: AlgoControlOptionRuntime) =>
			applyOptionAssignments(algoControlsB, setAlgoControlsB, option),
		[algoControlsB, applyOptionAssignments, setAlgoControlsB],
	);

	return (
		<>
			{activeSection === "algos" ? (
				<div className="flex-1 grid grid-cols-3 min-h-0 gap-4">
					<div className="min-h-0 flex-1 flex flex-col gap-0">
						<div
							className="text-3xs uppercase tracking-[0.24em] font-semibold mb-1 px-1.5 py-0.5 bg-cz-inset"
							style={{ color }}
						>
							Algo A
						</div>
						<div className="flex flex-col gap-2 flex-1 min-h-0">
							<BaseWaveSelector
								title="Base Wave A"
								value={baseWaveformA}
								onChange={setBaseWaveformA}
								disabled={!baseWaveEnabledA}
								color={color}
							/>
							<AlgoSectionCard
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
						</div>
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
								size={144}
								variant="light"
								onChange={setAlgoBlend}
								color={color}
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
							<SynthSingleCycleDisplay
								width={200}
								height={64}
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
					</div>
					<div className="min-h-0 flex-1 flex flex-col gap-0">
						<div
							className="text-3xs uppercase tracking-[0.24em] font-semibold mb-1 px-1.5 py-0.5 bg-cz-inset"
							style={{ color }}
						>
							Algo B
						</div>
						<div className="flex flex-col gap-2 flex-1 min-h-0">
							<BaseWaveSelector
								title="Base Wave B"
								value={baseWaveformB}
								onChange={setBaseWaveformB}
								disabled={!baseWaveEnabledB}
								color={color}
							/>
							<AlgoSectionCard
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
