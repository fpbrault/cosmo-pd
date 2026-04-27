import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { CHORUS_PRESETS } from "@/lib/synth/modulePresets";

export default function ChorusModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const chorus = useSynthStore((s) => s.fxSlotChoruses[slot]);
	const setFxSlotChorus = useSynthStore((s) => s.setFxSlotChorus);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") {
			return;
		}

		const preset = CHORUS_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotChorus(slot, preset.patch.chorus);
		requestApplyModulePreset({
			module: "chorus",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Chorus"
			color="#818cf8"
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Chorus Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...CHORUS_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={chorus.enabled ?? false}
			onToggle={() => setFxSlotChorus(slot, { ...chorus, enabled: !chorus.enabled })}
		>
			<ControlKnob
				value={chorus.rate}
				onChange={(value) => setFxSlotChorus(slot, { ...chorus, rate: value })}
				min={0.1}
				max={5}
				defaultValue={1.0}
				size={52}
				color="#818cf8"
				label="Rate"
				valueFormatter={(value) => value.toFixed(1)}
			/>
			<ControlKnob
				value={chorus.depth}
				onChange={(value) => setFxSlotChorus(slot, { ...chorus, depth: value })}
				min={0}
				max={3}
				defaultValue={1.5}
				size={52}
				color="#818cf8"
				label="Depth"
				valueFormatter={(value) => `${Math.round((value / 3) * 100)}%`}
			/>
			<ControlKnob
				value={chorus.mix}
				onChange={(value) => setFxSlotChorus(slot, { ...chorus, mix: value })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color="#818cf8"
				label="Mix"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
		</ModuleFrame>
	);
}
