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

export default function PhaseModModuleRenderer({
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

	const amountControl = getKnobControl(config, "intPmAmount");
	const ratioControl = getKnobControl(config, "intPmRatio");
	const pmPreEnabled = Boolean(params.pmPre);
	const modDestinationByParam = getModDestinationByParam(config.type);
	const amountLabel = getFxControlLabel(
		config.type,
		"intPmAmount",
		"intPmAmount",
	);
	const ratioLabel = getFxControlLabel(config.type, "intPmRatio", "intPmRatio");
	const amountMidiLearn = useMidiLearnTarget({
		targetKey: amountControl
			? `fxSlot${slot + 1}Knob${amountControl.sourceIndex + 1}`
			: undefined,
		label: amountControl
			? `FX ${slot + 1} Knob ${amountControl.sourceIndex + 1}`
			: undefined,
		apply: amountControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						amount:
							amountControl.min +
							(rawValue / 127) * (amountControl.max - amountControl.min),
					})
			: undefined,
	});
	const ratioMidiLearn = useMidiLearnTarget({
		targetKey: ratioControl
			? `fxSlot${slot + 1}Knob${ratioControl.sourceIndex + 1}`
			: undefined,
		label: ratioControl
			? `FX ${slot + 1} Knob ${ratioControl.sourceIndex + 1}`
			: undefined,
		apply: ratioControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						ratio:
							ratioControl.min +
							(rawValue / 127) * (ratioControl.max - ratioControl.min),
					})
			: undefined,
	});

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={2}
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
				active={pmPreEnabled}
				label="Pre"
				onClick={() => setFxSlotParams(slot, { pmPre: !pmPreEnabled })}
				tooltip={getTooltip("pmPre")}
				className="col-span-2"
			/>
			{amountControl ? (
				<ControlKnob
					value={asNumber(
						params.amount ?? params.intPmAmount,
						amountControl.defaultValue,
					)}
					onChange={(value) => setFxSlotParams(slot, { amount: value })}
					min={amountControl.min}
					max={amountControl.max}
					defaultValue={amountControl.defaultValue}
					size={64}
					color={config.color}
					label={amountLabel}
					tooltip={getTooltip("intPmAmount")}
					valueFormatter={amountControl.formatter}
					modDestination={modDestinationByParam.intPmAmount}
					onClick={amountMidiLearn.onClick}
					onContextMenu={amountMidiLearn.onContextMenu}
					interactionLocked={amountMidiLearn.interactionLocked}
					midiLearnState={amountMidiLearn.midiLearnState}
				/>
			) : null}
			{ratioControl ? (
				<ControlKnob
					value={asNumber(
						params.ratio ?? params.intPmRatio,
						ratioControl.defaultValue,
					)}
					onChange={(value) => setFxSlotParams(slot, { ratio: value })}
					min={ratioControl.min}
					max={ratioControl.max}
					defaultValue={ratioControl.defaultValue}
					size={64}
					color={config.color}
					label={ratioLabel}
					tooltip={getTooltip("intPmRatio")}
					valueFormatter={ratioControl.formatter}
					modDestination={modDestinationByParam.intPmRatio}
					onClick={ratioMidiLearn.onClick}
					onContextMenu={ratioMidiLearn.onContextMenu}
					interactionLocked={ratioMidiLearn.interactionLocked}
					midiLearnState={ratioMidiLearn.midiLearnState}
				/>
			) : null}
		</ModuleFrame>
	);
}
