import { useCallback, useEffect, useMemo } from "react";
import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
} from "@/components/controls/algo/algoControlTypes";
import { buildDefaultAlgoControls } from "@/lib/synth/algoRef";
import { algoUsesBaseWaveform, PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import type {
	AlgoControlValueV1,
	AlgoDefinitionV1,
} from "@/lib/synth/bindings/synth";
import { ALGO_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import type {
	AlgoSlotViewModel,
	PhaseLineAlgoModel,
} from "../phase-lines/phaseLineTypes";

const ALGO_DEFINITIONS = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];

type PhaseLineAlgorithms = {
	algoBEnabled: boolean;
	baseWaveEnabledA: boolean;
	baseWaveEnabledB: boolean;
	slotA: AlgoSlotViewModel;
	slotB: AlgoSlotViewModel;
};

export function assignAlgoControlSlots(
	controlsA: AlgoControlRuntime[],
	controlsB: AlgoControlRuntime[],
): {
	slotIndexA: Record<string, number>;
	slotIndexB: Record<string, number>;
} {
	const slotIndexA: Record<string, number> = {};
	let slotCounter = 1;
	for (const control of controlsA) {
		if ((control.kind ?? "number") === "number" && slotCounter <= 8) {
			slotIndexA[control.id] = slotCounter++;
		}
	}

	const slotIndexB: Record<string, number> = {};
	for (const control of controlsB) {
		if ((control.kind ?? "number") === "number" && slotCounter <= 8) {
			slotIndexB[control.id] = slotCounter++;
		}
	}

	return { slotIndexA, slotIndexB };
}

export function usePhaseLineAlgorithms(
	algo: PhaseLineAlgoModel,
): PhaseLineAlgorithms {
	const algoBEnabled = algo.blend > 0.001;

	useEffect(() => {
		if (algo.blend > 0 && algo.algoB == null) {
			algo.setAlgoB(PD_ALGOS[0].value);
		}
	}, [algo]);

	const handleAlgoChangeA = useCallback(
		(nextAlgo: PdAlgo) => {
			algo.setAlgoA(nextAlgo);
			const nextDefinition = ALGO_DEFINITIONS.find(
				(entry) => entry.id === nextAlgo,
			);
			if (nextDefinition?.defaultBaseWaveform) {
				algo.setBaseWaveformA(nextDefinition.defaultBaseWaveform);
			}
			algo.setControlsA(buildDefaultAlgoControls(nextAlgo));
		},
		[algo],
	);

	const handleAlgoChangeB = useCallback(
		(nextAlgo: PdAlgo) => {
			algo.setAlgoB(nextAlgo);
			const nextDefinition = ALGO_DEFINITIONS.find(
				(entry) => entry.id === nextAlgo,
			);
			if (nextDefinition?.defaultBaseWaveform) {
				algo.setBaseWaveformB(nextDefinition.defaultBaseWaveform);
			}
			algo.setControlsB(buildDefaultAlgoControls(nextAlgo));
		},
		[algo],
	);

	const activeAlgoDefinitionA = useMemo(
		() => ALGO_DEFINITIONS.find((entry) => entry.id === algo.algoA),
		[algo.algoA],
	);
	const activeAlgoDefinitionB = useMemo(
		() =>
			ALGO_DEFINITIONS.find(
				(entry) => entry.id === (algo.algoB ?? PD_ALGOS[0].value),
			),
		[algo.algoB],
	);
	const controlsA = useMemo(
		() =>
			activeAlgoDefinitionA?.controls.map((ctrl) => ({
				...ctrl,
				algo: activeAlgoDefinitionA.id,
			})) ?? [],
		[activeAlgoDefinitionA],
	);
	const controlsB = useMemo(
		() =>
			activeAlgoDefinitionB?.controls.map((ctrl) => ({
				...ctrl,
				algo: activeAlgoDefinitionB.id,
			})) ?? [],
		[activeAlgoDefinitionB],
	);

	const { slotIndexA, slotIndexB } = useMemo(
		() => assignAlgoControlSlots(controlsA, controlsB),
		[controlsA, controlsB],
	);

	const getAlgoControlValue = useCallback(
		(entries: AlgoControlValueV1[], id: string, fallback: number) => {
			const existing = entries.find((entry) => entry.id === id);
			return existing ? (existing.value ?? fallback) : fallback;
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
			updateEntry: (id: string, value: number) => void,
			id: string,
			value: number,
		) => {
			updateEntry(id, value);
		},
		[],
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
					assignment.value ?? 0,
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
			updateEntry: (id: string, value: number) => void,
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
									setAlgoControlValue(updateEntry, control.id, value),
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
									setAlgoControlValue(updateEntry, control.id, value ? 1 : 0),
							} satisfies AlgoControlBinding,
						];
					}

					return [control.id, {} satisfies AlgoControlBinding];
				}),
			),
		[getAlgoControlValue, setAlgoControlValue],
	);

	const controlBindingsA = useMemo(
		() => createControlBindings(controlsA, algo.controlsA, algo.updateControlA),
		[algo.controlsA, algo.updateControlA, controlsA, createControlBindings],
	);
	const controlBindingsB = useMemo(
		() => createControlBindings(controlsB, algo.controlsB, algo.updateControlB),
		[algo.controlsB, algo.updateControlB, controlsB, createControlBindings],
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
							return (
								Math.round(currentValue) === Math.round(assignment.value ?? 0)
							);
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

	const slotA = useMemo<AlgoSlotViewModel>(
		() => ({
			slotId: "a",
			value: algo.algoA,
			onChange: handleAlgoChangeA,
			disabled: false,
			controls: controlsA,
			controlBindings: controlBindingsA,
			algoControlSlotIndex: slotIndexA,
			getControlValue: (id, fallback) =>
				getAlgoControlValue(algo.controlsA, id, fallback),
			setControlValue: (id, value) =>
				setAlgoControlValue(algo.updateControlA, id, value),
			getActiveSelectOption: (control) =>
				getActiveSelectOption(algo.controlsA, control, controlBindingsA),
			applyOptionAssignments: (option) =>
				applyOptionAssignments(algo.controlsA, algo.setControlsA, option),
		}),
		[
			algo.algoA,
			algo.controlsA,
			algo.setControlsA,
			algo.updateControlA,
			handleAlgoChangeA,
			controlsA,
			controlBindingsA,
			slotIndexA,
			getAlgoControlValue,
			setAlgoControlValue,
			getActiveSelectOption,
			applyOptionAssignments,
		],
	);

	const slotB = useMemo<AlgoSlotViewModel>(
		() => ({
			slotId: "b",
			value: algo.algoB ?? PD_ALGOS[0].value,
			onChange: handleAlgoChangeB,
			disabled: !algoBEnabled,
			controls: controlsB,
			controlBindings: controlBindingsB,
			algoControlSlotIndex: slotIndexB,
			getControlValue: (id, fallback) =>
				getAlgoControlValue(algo.controlsB, id, fallback),
			setControlValue: (id, value) =>
				setAlgoControlValue(algo.updateControlB, id, value),
			getActiveSelectOption: (control) =>
				getActiveSelectOption(algo.controlsB, control, controlBindingsB),
			applyOptionAssignments: (option) =>
				applyOptionAssignments(algo.controlsB, algo.setControlsB, option),
		}),
		[
			algo.algoB,
			algo.controlsB,
			algo.setControlsB,
			algo.updateControlB,
			algoBEnabled,
			handleAlgoChangeB,
			controlsB,
			controlBindingsB,
			slotIndexB,
			getAlgoControlValue,
			setAlgoControlValue,
			getActiveSelectOption,
			applyOptionAssignments,
		],
	);

	return {
		algoBEnabled,
		baseWaveEnabledA: algoUsesBaseWaveform(algo.algoA),
		baseWaveEnabledB:
			algoBEnabled && algo.algoB != null && algoUsesBaseWaveform(algo.algoB),
		slotA,
		slotB,
	};
}
