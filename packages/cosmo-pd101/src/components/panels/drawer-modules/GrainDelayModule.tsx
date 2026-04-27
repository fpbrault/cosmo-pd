import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { GRAIN_DELAY_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#a78bfa";

export default function GrainDelayModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const grainDelay = useSynthStore((s) => s.grainDelay);
	const setGrainDelay = useSynthStore((s) => s.setGrainDelay);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = GRAIN_DELAY_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setGrainDelay(preset.patch.grainDelay);
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
			onToggle={() =>
				setGrainDelay({ ...grainDelay, enabled: !grainDelay.enabled })
			}
		>
			<ControlKnob
				value={grainDelay.time ?? 0.25}
				onChange={(v) => setGrainDelay({ ...grainDelay, time: v })}
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
				onChange={(v) => setGrainDelay({ ...grainDelay, scatter: v })}
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
				onChange={(v) => setGrainDelay({ ...grainDelay, density: v })}
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
				onChange={(v) => setGrainDelay({ ...grainDelay, mix: v })}
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
