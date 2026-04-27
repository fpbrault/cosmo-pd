import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { BITCRUSHER_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#f87171";

export default function BitcrusherModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const bitcrusher = useSynthStore((s) => s.fxSlotBitcrushers[slot]);
	const setFxSlotBitcrusher = useSynthStore((s) => s.setFxSlotBitcrusher);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = BITCRUSHER_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotBitcrusher(slot, preset.patch.bitcrusher);
		requestApplyModulePreset({
			module: "bitcrusher",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Bitcrusher"
			color={COLOR}
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Bitcrusher Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...BITCRUSHER_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={bitcrusher.enabled ?? false}
			onToggle={() =>
				setFxSlotBitcrusher(slot, { ...bitcrusher, enabled: !bitcrusher.enabled })
			}
		>
			<ControlKnob
				value={bitcrusher.bits ?? 8}
				onChange={(v) => setFxSlotBitcrusher(slot, { ...bitcrusher, bits: v })}
				min={2}
				max={16}
				defaultValue={8}
				size={52}
				color={COLOR}
				label="Bits"
				valueFormatter={(v) => v.toFixed(1)}
			/>
			<ControlKnob
				value={bitcrusher.rateReduction ?? 1}
				onChange={(v) => setFxSlotBitcrusher(slot, { ...bitcrusher, rateReduction: v })}
				min={1}
				max={16}
				defaultValue={1}
				size={52}
				color={COLOR}
				label="Rate"
				valueFormatter={(v) => `÷${v.toFixed(1)}`}
			/>
			<ControlKnob
				value={bitcrusher.mix ?? 1}
				onChange={(v) => setFxSlotBitcrusher(slot, { ...bitcrusher, mix: v })}
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
