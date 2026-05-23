import { memo, useMemo } from "react";
import {
	DEFAULT_SYNC_DIVISIONS,
	getSyncDivisionIndex,
} from "@/components/panels/drawer-modules/syncDivisions";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import {
	type SynthParamKey,
	useOptionalSynthController,
} from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	EngineParamReadoutFormatV1,
	EngineParamUiMetaV1,
	LfoSyncDivision,
	ModDestination,
} from "@/lib/synth/bindings/synth";
import {
	ENGINE_PARAM_UI_META_BY_KEY,
	getEngineParamDefault,
	PARAM_META,
} from "@/lib/synth/paramMeta";
import ControlKnob from "./ControlKnob";
import type { KnobVariant } from "./knob/KnobView";
import type { KnobCurve } from "./knob/knobGeometry";

type EngineParamUiMetaRuntime = EngineParamUiMetaV1 & {
	min?: number;
	max?: number;
	step?: number;
	bipolar?: boolean;
	curve?: "linear" | "exponential2" | "exponential4";
	modDestination?: string;
};

type UiTransform = {
	toControlValue: (engineValue: number) => number;
	fromControlValue: (controlValue: number) => number;
	min: number;
	max: number;
	defaultValue: number;
	step?: number;
	bipolar?: boolean;
	curve?: KnobCurve;
	valueFormatter?: (controlValue: number, engineValue: number) => string;
};

type SyncConfig =
	| true
	| {
			modeParamKey: SynthParamKey;
			divisionParamKey: SynthParamKey;
			syncTooltipParamKey?: SynthParamKey;
	  };

function formatFromReadoutFormat(
	format: EngineParamReadoutFormatV1,
	bipolar: boolean,
): ((value: number) => string) | undefined {
	switch (format.kind) {
		case "percent":
			return (value) => `${Math.round(value * 100)}%`;
		case "bipolarPercent":
			return (value) => `${value >= 0 ? "+" : ""}${Math.round(value * 100)}%`;
		case "degrees":
			return (value) => `${Math.round(value * 360)}°`;
		case "integer":
			return bipolar
				? (value) => `${value >= 0 ? "+" : ""}${Math.round(value)}`
				: (value) => `${Math.round(value)}`;
		case "decimal":
			return (value) => value.toFixed(2);
		case "hertz":
			return (value) => {
				if (value < 1) {
					return `${value.toFixed(3)}Hz`;
				}
				if (value >= 10) {
					return `${value.toFixed(1)}Hz`;
				}
				return `${value.toFixed(2)}Hz`;
			};
		case "milliseconds":
			return (value) => `${Math.round(value)}ms`;
		case "seconds2":
			return (value) => `${value.toFixed(2)}s`;
		case "semitones":
			return (value) => `${Math.round(value)} st`;
		case "onOff":
			return (value) => (value >= 0.5 ? "On" : "Off");
		default:
			return undefined;
	}
}

function resolveSyncConfig(
	paramKey: SynthParamKey,
	sync: SyncConfig | undefined,
) {
	if (!sync) {
		return null;
	}

	if (sync !== true) {
		return sync;
	}

	switch (paramKey) {
		case "lfoRate":
			return {
				modeParamKey: "lfoRateMode" as const,
				divisionParamKey: "lfoSyncDivision" as const,
				syncTooltipParamKey: "lfoSyncDivision" as const,
			};
		case "lfo2Rate":
			return {
				modeParamKey: "lfo2RateMode" as const,
				divisionParamKey: "lfo2SyncDivision" as const,
				syncTooltipParamKey: "lfo2SyncDivision" as const,
			};
		default:
			return null;
	}
}

const TOGGLE_BUTTON_CLASS =
	"btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal";

interface SynthParamKnobProps {
	paramKey: SynthParamKey;
	value?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
	label?: string;
	labelClassName?: string;
	color?: string;
	size?: number;
	min?: number;
	max?: number;
	bipolar?: boolean;
	variant?: KnobVariant;
	step?: number;
	curve?: KnobCurve;
	modDestination?: ModDestination;
	tooltip?: string;
	valueFormatter?: (value: number) => string;
	midiTargetKey?: string;
	midiLabel?: string;
	uiTransform?: UiTransform;
	sync?: SyncConfig;
}

