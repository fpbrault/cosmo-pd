import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { JUNO_CHORUS_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#22d3ee";

const JUNO_MODES = [
	{ value: 0, label: "I" },
	{ value: 1, label: "II" },
	{ value: 2, label: "I+II" },
];

export default function JunoChorusModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "junoChorus") return null;
	const junoChorus = rawSlot.params;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = JUNO_CHORUS_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setFxSlotParams(slot, preset.patch.junoChorus);
		requestApplyModulePreset({
			module: "junoChorus",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Juno Chorus"
			color={COLOR}
			columns={2}
			headerControl={
				<ModulePresetPopover
					title="Juno Chorus Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...JUNO_CHORUS_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={junoChorus.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !junoChorus.enabled })}
		>
			<div className="flex flex-col gap-1">
				<span className="text-xs text-center opacity-60">Mode</span>
				<div className="join">
					{JUNO_MODES.map((m) => (
						<button
							key={m.value}
							type="button"
							className={`join-item btn btn-xs ${(junoChorus.mode ?? 0) === m.value ? "btn-primary" : "btn-ghost"}`}
							onClick={() => setFxSlotParams(slot, { mode: m.value })}
						>
							{m.label}
						</button>
					))}
				</div>
			</div>
			<ControlKnob
				value={junoChorus.mix ?? 0.5}
				onChange={(v) => setFxSlotParams(slot, { mix: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Mix"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
		</ModuleFrame>
	);
}
