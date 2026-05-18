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
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";

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
			? (rawValue) =>
					setFxSlotParams(slot, {
						time:
							timeControl.min +
							(rawValue / 127) * (timeControl.max - timeControl.min),
					})
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
			{timeControl ? (
				<ControlKnob
					value={asNumber(params.time, timeControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { time: value })}
					min={timeControl.min}
					max={timeControl.max}
					defaultValue={timeControl.defaultValue}
					size={64}
					color={config.color}
					label={timeLabel}
					tooltip={getTooltip("delayTime")}
					valueFormatter={timeControl.formatter}
					modDestination={modDestinationByParam.time}
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
