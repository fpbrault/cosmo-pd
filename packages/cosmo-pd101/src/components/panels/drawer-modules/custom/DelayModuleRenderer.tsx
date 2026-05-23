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
import BadgeToggle from "@/components/primitives/BadgeToggle";
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

export default function DelayModuleRenderer({
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

	const tapeMode = asNumber(params.tapeMode, 0) === 1;
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
	const columns = tapeMode ? 4 : 3;
	const timeControl = getKnobControl(config, "time");
	const feedbackControl = getKnobControl(config, "feedback");
	const warmthControl = getKnobControl(config, "warmth");
	const mixControl = getKnobControl(config, "mix");
	const modeLabel = tapeMode ? "Tape Echo" : "Digital";
	const modDestinationByParam = getModDestinationByParam(config.type);
	const timeLabel = getFxControlLabel(config.type, "time", "delayTime");
	const feedbackLabel = getFxControlLabel(
		config.type,
		"feedback",
		"delayFeedback",
	);
	const warmthLabel = getFxControlLabel(config.type, "warmth", "delayWarmth");
	const mixLabel = getFxControlLabel(config.type, "mix", "delayMix");
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
	const feedbackMidiLearn = useMidiLearnTarget({
		targetKey: feedbackControl
			? `fxSlot${slot + 1}Knob${feedbackControl.sourceIndex + 1}`
			: undefined,
		label: feedbackControl
			? `FX ${slot + 1} Knob ${feedbackControl.sourceIndex + 1}`
			: undefined,
		apply: feedbackControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						feedback:
							feedbackControl.min +
							(rawValue / 127) * (feedbackControl.max - feedbackControl.min),
					})
			: undefined,
	});
	const warmthMidiLearn = useMidiLearnTarget({
		targetKey: warmthControl
			? `fxSlot${slot + 1}Knob${warmthControl.sourceIndex + 1}`
			: undefined,
		label: warmthControl
			? `FX ${slot + 1} Knob ${warmthControl.sourceIndex + 1}`
			: undefined,
		apply: warmthControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						warmth:
							warmthControl.min +
							(rawValue / 127) * (warmthControl.max - warmthControl.min),
					})
			: undefined,
	});
	const mixMidiLearn = useMidiLearnTarget({
		targetKey: mixControl
			? `fxSlot${slot + 1}Knob${mixControl.sourceIndex + 1}`
			: undefined,
		label: mixControl
			? `FX ${slot + 1} Knob ${mixControl.sourceIndex + 1}`
			: undefined,
		apply: mixControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						mix:
							mixControl.min +
							(rawValue / 127) * (mixControl.max - mixControl.min),
					})
			: undefined,
	});

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			meta={modeLabel}
			columns={columns}
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
			<BadgeToggle
				active={tapeMode}
				label="Tape"
				onClick={() => setFxSlotParams(slot, { tapeMode: tapeMode ? 0 : 1 })}
				tooltip={getTooltip("delayTapeMode")}
				className="col-span-full"
			/>
			{timeControl && timeMode === "hz" ? (
				<ControlKnob
					value={asNumber(params.time, timeControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { time: value })}
					min={timeControl.min}
					max={timeControl.max}
					defaultValue={timeControl.defaultValue}
					size={64}
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
					tooltip={getTooltip("delayTime")}
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
					size={64}
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
					tooltip={getTooltip("delayTime")}
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
					size={64}
					color={config.color}
					label={feedbackLabel}
					tooltip={getTooltip("delayFeedback")}
					valueFormatter={feedbackControl.formatter}
					modDestination={modDestinationByParam.feedback}
					onClick={feedbackMidiLearn.onClick}
					onContextMenu={feedbackMidiLearn.onContextMenu}
					interactionLocked={feedbackMidiLearn.interactionLocked}
					midiLearnState={feedbackMidiLearn.midiLearnState}
				/>
			) : null}
			{tapeMode && warmthControl ? (
				<ControlKnob
					value={asNumber(params.warmth, warmthControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { warmth: value })}
					min={warmthControl.min}
					max={warmthControl.max}
					defaultValue={warmthControl.defaultValue}
					size={64}
					color={config.color}
					label={warmthLabel}
					tooltip={getTooltip("delayWarmth")}
					valueFormatter={warmthControl.formatter}
					modDestination={modDestinationByParam.warmth}
					onClick={warmthMidiLearn.onClick}
					onContextMenu={warmthMidiLearn.onContextMenu}
					interactionLocked={warmthMidiLearn.interactionLocked}
					midiLearnState={warmthMidiLearn.midiLearnState}
				/>
			) : null}
			{mixControl ? (
				<ControlKnob
					value={asNumber(params.mix, mixControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { mix: value })}
					min={mixControl.min}
					max={mixControl.max}
					defaultValue={mixControl.defaultValue}
					size={64}
					color={config.color}
					label={mixLabel}
					tooltip={getTooltip("delayMix")}
					valueFormatter={mixControl.formatter}
					modDestination={modDestinationByParam.mix}
					onClick={mixMidiLearn.onClick}
					onContextMenu={mixMidiLearn.onContextMenu}
					interactionLocked={mixMidiLearn.interactionLocked}
					midiLearnState={mixMidiLearn.midiLearnState}
				/>
			) : null}
		</ModuleFrame>
	);
}
