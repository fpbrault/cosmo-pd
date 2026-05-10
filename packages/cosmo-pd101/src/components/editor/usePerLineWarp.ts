import { useCallback, useEffect, useMemo, useState } from "react";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "@/components/controls/algo/algoControlTypes";
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
import type { EnvMapEntry } from "./EnvelopesSection";
import { getEnvelopeVoiceProgress } from "./perLineWarpUtils";
import type { StepEnvelopeVoiceMarker } from "./StepEnvelopeEditor";

type SectionTab = "algos" | "envelopes";

const ALGO_DEFINITIONS = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];

interface UsePerLineWarpInput {
	label: string;
	color: string;
	algo: PdAlgo;
	setAlgo: (a: PdAlgo) => void;
	algo2: PdAlgo | null;
	setAlgo2: (a: PdAlgo | null) => void;
	algoBlend: number;
	setAlgoBlend: (v: number) => void;
	algoControlsA: AlgoControlValueV1[];
	setAlgoControlsA: (value: AlgoControlValueV1[]) => void;
	algoControlsB: AlgoControlValueV1[];
	setAlgoControlsB: (value: AlgoControlValueV1[]) => void;
	baseWaveformA: BaseWaveform;
	setBaseWaveformA: (v: BaseWaveform) => void;
	baseWaveformB: BaseWaveform;
	setBaseWaveformB: (v: BaseWaveform) => void;
	dcoEnv: StepEnvData;
	setDcoEnv: (e: StepEnvData) => void;
	dcwEnv: StepEnvData;
	setDcwEnv: (e: StepEnvData) => void;
	dcaEnv: StepEnvData;
	setDcaEnv: (e: StepEnvData) => void;
	lineIndex?: LineIndex;
	activeSection?: SectionTab;
}

interface UsePerLineWarpOutput {
	algoBEnabled: boolean;
	voiceMarkerTick: number;
	envMap: Record<EnvTab, EnvMapEntry>;
	activeVoiceMarkers: StepEnvelopeVoiceMarker[];
	handleAlgoChange: (nextAlgo: PdAlgo) => void;
	handleAlgo2Change: (nextAlgo: PdAlgo) => void;
	baseWaveEnabledA: boolean;
	baseWaveEnabledB: boolean;
	activeAlgoDefinition: AlgoDefinitionV1 | undefined;
	activeAlgoDefinitionB: AlgoDefinitionV1 | undefined;
	algoDefinitionControlsA: AlgoControlRuntime[];
	algoDefinitionControlsB: AlgoControlRuntime[];
	algoParamSlotIndex: Record<string, number>;
	algoParamSlotIndexB: Record<string, number>;
	controlBindingsA: Record<string, AlgoControlBinding>;
	controlBindingsB: Record<string, AlgoControlBinding>;
	getAlgoControlValueA: (id: string, fallback: number) => number;
	setAlgoControlValueA: (id: string, value: number) => void;
	getActiveSelectOptionA: (control: AlgoControlRuntime) => AlgoControlOptionRuntime | null;
	applyOptionAssignmentsA: (option: AlgoControlOptionRuntime) => void;
	getAlgoControlValueB: (id: string, fallback: number) => number;
	setAlgoControlValueB: (id: string, value: number) => void;
	getActiveSelectOptionB: (control: AlgoControlRuntime) => AlgoControlOptionRuntime | null;
	applyOptionAssignmentsB: (option: AlgoControlOptionRuntime) => void;
}

export function usePerLineWarp(input: UsePerLineWarpInput): UsePerLineWarpOutput {
	const {
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
		lineIndex = 1,
		activeSection,
	} = input;

	const activeEnvTab = useSynthUiStore((s) => s.activeEnvTab);
	const synthController = useOptionalSynthController();
	const algoBEnabled = algoBlend > 0.001;
	const [voiceMarkerTick, setVoiceMarkerTick] = useState(0);

	useEffect(() => {
		if (activeSection !== "envelopes") return;
		const id = setInterval(() => setVoiceMarkerTick((t) => t + 1), 16);
		return () => clearInterval(id);
	}, [activeSection]);

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <For updates>
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

	return {
		algoBEnabled,
		voiceMarkerTick,
		envMap,
		activeVoiceMarkers,
		handleAlgoChange,
		handleAlgo2Change,
		baseWaveEnabledA,
		baseWaveEnabledB,
		activeAlgoDefinition,
		activeAlgoDefinitionB,
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
	};
}
