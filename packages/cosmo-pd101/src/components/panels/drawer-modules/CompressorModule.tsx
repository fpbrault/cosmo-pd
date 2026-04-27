import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { COMPRESSOR_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#fb923c";

export default function CompressorModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "compressor") return null;
	const compressor = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = COMPRESSOR_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotParams(slot, preset.patch.compressor);
		requestApplyModulePreset({
			module: "compressor",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Compressor"
			color={COLOR}
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Compressor Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...COMPRESSOR_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={compressor.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !compressor.enabled })}
		>
			<ControlKnob
				value={compressor.thresholdDb ?? -12}
				onChange={(v) => setFxSlotParams(slot, { thresholdDb: v })}
				min={-60}
				max={0}
				defaultValue={-12}
				size={52}
				color={COLOR}
				label="Thresh"
				valueFormatter={(v) => `${v.toFixed(0)}dB`}
			/>
			<ControlKnob
				value={compressor.ratio ?? 4}
				onChange={(v) => setFxSlotParams(slot, { ratio: v })}
				min={1}
				max={20}
				defaultValue={4}
				size={52}
				color={COLOR}
				label="Ratio"
				valueFormatter={(v) => `${v.toFixed(1)}:1`}
			/>
			<ControlKnob
				value={compressor.attackMs ?? 5}
				onChange={(v) => setFxSlotParams(slot, { attackMs: v })}
				min={0.1}
				max={100}
				defaultValue={5}
				size={52}
				color={COLOR}
				label="Attack"
				valueFormatter={(v) => `${v.toFixed(1)}ms`}
			/>
			<ControlKnob
				value={compressor.releaseMs ?? 100}
				onChange={(v) => setFxSlotParams(slot, { releaseMs: v })}
				min={10}
				max={1000}
				defaultValue={100}
				size={52}
				color={COLOR}
				label="Release"
				valueFormatter={(v) => `${v.toFixed(0)}ms`}
			/>
			<ControlKnob
				value={compressor.makeupDb ?? 6}
				onChange={(v) => setFxSlotParams(slot, { makeupDb: v })}
				min={0}
				max={24}
				defaultValue={6}
				size={52}
				color={COLOR}
				label="Makeup"
				valueFormatter={(v) => `${v.toFixed(1)}dB`}
			/>
			<ControlKnob
				value={compressor.mix ?? 1}
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
