import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { WAVEFOLDER_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#c084fc";

export default function WavefolderModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const wavefolder = useSynthStore((s) => s.fxSlotWavefolders[slot]);
	const setFxSlotWavefolder = useSynthStore((s) => s.setFxSlotWavefolder);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = WAVEFOLDER_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotWavefolder(slot, preset.patch.wavefolder);
		requestApplyModulePreset({
			module: "wavefolder",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Wavefolder"
			color={COLOR}
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Wavefolder Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...WAVEFOLDER_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={wavefolder.enabled ?? false}
			onToggle={() =>
				setFxSlotWavefolder(slot, { ...wavefolder, enabled: !wavefolder.enabled })
			}
		>
			<ControlKnob
				value={wavefolder.drive ?? 0.5}
				onChange={(v) => setFxSlotWavefolder(slot, { ...wavefolder, drive: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Drive"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={wavefolder.folds ?? 0.5}
				onChange={(v) => setFxSlotWavefolder(slot, { ...wavefolder, folds: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Folds"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={wavefolder.mix ?? 1}
				onChange={(v) => setFxSlotWavefolder(slot, { ...wavefolder, mix: v })}
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
