import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import {
	asNumber,
	getKnobControl,
	getModDestinationByParam,
	getTooltip,
	resolveEnabled,
	resolvePresetPatchParams,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import BadgeToggle from "@/components/primitives/BadgeToggle";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";

export default function PhaseModModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((state) => state.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);

	if (rawSlot?.type !== config.type) {
		return null;
	}

	const params = (rawSlot as { params: Record<string, unknown> }).params;
	const enabled = resolveEnabled(params);
	const amountControl = getKnobControl(config, "intPmAmount");
	const ratioControl = getKnobControl(config, "intPmRatio");
	// pmPre is stored as boolean in PhaseModParams
	const pmPreEnabled = Boolean(params.pmPre);
	const modDestinationByParam = getModDestinationByParam(config.type);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = config.presets.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		const patchParams = resolvePresetPatchParams(
			config,
			preset.patch as Record<string, unknown>,
		);
		if (!patchParams) {
			return;
		}

		setFxSlotParams(slot, patchParams);
		requestApplyModulePreset({
			module: config.moduleKey,
			preset: preset.id,
			patch: preset.patch,
		});
	};

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
					label="Amount"
					tooltip={getTooltip("intPmAmount")}
					valueFormatter={amountControl.formatter}
					modDestination={modDestinationByParam.intPmAmount}
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
					label="Ratio"
					tooltip={getTooltip("intPmRatio")}
					valueFormatter={ratioControl.formatter}
					modDestination={modDestinationByParam.intPmRatio}
				/>
			) : null}
		</ModuleFrame>
	);
}
