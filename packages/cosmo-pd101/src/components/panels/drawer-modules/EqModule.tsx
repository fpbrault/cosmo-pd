import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { EQ_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#34d399";

export default function EqModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "eq5Band") return null;
	const eq = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = EQ_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotParams(slot, preset.patch.eq);
		requestApplyModulePreset({
			module: "eq",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="EQ"
			color={COLOR}
			columns={5}
			headerControl={
				<ModulePresetPopover
					title="EQ Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...EQ_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={eq.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !eq.enabled })}
		>
			<ControlKnob
				value={eq.gain80 ?? 0}
				onChange={(v) => setFxSlotParams(slot, { gain80: v })}
				min={-12}
				max={12}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="80Hz"
				valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
			/>
			<ControlKnob
				value={eq.gain240 ?? 0}
				onChange={(v) => setFxSlotParams(slot, { gain240: v })}
				min={-12}
				max={12}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="240Hz"
				valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
			/>
			<ControlKnob
				value={eq.gain750 ?? 0}
				onChange={(v) => setFxSlotParams(slot, { gain750: v })}
				min={-12}
				max={12}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="750Hz"
				valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
			/>
			<ControlKnob
				value={eq.gain2200 ?? 0}
				onChange={(v) => setFxSlotParams(slot, { gain2200: v })}
				min={-12}
				max={12}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="2.2kHz"
				valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
			/>
			<ControlKnob
				value={eq.gain8000 ?? 0}
				onChange={(v) => setFxSlotParams(slot, { gain8000: v })}
				min={-12}
				max={12}
				defaultValue={0}
				size={52}
				color={COLOR}
				label="8kHz"
				valueFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`}
			/>
		</ModuleFrame>
	);
}
