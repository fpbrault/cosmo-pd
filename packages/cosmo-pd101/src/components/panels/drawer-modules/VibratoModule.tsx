import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { VIBRATO_PRESETS } from "@/lib/synth/modulePresets";

export default function VibratoModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotEnabled = useSynthStore((s) => s.setFxSlotEnabled);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);

	if (rawSlot?.type !== "vibrato") return null;
	const params = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = VIBRATO_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotParams(slot, preset.patch.vibrato);
		requestApplyModulePreset({
			module: "vibrato",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Vibrato"
			color="#307948"
			headerControl={
				<ModulePresetPopover
					title="Vibrato Presets"
					accentColor="#307948"
					value={selectedPreset}
					options={VIBRATO_PRESETS}
					onChange={handlePresetChange}
				/>
			}
			enabled={params.enabled}
			columns={3}
			onToggle={() => setFxSlotEnabled(slot, !params.enabled)}
		>
			<div className="grid grid-cols-4 gap-1 w-full col-span-3">
				{(["sine", "tri", "sq", "saw"] as const).map((w, i) => (
					<Button
						key={w}
						className={`btn btn-xs ${
							params.waveform === i + 1 ? "btn-secondary" : "btn-outline"
						}`}
						onClick={() => setFxSlotParams(slot, { waveform: i + 1 })}
						title={`Select ${w} vibrato waveform.`}
					>
						{w}
					</Button>
				))}
			</div>
			<ControlKnob
				value={params.rate}
				onChange={(value) => setFxSlotParams(slot, { rate: value })}
				min={0}
				max={99}
				defaultValue={65}
				size={52}
				color="#307948"
				label="Rate"
				valueFormatter={(v) => `${Math.round(v)}`}
				modDestination="vibratoRate"
			/>
			<ControlKnob
				value={params.depth}
				onChange={(value) => setFxSlotParams(slot, { depth: value })}
				min={0}
				max={99}
				defaultValue={20}
				size={52}
				color="#307948"
				label="Depth"
				valueFormatter={(v) => `${Math.round(v)}`}
				modDestination="vibratoDepth"
			/>
			<ControlKnob
				value={params.delay}
				onChange={(value) => setFxSlotParams(slot, { delay: value })}
				min={0}
				max={5000}
				defaultValue={0}
				size={52}
				color="#307948"
				label="Delay"
				valueFormatter={(v) => `${Math.round(v)}ms`}
				modDestination="vibratoDelay"
			/>
		</ModuleFrame>
	);
}
