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
				/>
			) : null}
		</ModuleFrame>
	);
}
