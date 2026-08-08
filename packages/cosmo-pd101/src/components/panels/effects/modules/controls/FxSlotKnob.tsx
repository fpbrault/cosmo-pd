import ControlKnob from "@/components/controls/parameters/ControlKnob";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import type { KnobControlDef } from "@/components/panels/effects/modules/core/fxSlotModuleConfig";
import {
	getFxControlLabel,
	getFxControlTooltip,
	getKnobControl,
	getModDestinationByParam,
} from "@/components/panels/effects/modules/custom/utils";
import {
	DEFAULT_SYNC_DIVISIONS,
	getSyncDivisionIndex,
} from "@/components/panels/modulation/lfo/syncDivisions";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LfoSyncDivision } from "@/lib/synth/bindings/synth";

type FxSyncConfig = true | { modeParam: string; divisionParam: string };

interface FxSlotKnobProps {
	param: string;
	control?: KnobControlDef;
	valueParam?: string | string[];
	writeParam?: string;
	metaParamKey?: string;
	label?: string;
	tooltip?: string;
	color?: string;
	size?: number;
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
	bipolar?: boolean;
	valueFormatter?: (value: number) => string;
	sync?: FxSyncConfig;
}

const TOGGLE_BUTTON_CLASS =
	"btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal";

function resolveSyncConfig(param: string, sync: FxSyncConfig | undefined) {
	if (!sync) {
		return null;
	}

	if (sync !== true) {
		return sync;
	}

	if (param === "time") {
		return { modeParam: "timeMode", divisionParam: "syncDivision" };
	}

	if (param === "rate") {
		return { modeParam: "rateMode", divisionParam: "syncDivision" };
	}

	return null;
}

function resolveValue(
	rawParams: Record<string, unknown>,
	keys: string[],
	fallback: number,
) {
	for (const key of keys) {
		const value = rawParams[key];
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
	}

	return fallback;
}

export default function FxSlotKnob({
	param,
	control: controlOverride,
	valueParam,
	writeParam,
	metaParamKey,
	label,
	tooltip,
	color,
	size,
	min,
	max,
	step,
	defaultValue,
	bipolar,
	valueFormatter,
	sync,
}: FxSlotKnobProps) {
	const { config, slot, params, setFxSlotParams } = useFxSlotModule();
	const control = controlOverride ?? getKnobControl(config, param);
	const syncConfig = resolveSyncConfig(param, sync);
	const transport = useHostTransport();
	const { value: tempoBpm } = useSynthParam("tempoBpm");
	const midiLearn = useMidiLearnTarget({
		targetKey: control
			? `fxSlot${slot + 1}Knob${control.sourceIndex + 1}`
			: undefined,
		label: control
			? `FX ${slot + 1} Knob ${control.sourceIndex + 1}`
			: undefined,
		apply: control
			? (rawValue) => {
					if (syncConfig && params[syncConfig.modeParam] === "sync") {
						const nextDivision =
							DEFAULT_SYNC_DIVISIONS[
								Math.round(
									(rawValue / 127) * (DEFAULT_SYNC_DIVISIONS.length - 1),
								)
							] ?? DEFAULT_SYNC_DIVISIONS[0];
						setFxSlotParams(slot, {
							[syncConfig.divisionParam]: nextDivision.value,
						});
						return;
					}

					const mappedValue =
						(min ?? control.min) +
						(rawValue / 127) * ((max ?? control.max) - (min ?? control.min));
					setFxSlotParams(slot, {
						[writeParam ??
							(Array.isArray(valueParam) ? valueParam[0] : valueParam) ??
							param]: mappedValue,
					});
				}
			: undefined,
	});

	if (!control) {
		return null;
	}

	const controlMin = min ?? control.min;
	const controlMax = max ?? control.max;
	const controlDefaultValue = defaultValue ?? control.defaultValue;
	const resolvedColor = color ?? config.color;
	const resolvedLabel =
		label ?? getFxControlLabel(config.type, param, metaParamKey);
	const resolvedTooltip =
		tooltip ?? getFxControlTooltip(config.type, param, metaParamKey);
	const modDestinationByParam = getModDestinationByParam(config.type);
	const readKeys = Array.isArray(valueParam)
		? valueParam
		: [valueParam ?? writeParam ?? param];
	const writeKey =
		writeParam ??
		(Array.isArray(valueParam) ? valueParam[0] : valueParam) ??
		param;
	const effectiveTempoBpm =
		transport.available &&
		Number.isFinite(transport.tempo) &&
		transport.tempo > 0
			? transport.tempo
			: tempoBpm;
	const modeValue = syncConfig ? params[syncConfig.modeParam] : undefined;
	const syncMode = modeValue === "sync";
	const syncDivision = syncConfig
		? ((params[syncConfig.divisionParam] as LfoSyncDivision) ?? "quarter")
		: "quarter";
	const currentValue = resolveValue(params, readKeys, controlDefaultValue);

	if (syncConfig && syncMode) {
		return (
			<ControlKnob
				value={getSyncDivisionIndex(syncDivision)}
				onChange={(nextIndex) => {
					const nextDivision =
						DEFAULT_SYNC_DIVISIONS[Math.round(nextIndex)] ??
						DEFAULT_SYNC_DIVISIONS[0];
					setFxSlotParams(slot, {
						[syncConfig.divisionParam]: nextDivision.value,
					});
				}}
				min={0}
				max={DEFAULT_SYNC_DIVISIONS.length - 1}
				step={1}
				defaultValue={getSyncDivisionIndex("quarter")}
				size={size ?? control.size ?? 64}
				color={resolvedColor}
				label={resolvedLabel}
				labelAccessory={
					<button
						type="button"
						className={TOGGLE_BUTTON_CLASS}
						onClick={() =>
							setFxSlotParams(slot, { [syncConfig.modeParam]: "hz" })
						}
					>
						sync
					</button>
				}
				tooltip={resolvedTooltip}
				valueFormatter={(value) => {
					const division =
						DEFAULT_SYNC_DIVISIONS[Math.round(value)] ??
						DEFAULT_SYNC_DIVISIONS[0];
					return `${division.label} · ${effectiveTempoBpm.toFixed(1)} BPM`;
				}}
				onClick={midiLearn.onClick}
				onContextMenu={midiLearn.onContextMenu}
				interactionLocked={midiLearn.interactionLocked}
				midiLearnState={midiLearn.midiLearnState}
			/>
		);
	}

	return (
		<ControlKnob
			value={currentValue}
			onChange={(value) => setFxSlotParams(slot, { [writeKey]: value })}
			min={controlMin}
			max={controlMax}
			step={step}
			defaultValue={controlDefaultValue}
			size={size ?? control.size ?? 64}
			color={resolvedColor}
			label={resolvedLabel}
			labelAccessory={
				syncConfig ? (
					<button
						type="button"
						className={TOGGLE_BUTTON_CLASS}
						onClick={() =>
							setFxSlotParams(slot, { [syncConfig.modeParam]: "sync" })
						}
					>
						hz
					</button>
				) : undefined
			}
			tooltip={resolvedTooltip}
			bipolar={bipolar}
			valueFormatter={valueFormatter ?? control.formatter}
			modDestination={modDestinationByParam[param]}
			onClick={midiLearn.onClick}
			onContextMenu={midiLearn.onContextMenu}
			interactionLocked={midiLearn.interactionLocked}
			midiLearnState={midiLearn.midiLearnState}
		/>
	);
}
