import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import {
	asNumber,
	getKnobControl,
	getTooltip,
	resolveEnabled,
	resolvePresetPatchParams,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import CzButton from "@/components/primitives/CzButton";
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
	const amountControl = getKnobControl(config, "amount");
	const ratioControl = getKnobControl(config, "ratio");
	const pmPreEnabled = asNumber(params.pmPre, 0) === 1;

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
			<CzButton
				active={pmPreEnabled}
				onClick={() => setFxSlotParams(slot, { pmPre: pmPreEnabled ? 0 : 1 })}
				tooltip={getTooltip("pmPre")}
				className="h-16 px-2 col-span-2"
			>
				Pre
			</CzButton>
			{amountControl ? (
				<ControlKnob
					value={asNumber(params.amount, amountControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { amount: value })}
					min={amountControl.min}
					max={amountControl.max}
					defaultValue={amountControl.defaultValue}
					color={config.color}
					label="Amount"
					tooltip={getTooltip("intPmAmount")}
					valueFormatter={amountControl.formatter}
				/>
			) : null}
			{ratioControl ? (
				<ControlKnob
					value={asNumber(params.ratio, ratioControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { ratio: value })}
					min={ratioControl.min}
					max={ratioControl.max}
					defaultValue={ratioControl.defaultValue}
					color={config.color}
					label="Ratio"
					tooltip={getTooltip("intPmRatio")}
					valueFormatter={ratioControl.formatter}
				/>
			) : null}
		</ModuleFrame>
	);
}
