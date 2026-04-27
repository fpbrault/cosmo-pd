import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { REVERB_PRESETS } from "@/lib/synth/modulePresets";

export default function ReverbModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const reverb = useSynthStore((s) => s.fxSlotReverbs[slot]);
	const setFxSlotReverb = useSynthStore((s) => s.setFxSlotReverb);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") {
			return;
		}

		const preset = REVERB_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotReverb(slot, preset.patch.reverb);
		requestApplyModulePreset({
			module: "reverb",
			preset: preset.id,
			patch: preset.patch,
		});
	};
	return (
		<ModuleFrame
			title="Reverb"
			color="#f97316"
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Reverb Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...REVERB_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			meta="FDN"
			enabled={reverb.enabled}
			onToggle={() => setFxSlotReverb(slot, { ...reverb, enabled: !reverb.enabled })}
		>
			<ControlKnob
				value={reverb.space}
				onChange={(value) => setFxSlotReverb(slot, { ...reverb, space: value })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={48}
				color="#f97316"
				label="Space"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<ControlKnob
				value={reverb.predelay}
				onChange={(value) => setFxSlotReverb(slot, { ...reverb, predelay: value })}
				min={0}
				max={0.1}
				defaultValue={0}
				size={48}
				color="#f97316"
				label="Pre-Dly"
				valueFormatter={(value) => `${Math.round(value * 1000)}ms`}
			/>
			<ControlKnob
				value={reverb.distance}
				onChange={(value) => setFxSlotReverb(slot, { ...reverb, distance: value })}
				min={0}
				max={1}
				defaultValue={0.3}
				size={48}
				color="#f97316"
				label="Dist"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<ControlKnob
				value={reverb.character}
				onChange={(value) =>
					setFxSlotReverb(slot, { ...reverb, character: value })
				}
				min={0}
				max={1}
				defaultValue={0.65}
				size={48}
				color="#f97316"
				label="Character"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<ControlKnob
				value={reverb.mix}
				onChange={(value) => setFxSlotReverb(slot, { ...reverb, mix: value })}
				min={0}
				max={1}
				defaultValue={0.3}
				size={48}
				color="#f97316"
				label="Mix"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
		</ModuleFrame>
	);
}
