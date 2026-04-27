import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { DELAY_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";

export default function DelayModule({ slot }: { slot: number }) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const tapeModeHoverHandlers = useHoverInfoHandlers(
		PARAM_META.delayTapeMode?.tooltip,
	);
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);
	if (rawSlot?.type !== "delay") return null;
	const delay = rawSlot.params;
	const delayModeLabel = delay.tapeMode ? "Tape Echo" : "Digital";

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);

		const preset = DELAY_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setFxSlotParams(slot, preset.patch.delay);
		requestApplyModulePreset({
			module: "delay",
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title="Delay"
			color="#fbbf24"
			headerControl={
				<ModulePresetPopover
					title="Delay Presets"
					value={selectedPreset}
					options={DELAY_PRESETS}
					onChange={handlePresetChange}
					accentColor="#fbbf24"
				/>
			}
			meta={delayModeLabel}
			columns={delay.tapeMode ? 4 : 3}
			enabled={delay.enabled ?? false}
			onToggle={() => setFxSlotParams(slot, { enabled: !delay.enabled })}
		>
			<Button
				type="button"
				onClick={() => setFxSlotParams(slot, { tapeMode: !delay.tapeMode })}
				data-hover-info={PARAM_META.delayTapeMode?.tooltip}
				{...tapeModeHoverHandlers}
				className={`btn btn-xs justify-self-center grow col-span-${delay.tapeMode ? 4 : 3} ${
					delay.tapeMode
						? "border-amber-500/60 bg-amber-500/20 text-amber-300"
						: "border-cz-border bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
				}`}
			>
				{delay.tapeMode ? "● TAPE" : "○ TAPE"}
			</Button>
			<ControlKnob
				value={delay.time}
				onChange={(value) => setFxSlotParams(slot, { time: value })}
				min={0.01}
				max={1}
				defaultValue={0.3}
				size={52}
				color="#fbbf24"
				label="Time"
				tooltip={PARAM_META.delayTime?.tooltip}
				valueFormatter={(value) => `${Math.round(value * 1000)}ms`}
			/>
			<ControlKnob
				value={delay.feedback}
				onChange={(value) => setFxSlotParams(slot, { feedback: value })}
				min={0}
				max={0.9}
				defaultValue={0.3}
				size={52}
				color="#fbbf24"
				label="Fdbk"
				tooltip={PARAM_META.delayFeedback?.tooltip}
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
			{delay.tapeMode && (
				<ControlKnob
					value={delay.warmth ?? 0.5}
					onChange={(value) => setFxSlotParams(slot, { warmth: value })}
					min={0}
					max={1}
					defaultValue={0.5}
					size={52}
					color="#f59e0b"
					label="Warmth"
					tooltip={PARAM_META.delayWarmth?.tooltip}
					valueFormatter={(value) => `${Math.round(value * 100)}%`}
				/>
			)}
			<ControlKnob
				value={delay.mix}
				onChange={(value) => setFxSlotParams(slot, { mix: value })}
				min={0}
				max={1}
				defaultValue={0.25}
				size={52}
				color="#fbbf24"
				label="Mix"
				tooltip={PARAM_META.delayMix?.tooltip}
				valueFormatter={(value) => `${Math.round(value * 100)}%`}
			/>
		</ModuleFrame>
	);
}
