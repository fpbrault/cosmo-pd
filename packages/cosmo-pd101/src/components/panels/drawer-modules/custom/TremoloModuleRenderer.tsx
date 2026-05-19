import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import { useFxModuleController } from "@/components/panels/drawer-modules/custom/useFxModuleController";
import {
	asNumber,
	getButtonGroupControl,
	getFxControlLabel,
	getFxControlOptionLabel,
	getKnobControl,
	getModDestinationByParam,
	getTooltip,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";

export default function TremoloModuleRenderer({
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

	const waveformControl = getButtonGroupControl(config, "waveform");
	const rateControl = getKnobControl(config, "rate");
	const depthControl = getKnobControl(config, "depth");
	const mixControl = getKnobControl(config, "mix");
	const waveformValue = asNumber(params.waveform, 0);
	const modDestinationByParam = getModDestinationByParam(config.type);
	const rateLabel = getFxControlLabel(config.type, "rate", "tremoloRate");
	const depthLabel = getFxControlLabel(config.type, "depth", "tremoloDepth");
	const mixLabel = getFxControlLabel(config.type, "mix", "tremoloMix");
	const rateMidiLearn = useMidiLearnTarget({
		targetKey: rateControl
			? `fxSlot${slot + 1}Knob${rateControl.sourceIndex + 1}`
			: undefined,
		label: rateControl
			? `FX ${slot + 1} Knob ${rateControl.sourceIndex + 1}`
			: undefined,
		apply: rateControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						rate:
							rateControl.min +
							(rawValue / 127) * (rateControl.max - rateControl.min),
					})
			: undefined,
	});
	const depthMidiLearn = useMidiLearnTarget({
		targetKey: depthControl
			? `fxSlot${slot + 1}Knob${depthControl.sourceIndex + 1}`
			: undefined,
		label: depthControl
			? `FX ${slot + 1} Knob ${depthControl.sourceIndex + 1}`
			: undefined,
		apply: depthControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						depth:
							depthControl.min +
							(rawValue / 127) * (depthControl.max - depthControl.min),
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
			<div className="join col-span-3 w-full overflow-hidden rounded-md border border-cz-border/65">
				{waveformControl?.options.map((option) => (
					<Button
						key={option.value}
						type="button"
						className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
							waveformValue === option.value
								? "border-amber-500/60 bg-amber-500/20 text-amber-300"
								: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
						}`}
						onClick={() => setFxSlotParams(slot, { waveform: option.value })}
					>
						{getFxControlOptionLabel(config.type, "waveform", option.value)}
					</Button>
				))}
			</div>
			{rateControl ? (
				<ControlKnob
					value={asNumber(params.rate, rateControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { rate: value })}
					min={rateControl.min}
					max={rateControl.max}
					defaultValue={rateControl.defaultValue}
					color={config.color}
					label={rateLabel}
					tooltip={getTooltip("tremoloRate")}
					valueFormatter={rateControl.formatter}
					modDestination={modDestinationByParam.rate}
					onClick={rateMidiLearn.onClick}
					onContextMenu={rateMidiLearn.onContextMenu}
					interactionLocked={rateMidiLearn.interactionLocked}
					midiLearnState={rateMidiLearn.midiLearnState}
				/>
			) : null}
			{depthControl ? (
				<ControlKnob
					value={asNumber(params.depth, depthControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { depth: value })}
					min={depthControl.min}
					max={depthControl.max}
					defaultValue={depthControl.defaultValue}
					color={config.color}
					label={depthLabel}
					tooltip={getTooltip("tremoloDepth")}
					valueFormatter={depthControl.formatter}
					modDestination={modDestinationByParam.depth}
					onClick={depthMidiLearn.onClick}
					onContextMenu={depthMidiLearn.onContextMenu}
					interactionLocked={depthMidiLearn.interactionLocked}
					midiLearnState={depthMidiLearn.midiLearnState}
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
					tooltip={getTooltip("tremoloMix")}
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
