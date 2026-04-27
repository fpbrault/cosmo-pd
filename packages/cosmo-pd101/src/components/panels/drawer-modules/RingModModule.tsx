import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { RING_MOD_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#e879f9";

export default function RingModModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "ringMod") return null;
	const ringMod = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = RING_MOD_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotParams(slot, preset.patch.ringMod);
		requestApplyModulePreset({
			module: "ringMod",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Ring Mod"
			color={COLOR}
			columns={2}
			headerControl={
				<ModulePresetPopover
					title="Ring Mod Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...RING_MOD_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={ringMod.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !ringMod.enabled })}
		>
			<ControlKnob
				value={ringMod.carrierHz ?? 440}
				onChange={(v) => setFxSlotParams(slot, { carrierHz: v })}
				min={20}
				max={2000}
				defaultValue={440}
				size={52}
				color={COLOR}
				label="Carrier"
				valueFormatter={(v) => `${v.toFixed(0)} Hz`}
			/>
			<ControlKnob
				value={ringMod.mix ?? 1}
				onChange={(v) => setFxSlotParams(slot, { mix: v })}
				min={0}
				max={1}
				defaultValue={1}
				size={52}
				color={COLOR}
				label="Mix"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
		</ModuleFrame>
	);
}