function SynthParamKnobInner({
	paramKey,
	value,
	onChange,
	disabled,
	label,
	labelClassName,
	color,
	size,
	min,
	max,
	bipolar,
	variant,
	step,
	curve,
	modDestination,
	tooltip,
	valueFormatter: valueFormatterOverride,
	midiTargetKey,
	midiLabel,
	uiTransform,
	sync,
}: SynthParamKnobProps) {
	const controller = useOptionalSynthController();

	const meta = ENGINE_PARAM_UI_META_BY_KEY[paramKey] as
		| EngineParamUiMetaRuntime
		| undefined;
	const transport = useHostTransport();
	const rawBoundValue = useSynthStore((state) => state[paramKey] as number);
	const tempoBpm = useSynthStore((state) => state.tempoBpm);
	const syncConfig = resolveSyncConfig(paramKey, sync);
	const syncModeValue = useSynthStore((state) =>
		syncConfig ? (state[syncConfig.modeParamKey] as string) : "hz",
	);
	const syncDivisionValue = useSynthStore((state) =>
		syncConfig
			? ((state[syncConfig.divisionParamKey] as LfoSyncDivision) ?? "quarter")
			: "quarter",
	);

	const engineValue = value ?? rawBoundValue;
	const controlValue = uiTransform
		? uiTransform.toControlValue(engineValue)
		: engineValue;
	const controlMin = min ?? uiTransform?.min ?? meta?.min ?? 0;
	const controlMax = max ?? uiTransform?.max ?? meta?.max ?? 1;
	const controlStep = step ?? uiTransform?.step ?? meta?.step ?? undefined;
	const controlBipolar =
		bipolar ?? uiTransform?.bipolar ?? meta?.bipolar ?? false;
	const controlCurve = curve ?? uiTransform?.curve ?? meta?.curve ?? "linear";
	const controlDefaultValue = uiTransform
		? uiTransform.defaultValue
		: getEngineParamDefault(paramKey);
	const effectiveTempoBpm =
		transport.available &&
		Number.isFinite(transport.tempo) &&
		transport.tempo > 0
			? transport.tempo
			: tempoBpm;
	const syncMode = syncConfig ? syncModeValue === "sync" : false;
	const boundTooltip = tooltip ?? PARAM_META[paramKey]?.tooltip;
	const syncTooltip = syncConfig?.syncTooltipParamKey
		? PARAM_META[syncConfig.syncTooltipParamKey]?.tooltip
		: boundTooltip;

	const setEngineValue = (nextEngineValue: number) => {
		if (onChange) {
			onChange(nextEngineValue);
			return;
		}
		if (!controller) {
			throw new Error(
				"SynthParamKnob must be used within SynthParamControllerProvider",
			);
		}
		controller.setParam(paramKey, nextEngineValue);
	};

	const setSyncMode = (nextMode: "hz" | "sync") => {
		if (!syncConfig) {
			return;
		}
		if (!controller) {
			throw new Error(
				"SynthParamKnob must be used within SynthParamControllerProvider",
			);
		}
		controller.setParam(syncConfig.modeParamKey, nextMode);
	};

	const setSyncDivision = (nextDivision: LfoSyncDivision) => {
		if (!syncConfig) {
			return;
		}
		if (!controller) {
			throw new Error(
				"SynthParamKnob must be used within SynthParamControllerProvider",
			);
		}
		controller.setParam(syncConfig.divisionParamKey, nextDivision);
	};

	const valueFormatter = useMemo(() => {
		if (syncConfig && syncMode) {
			return (nextIndex: number) => {
				const division =
					DEFAULT_SYNC_DIVISIONS[Math.round(nextIndex)] ??
					DEFAULT_SYNC_DIVISIONS[0];
				return `${division.label} · ${effectiveTempoBpm.toFixed(1)} BPM`;
			};
		}

		if (valueFormatterOverride) {
			return valueFormatterOverride;
		}

		if (uiTransform?.valueFormatter) {
			const transformFormatter = uiTransform.valueFormatter;
			return (nextControlValue: number) =>
				transformFormatter(
					nextControlValue,
					uiTransform.fromControlValue(nextControlValue),
				);
		}

		if (!meta) {
			return undefined;
		}

		return formatFromReadoutFormat(meta.readoutFormat, meta.bipolar ?? false);
	}, [
		effectiveTempoBpm,
		meta,
		syncConfig,
		syncMode,
		uiTransform,
		valueFormatterOverride,
	]);

	const midiLearn = useMidiLearnTarget({
		targetKey: midiTargetKey ?? paramKey,
		label: midiLabel ?? label,
		apply: (rawValue) => {
			if (syncConfig && syncMode) {
				const nextDivision =
					DEFAULT_SYNC_DIVISIONS[
						Math.round((rawValue / 127) * (DEFAULT_SYNC_DIVISIONS.length - 1))
					] ?? DEFAULT_SYNC_DIVISIONS[0];
				setSyncDivision(nextDivision.value);
				return;
			}

			const nextControlValue =
				controlMin + (rawValue / 127) * (controlMax - controlMin);
			setEngineValue(
				uiTransform
					? uiTransform.fromControlValue(nextControlValue)
					: nextControlValue,
			);
		},
	});

	return (
		<ControlKnob
			value={
				syncConfig && syncMode
					? getSyncDivisionIndex(syncDivisionValue)
					: controlValue
			}
			onChange={(nextValue) => {
				if (syncConfig && syncMode) {
					const nextDivision =
						DEFAULT_SYNC_DIVISIONS[Math.round(nextValue)] ??
						DEFAULT_SYNC_DIVISIONS[0];
					setSyncDivision(nextDivision.value);
					return;
				}

				setEngineValue(
					uiTransform ? uiTransform.fromControlValue(nextValue) : nextValue,
				);
			}}
			disabled={disabled}
			label={label}
			labelClassName={labelClassName}
			labelAccessory={
				syncConfig ? (
					<button
						type="button"
						className={TOGGLE_BUTTON_CLASS}
						onClick={() => setSyncMode(syncMode ? "hz" : "sync")}
					>
						{syncMode ? "sync" : "hz"}
					</button>
				) : undefined
			}
			tooltip={syncMode ? syncTooltip : boundTooltip}
			min={syncConfig && syncMode ? 0 : controlMin}
			max={
				syncConfig && syncMode ? DEFAULT_SYNC_DIVISIONS.length - 1 : controlMax
			}
			step={syncConfig && syncMode ? 1 : controlStep}
			defaultValue={
				syncConfig && syncMode
					? getSyncDivisionIndex("quarter")
					: controlDefaultValue
			}
			bipolar={syncConfig && syncMode ? false : controlBipolar}
			color={color}
			size={size}
			variant={variant}
			curve={syncConfig && syncMode ? "linear" : controlCurve}
			valueFormatter={valueFormatter}
			modDestination={
				modDestination ?? (meta?.modDestination as ModDestination | undefined)
			}
			onContextMenu={midiLearn.onContextMenu}
			onClick={midiLearn.onClick}
			interactionLocked={midiLearn.interactionLocked}
			midiLearnState={midiLearn.midiLearnState}
		/>
	);
}

const SynthParamKnob = memo(SynthParamKnobInner);
export default SynthParamKnob;
