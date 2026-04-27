import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { PHASER_PRESETS } from "@/lib/synth/modulePresets";

export default function PhaserModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "phaser") return null;
	const phaser = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") {
			return;
		}

		const preset = PHASER_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotParams(slot, preset.patch.phaser);
		requestApplyModulePreset({
			module: "phaser",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Phaser"
			color="#a78bfa"
			headerControl={
				<ModulePresetPopover
					title="Phaser Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...PHASER_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			meta="4-Stage"
			enabled={phaser.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !phaser.enabled })}
		>
			<ControlKnob
				value={phaser.rate}
				onChange={(value) => setFxSlotParams(slot, { rate: value })}
				min={0.1}
				max={10}
				defaultValue={0.5}
				size={52}
				color="#a78bfa"
				label="Rate"
				valueFormatter={(value) => `${value.toFixed(1)}Hz`}
			/>
			<ControlKnob
				value={phaser.depth}
				onChange={(value) => setFxSlotParams(slot, { depth: value })}
				min={0}
				max={1}
				defaultValue={1.0}
				size={52}
				color="#a78bfa"
				label="Depth"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			<ControlKnob
				value={phaser.feedback}
				onChange={(value) => setFxSlotParams(slot, { feedback: value })}
				min={-0.9}
				max={0.9}
				defaultValue={0.5}
				size={52}
				color="#a78bfa"
				label="Fdbk"
				valueFormatter={(value) =>
					value >= 0
						? `+${Math.round(value * 100)}%`
						: `${Math.round(value * 100)}%`
				}
			/>
			<ControlKnob
				value={phaser.mix}
				onChange={(value) => setFxSlotParams(slot, { mix: value })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color="#a78bfa"
				label="Mix"
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
		</ModuleFrame>
	);
}
