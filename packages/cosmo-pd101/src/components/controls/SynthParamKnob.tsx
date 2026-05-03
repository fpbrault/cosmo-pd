import { memo, useMemo } from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import type {
	EngineParamReadoutFormatV1,
	EngineParamUiMetaV1,
	ModDestination,
} from "@/lib/synth/bindings/synth";
import {
	ENGINE_PARAM_UI_META_BY_KEY,
	getEngineParamDefault,
} from "@/lib/synth/paramMeta";
import type { KnobVariant } from "./knob/KnobView";

type EngineParamUiMetaRuntime = EngineParamUiMetaV1 & {
	min?: number;
	max?: number;
	step?: number;
	bipolar?: boolean;
	curve?: "linear" | "exponential2" | "exponential4";
	modDestination?: string;
};

function formatFromReadoutFormat(
	format: EngineParamReadoutFormatV1,
	bipolar: boolean,
): ((v: number) => string) | undefined {
	switch (format.kind) {
		case "percent":
			return (v) => `${Math.round(v * 100)}%`;
		case "bipolarPercent":
			return (v) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`;
		case "degrees":
			return (v) => `${Math.round(v * 360)}°`;
		case "integer":
			return bipolar
				? (v) => `${v >= 0 ? "+" : ""}${Math.round(v)}`
				: (v) => `${Math.round(v)}`;
		case "decimal":
			return (v) => v.toFixed(2);
		case "hertz":
			return (v) => {
				if (v < 1) {
					return `${v.toFixed(3)}Hz`;
				}
				if (v >= 10) {
					return `${v.toFixed(1)}Hz`;
				}
				return `${v.toFixed(2)}Hz`;
			};
		case "milliseconds":
			return (v) => `${Math.round(v)}ms`;
		case "seconds2":
			return (v) => `${v.toFixed(2)}s`;
		case "semitones":
			return (v) => `${Math.round(v)} st`;
		case "onOff":
			return (v) => (v >= 0.5 ? "On" : "Off");
		default:
			return undefined;
	}
}

export interface SynthParamKnobProps {
	paramKey: SynthParamKey;
	value: number;
	onChange: (v: number) => void;
	/** Short display label shown under the knob face. */
	label?: string;
	labelClassName?: string;
	color?: string;
	size?: number;
	min?: number;
	max?: number;
	variant?: KnobVariant;
	step?: number;
	modDestination?: ModDestination;
	valueFormatter?: (value: number) => string;
}

function SynthParamKnobInner({
	paramKey,
	value,
	onChange,
	label,
	labelClassName,
	color,
	size,
	min,
	max,
	variant,
	step,
	modDestination,
	valueFormatter: valueFormatterOverride,
}: SynthParamKnobProps) {
	const meta = ENGINE_PARAM_UI_META_BY_KEY[paramKey] as
		| EngineParamUiMetaRuntime
		| undefined;
	const defaultValue = getEngineParamDefault(paramKey);

	const valueFormatter = useMemo(() => {
		if (valueFormatterOverride) {
			return valueFormatterOverride;
		}
		if (!meta) return undefined;
		return formatFromReadoutFormat(meta.readoutFormat, meta.bipolar ?? false);
	}, [meta, valueFormatterOverride]);

	return (
		<ControlKnob
			value={value}
			onChange={onChange}
			label={label}
			labelClassName={labelClassName}
			tooltip={meta?.tooltip}
			min={min ?? meta?.min ?? 0}
			max={max ?? meta?.max ?? 1}
			step={step ?? meta?.step ?? undefined}
			defaultValue={defaultValue}
			bipolar={meta?.bipolar ?? false}
			color={color}
			size={size}
			variant={variant}
			curve={meta?.curve ?? "linear"}
			valueFormatter={valueFormatter}
			modDestination={
				modDestination ?? (meta?.modDestination as ModDestination | undefined)
			}
		/>
	);
}

const SynthParamKnob = memo(SynthParamKnobInner);
export default SynthParamKnob;
