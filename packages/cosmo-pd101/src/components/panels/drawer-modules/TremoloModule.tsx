import { useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { TREMOLO_PRESETS } from "@/lib/synth/modulePresets";

const COLOR = "#4ade80";

const WAVEFORMS = [
	{ value: 0, label: "Sine" },
	{ value: 1, label: "Tri" },
	{ value: 2, label: "Sqr" },
];

export default function TremoloModule() {
	const [selectedPreset, setSelectedPreset] = useState<string>("custom");
	const tremolo = useSynthStore((s) => s.tremolo);
	const setTremolo = useSynthStore((s) => s.setTremolo);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		if (presetId === "custom") return;
		const preset = TREMOLO_PRESETS.find((e) => e.id === presetId);
		if (!preset) return;
		setTremolo(preset.patch.tremolo);
		requestApplyModulePreset({
			module: "tremolo",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Tremolo"
			color={COLOR}
			columns={2}
			headerControl={
				<ModulePresetPopover
					title="Tremolo Presets"
					value={selectedPreset}
					options={[{ id: "custom", label: "Custom" }, ...TREMOLO_PRESETS]}
					onChange={handlePresetChange}
				/>
			}
			enabled={tremolo.enabled ?? false}
			onToggle={() => setTremolo({ ...tremolo, enabled: !tremolo.enabled })}
		>
			<ControlKnob
				value={tremolo.rate ?? 4}
				onChange={(v) => setTremolo({ ...tremolo, rate: v })}
				min={0.1}
				max={20}
				defaultValue={4}
				size={52}
				color={COLOR}
				label="Rate"
				valueFormatter={(v) => `${v.toFixed(1)}Hz`}
			/>
			<ControlKnob
				value={tremolo.depth ?? 0.5}
				onChange={(v) => setTremolo({ ...tremolo, depth: v })}
				min={0}
				max={1}
				defaultValue={0.5}
				size={52}
				color={COLOR}
				label="Depth"
				valueFormatter={(v) => `${Math.round(v * 100)}%`}
			/>
			<div className="flex flex-col gap-1">
				<span className="text-xs text-center opacity-60">Wave</span>
				<div className="join">
					{WAVEFORMS.map((w) => (
						<button
							key={w.value}
							type="button"
							className={`join-item btn btn-xs ${(tremolo.waveform ?? 0) === w.value ? "btn-primary" : "btn-ghost"}`}
							onClick={() => setTremolo({ ...tremolo, waveform: w.value })}
						>
							{w.label}
						</button>
					))}
				</div>
			</div>
			<ControlKnob
				value={tremolo.mix ?? 1}
				onChange={(v) => setTremolo({ ...tremolo, mix: v })}
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
