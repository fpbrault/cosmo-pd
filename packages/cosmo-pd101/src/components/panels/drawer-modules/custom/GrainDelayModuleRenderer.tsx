import ControlKnob from "@/components/controls/ControlKnob";
import { useFxModuleController } from "@/components/panels/drawer-modules/custom/useFxModuleController";
import {
	asNumber,
	getFxControlLabel,
	getKnobControl,
	getModDestinationByParam,
	getTooltip,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LfoSyncDivision } from "@/lib/synth/bindings/synth";

const SYNC_DIVISIONS: readonly {
	value: LfoSyncDivision;
	label: string;
}[] = [
	{ value: "whole", label: "1/1" },
	{ value: "half", label: "1/2" },
	{ value: "dottedQuarter", label: "1/4." },
	{ value: "quarter", label: "1/4" },
	{ value: "dottedEighth", label: "1/8." },
	{ value: "quarterTriplet", label: "1/4T" },
	{ value: "eighth", label: "1/8" },
	{ value: "eighthTriplet", label: "1/8T" },
	{ value: "sixteenth", label: "1/16" },
	{ value: "thirtySecond", label: "1/32" },
];

function getDivisionIndex(value: LfoSyncDivision): number {
	return Math.max(
		0,
		SYNC_DIVISIONS.findIndex((entry) => entry.value === value),
	);
}

