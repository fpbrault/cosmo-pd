import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { GRAIN_DELAY_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#a78bfa";

export default function GrainDelayModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "grainDelay") return null;
	const grainDelay = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = GRAIN_DELAY_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotParams(slot, preset.patch.grainDelay);
		requestApplyModulePreset({
			module: "grainDelay",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Grain Delay"
			color={COLOR}
			columns={4}
			headerControl={
				<ModulePresetPopover
					title="Grain Delay Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...GRAIN_DELAY_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={grainDelay.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !grainDelay.enabled })}
		>
			<ControlKnob
				value={grainDelay.time ?? 0.25}
				onChange={(v) => setFxSlotParams(slot, { time: v })}
				min={0.01}
				max={1}
				defaultValue={0.25}
				size={52}
				color={COLOR}
				label="Time"
				valueFormatter={(v) => `${(v * 1000).toFixed(0)}ms`}
			/>
			<ControlKnob
				value={grainDelay.scatter ?? 0}
				onChange={(v) => setFxSlotParams(slot, { scatter: v })}
				min={0}
				max={1}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="Scatter"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={grainDelay.density ?? 0.5}
				onChange={(v) => setFxSlotParams(slot, { density: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Density"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={grainDelay.mix ?? 0}
				onChange={(v) => setFxSlotParams(slot, { mix: v })}
				min={0}
				max={1}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="Mix"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
		</ModuleFrame>
	);
}
