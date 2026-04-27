import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { SHIMMER_VERB_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#60a5fa";

export default function ShimmerVerbModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const shimmerVerb = useSynthStore((s) => s.shimmerVerb);
	const setShimmerVerb = useSynthStore((s) => s.setShimmerVerb);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = SHIMMER_VERB_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setShimmerVerb(preset.patch.shimmerVerb);
		requestApplyModulePreset({
			module: "shimmerVerb",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Shimmer Verb"
			color={COLOR}
			columns={3}
			headerControl={
				<ModulePresetPopover
					title="Shimmer Verb Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...SHIMMER_VERB_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={shimmerVerb.enabled ?? false}
			onToggle={() =>
				setShimmerVerb({ ...shimmerVerb, enabled: !shimmerVerb.enabled })
			}
		>
			<ControlKnob
				value={shimmerVerb.shimmer ?? 0.4}
				onChange={(v) => setShimmerVerb({ ...shimmerVerb, shimmer: v })}
				min={0}
				max={1}
				defaultValue={0.4}
				size={52}
				color={COLOR}
				label="Shimmer"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={shimmerVerb.space ?? 0.7}
				onChange={(v) => setShimmerVerb({ ...shimmerVerb, space: v })}
				min={0}
				max={1}
				defaultValue={0.7}
				size={52}
				color={COLOR}
				label="Space"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<ControlKnob
				value={shimmerVerb.mix ?? 0}
				onChange={(v) => setShimmerVerb({ ...shimmerVerb, mix: v })}
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
