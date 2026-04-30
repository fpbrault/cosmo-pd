import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import CzButton from "@/components/primitives/CzButton";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { PHASE_MOD_PRESETS } from "@/lib/synth/modulePresets";

const PHASE_MOD_TOOLTIPS = {
	amount: "Sets internal phase modulation depth.",
	ratio: "Sets modulator-to-carrier frequency ratio.",
	pmPre: "Applies phase modulation before phase distortion warping.",
};

export default function PhaseModModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotEnabled = useSynthStore((s) => s.setFxSlotEnabled);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);

	if (rawSlot?.type !== "phaseMod") return null;
	const params = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = PHASE_MOD_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotParams(slot, {
			enabled: preset.patch.intPmEnabled,
			amount: preset.patch.intPmAmount,
			ratio: preset.patch.intPmRatio,
			pmPre: preset.patch.pmPre,
		});
		requestApplyModulePreset({
			module: "phaseMod",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Phase Mod"
			color="#be3330"
			headerControl={
				<ModulePresetPopover
					title="Phase Mod Presets"
					accentColor="#be3330"
					value={selectedPreset}
					options={PHASE_MOD_PRESETS}
					onChange={handlePresetChange}
				/>
			}
			enabled={params.enabled}
			columns={2}
			onToggle={() => setFxSlotEnabled(slot, !params.enabled)}
		>
			<CzButton
				active={params.pmPre}
				onClick={() => setFxSlotParams(slot, { pmPre: !params.pmPre })}
				tooltip={PHASE_MOD_TOOLTIPS.pmPre}
				className="h-16 px-2 col-span-2"
			>
				Pre
			</CzButton>

			<ControlKnob
				value={params.amount}
				onChange={(value) => setFxSlotParams(slot, { amount: value })}
				min={0}
				max={0.3}
				defaultValue={0.03}
				size={52}
				color="#be3330"
				label="Amount"
				tooltip={PHASE_MOD_TOOLTIPS.amount}
				valueFormatter={(value) => value?.toFixed(2)}
			/>
			<ControlKnob
				value={params.ratio}
				onChange={(value) => setFxSlotParams(slot, { ratio: value })}
				min={0.5}
				max={4}
				defaultValue={1.0}
				size={52}
				color="#be3330"
				label="Ratio"
				tooltip={PHASE_MOD_TOOLTIPS.ratio}
				valueFormatter={(value) => value?.toFixed(1)}
				modDestination="intPmRatio"
			/>
		</ModuleFrame>
	);
}
