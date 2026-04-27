import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { DISTORTION_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#f59e0b";

export default function DistortionModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const distortion = useSynthStore((s) => s.distortion);
	const setDistortion = useSynthStore((s) => s.setDistortion);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = DISTORTION_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setDistortion(preset.patch.distortion);
		requestApplyModulePreset({
			module: "distortion",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Distortion"
			color={COLOR}
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Distortion Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...DISTORTION_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={distortion.enabled ?? false}
			onToggle={() =>
				setDistortion({ ...distortion, enabled: !distortion.enabled })
			}
		>
			<ControlKnob
				value={distortion.drive ?? 0.5}
				onChange={(v) => setDistortion({ ...distortion, drive: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Drive"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={distortion.tone ?? 0.5}
				onChange={(v) => setDistortion({ ...distortion, tone: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Tone"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={distortion.mix ?? 1}
				onChange={(v) => setDistortion({ ...distortion, mix: v })}
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
