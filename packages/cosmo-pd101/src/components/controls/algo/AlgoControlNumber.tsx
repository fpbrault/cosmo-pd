import { memo } from "react";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useAlgoControl } from "@/lib/synth/i18nAlgo";
import { algoParamTargetFromSlot } from "@/lib/synth/modDestination";
import ControlKnob from "../ControlKnob";
import type {
	AlgoControlBinding,
	AlgoControlRuntime,
	LineIndex,
} from "./algoControlTypes";

interface AlgoControlNumberProps {
	control: AlgoControlRuntime;
	disabled?: boolean;
	sectionId?: "a" | "b";
	binding?: AlgoControlBinding;
	lineIndex: LineIndex;
	algoParamSlotIndex: Record<string, number>;
	getAlgoControlValue: (id: string, fallback: number) => number;
	setAlgoControlValue: (id: string, value: number) => void;
	color?: string;
}

// Derived-display overrides for controls whose readout is a computed value,
// not a raw normalized percentage or fixed unit.
const derivedFormatters: Record<string, (v: number) => string> = {
	// syncRatio: 0..1 → 1..15x
	syncRatio: (v) => `${(1 + v * 14).toFixed(1)}x`,
	// twistHarmonics: 0..1 → 1..12x
	twistHarmonics: (v) => `${(1 + v * 11).toFixed(1)}x`,
	// rippleFreq: 0..1 → 2..24 cyc
	rippleFreq: (v) => `${(2 + v * 22).toFixed(1)} cyc`,
	// fofRatio: 0..1 → 2..10x
	fofRatio: (v) => `${(2 + v * 8).toFixed(1)}x`,
	// quantizeSteps: 0..1 → 2..32 steps
	quantizeSteps: (v) => `${Math.round(2 + Math.floor(v * 30))}`,
};

function formatAlgoControlValue(
	control: AlgoControlRuntime,
	value: number,
): string {
	// Derived-display controls: show computed value instead of raw format
	const derived = derivedFormatters[control.id];
	if (derived) return derived(value);

	// Engine-owned format switch
	const fmt = control.readoutFormat;
	if (fmt) {
		switch (fmt.kind) {
			case "percent":
				return `${Math.round(value * 100)}%`;
			case "bipolarPercent":
				return `${value >= 0 ? "+" : ""}${Math.round(value * 100)}%`;
			case "degrees":
				return `${Math.round(value * 360)}°`;
			case "integer": {
				const bipolar = (control.min ?? 0) < 0;
				return `${value >= 0 && bipolar ? "+" : ""}${Math.round(value)}`;
			}
			case "decimal":
				return value.toFixed(2);
			default:
				break;
		}
	}

	// Fallback: guess from range
	if ((control.min ?? 0) >= 0 && (control.max ?? 1) <= 1) {
		return `${Math.round(value * 100)}%`;
	}
	if ((control.min ?? 0) < 0 && (control.max ?? 0) > 0) {
		return `${value >= 0 ? "+" : ""}${Math.round(value * 100)}%`;
	}
	return value.toFixed(2);
}

function AlgoControlNumberInner({
	control,
	disabled = false,
	sectionId = "a",
	binding,
	lineIndex,
	algoParamSlotIndex,
	getAlgoControlValue,
	setAlgoControlValue,
	color = "cyan",
}: AlgoControlNumberProps) {
	const { label, description } = useAlgoControl(control.algo, control.id);
	const min = control.min ?? 0;
	const max = control.max ?? 1;
	const value =
		binding?.getNumber?.() ??
		getAlgoControlValue(control.id, control.default ?? min);
	const slotIdx = algoParamSlotIndex[control.id];
	const algoParamTarget = slotIdx
		? algoParamTargetFromSlot(slotIdx)
		: undefined;
	const midiLearn = useMidiLearnTarget({
		targetKey: `line${lineIndex}Algo${sectionId.toUpperCase()}Control${control.id}`,
		label: `Line ${lineIndex} Algo ${sectionId.toUpperCase()} ${label}`,
		apply: (rawValue) => {
			const normalized = rawValue / 127;
			const mappedValue = min + normalized * (max - min);
			if (binding?.setNumber) {
				binding.setNumber(mappedValue);
				return;
			}
			setAlgoControlValue(control.id, mappedValue);
		},
	});

	return (
		<div className="flex flex-col items-center">
			<ControlKnob
				label={label}
				tooltip={description ?? undefined}
				disabled={disabled}
				min={min}
				max={max}
				value={value}
				size={100}
				bipolar={min < 0 && max > 0}
				defaultValue={control.default ?? undefined}
				color={color}
				modulatable={disabled ? undefined : algoParamTarget}
				lineIndex={lineIndex}
				onChange={(newVal) =>
					binding?.setNumber
						? binding.setNumber(newVal)
						: setAlgoControlValue(control.id, newVal)
				}
				valueFormatter={(v) => formatAlgoControlValue(control, v)}
				onClick={midiLearn.onClick}
				onContextMenu={midiLearn.onContextMenu}
				interactionLocked={midiLearn.interactionLocked}
				midiLearnState={midiLearn.midiLearnState}
			/>
		</div>
	);
}

const AlgoControlNumber = memo(AlgoControlNumberInner);

export default AlgoControlNumber;