export default function GrainDelayModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const {
		selectedPreset,
		setFxSlotParams,
		params,
		enabled,
		handlePresetChange,
	} = useFxModuleController(config, slot);

	const timeMode = params.timeMode === "sync" ? "sync" : "hz";
	const syncDivision = (params.syncDivision as LfoSyncDivision) ?? "quarter";
	const syncDivisionIndex = getDivisionIndex(syncDivision);
	const transport = useHostTransport();
	const { value: tempoBpm } = useSynthParam("tempoBpm");
	const effectiveTempoBpm =
		transport.available &&
		Number.isFinite(transport.tempo) &&
		transport.tempo > 0
			? transport.tempo
			: tempoBpm;

	const timeControl = getKnobControl(config, "time");
	const feedbackControl = getKnobControl(config, "feedback");
	const scatterControl = getKnobControl(config, "scatter");
	const densityControl = getKnobControl(config, "density");
	const mixControl = getKnobControl(config, "mix");
	const pitchControl = getKnobControl(config, "pitchSemitones");
	const modDestinationByParam = getModDestinationByParam(config.type);
	const timeLabel = getFxControlLabel(config.type, "time", "grainDelayTime");
	const feedbackLabel = getFxControlLabel(
		config.type,
		"feedback",
		"grainDelayFeedback",
	);
	const scatterLabel = getFxControlLabel(
		config.type,
		"scatter",
		"grainDelayScatter",
	);
	const densityLabel = getFxControlLabel(
		config.type,
		"density",
		"grainDelayDensity",
	);
	const mixLabel = getFxControlLabel(config.type, "mix", "grainDelayMix");
	const pitchLabel = getFxControlLabel(config.type, "pitchSemitones", "pitch");

	const timeMidiLearn = useMidiLearnTarget({
		targetKey: timeControl
			? `fxSlot${slot + 1}Knob${timeControl.sourceIndex + 1}`
			: undefined,
		label: timeControl
			? `FX ${slot + 1} Knob ${timeControl.sourceIndex + 1}`
			: undefined,
		apply: timeControl
			? (rawValue) => {
					if (timeMode === "hz") {
						setFxSlotParams(slot, {
							time:
								timeControl.min +
								(rawValue / 127) * (timeControl.max - timeControl.min),
						});
						return;
					}
					const nextDivision =
						SYNC_DIVISIONS[
							Math.round((rawValue / 127) * (SYNC_DIVISIONS.length - 1))
						] ?? SYNC_DIVISIONS[0];
					setFxSlotParams(slot, { syncDivision: nextDivision.value });
				}
			: undefined,
	});

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={3}
			enabled={enabled}
			onToggle={() => setFxSlotParams(slot, { enabled: !enabled })}
			headerControl={
				<ModulePresetPopover
					title={config.presetTitle}
					value={selectedPreset}
					options={config.presets}
					onChange={handlePresetChange}
					accentColor={config.color}
				/>
			}
		>
			{timeControl && timeMode === "hz" ? (
				<ControlKnob
					value={asNumber(params.time, timeControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { time: value })}
					min={timeControl.min}
					max={timeControl.max}
					defaultValue={timeControl.defaultValue}
					color={config.color}
					label={timeLabel}
					labelAccessory={
						<button
							type="button"
							className="btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal"
							onClick={() => setFxSlotParams(slot, { timeMode: "sync" })}
						>
							hz
						</button>
					}
					tooltip={getTooltip("grainDelayTime")}
					valueFormatter={timeControl.formatter}
					modDestination={modDestinationByParam.time}
					onClick={timeMidiLearn.onClick}
					onContextMenu={timeMidiLearn.onContextMenu}
					interactionLocked={timeMidiLearn.interactionLocked}
					midiLearnState={timeMidiLearn.midiLearnState}
				/>
			) : null}
			{timeControl && timeMode === "sync" ? (
				<ControlKnob
					value={syncDivisionIndex}
					onChange={(value) => {
						const nextDivision =
							SYNC_DIVISIONS[Math.round(value)] ?? SYNC_DIVISIONS[0];
						setFxSlotParams(slot, { syncDivision: nextDivision.value });
					}}
					min={0}
					max={SYNC_DIVISIONS.length - 1}
					step={1}
					defaultValue={getDivisionIndex("quarter")}
					color={config.color}
					label={timeLabel}
					labelAccessory={
						<button
							type="button"
							className="btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal"
							onClick={() => setFxSlotParams(slot, { timeMode: "hz" })}
						>
							sync
						</button>
					}
					tooltip={getTooltip("grainDelayTime")}
					valueFormatter={(value) => {
						const division =
							SYNC_DIVISIONS[Math.round(value)] ?? SYNC_DIVISIONS[0];
						return `${division.label} · ${effectiveTempoBpm.toFixed(1)} BPM`;
					}}
					onClick={timeMidiLearn.onClick}
					onContextMenu={timeMidiLearn.onContextMenu}
					interactionLocked={timeMidiLearn.interactionLocked}
					midiLearnState={timeMidiLearn.midiLearnState}
				/>
			) : null}
			{feedbackControl ? (
				<ControlKnob
					value={asNumber(params.feedback, feedbackControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { feedback: value })}
					min={feedbackControl.min}
					max={feedbackControl.max}
					defaultValue={feedbackControl.defaultValue}
					color={config.color}
					label={feedbackLabel}
					tooltip={getTooltip("grainDelayFeedback")}
					valueFormatter={feedbackControl.formatter}
					modDestination={modDestinationByParam.feedback}
				/>
			) : null}
			{scatterControl ? (
				<ControlKnob
					value={asNumber(params.scatter, scatterControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { scatter: value })}
					min={scatterControl.min}
					max={scatterControl.max}
					defaultValue={scatterControl.defaultValue}
					color={config.color}
					label={scatterLabel}
					tooltip={getTooltip("grainDelayScatter")}
					valueFormatter={scatterControl.formatter}
					modDestination={modDestinationByParam.scatter}
				/>
			) : null}
			{densityControl ? (
				<ControlKnob
					value={asNumber(params.density, densityControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { density: value })}
					min={densityControl.min}
					max={densityControl.max}
					defaultValue={densityControl.defaultValue}
					color={config.color}
					label={densityLabel}
					tooltip={getTooltip("grainDelayDensity")}
					valueFormatter={densityControl.formatter}
					modDestination={modDestinationByParam.density}
				/>
			) : null}
			{mixControl ? (
				<ControlKnob
					value={asNumber(params.mix, mixControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { mix: value })}
					min={mixControl.min}
					max={mixControl.max}
					defaultValue={mixControl.defaultValue}
					color={config.color}
					label={mixLabel}
					tooltip={getTooltip("grainDelayMix")}
					valueFormatter={mixControl.formatter}
					modDestination={modDestinationByParam.mix}
				/>
			) : null}
			{pitchControl ? (
				<ControlKnob
					value={asNumber(params.pitchSemitones, pitchControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { pitchSemitones: value })}
					min={pitchControl.min}
					max={pitchControl.max}
					step={1}
					defaultValue={pitchControl.defaultValue}
					bipolar
					color={config.color}
					label={pitchLabel}
					valueFormatter={(value) =>
						`${value > 0 ? "+" : ""}${Math.round(value)} st`
					}
				/>
			) : null}
		</ModuleFrame>
	);
}
