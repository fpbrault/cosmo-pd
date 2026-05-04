import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import {
	asNumber,
	getKnobControl,
	getTooltip,
	resolveEnabled,
	resolvePresetPatchParams,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";

export default function DelayModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const tapeModeHoverHandlers = useHoverInfoHandlers(
		getTooltip("delayTapeMode"),
	);
	const rawSlot = useSynthStore((state) => state.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);

	if (rawSlot?.type !== config.type) {
		return null;
	}

	const params = (rawSlot as { params: Record<string, unknown> }).params;
	const enabled = resolveEnabled(params);
	const tapeMode = asNumber(params.tapeMode, 0) === 1;
	const columns = tapeMode ? 4 : 3;
	const timeControl = getKnobControl(config, "time");
	const feedbackControl = getKnobControl(config, "feedback");
	const warmthControl = getKnobControl(config, "warmth");
	const mixControl = getKnobControl(config, "mix");
	const modeLabel = tapeMode ? "Tape Echo" : "Digital";

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = config.presets.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		const patchParams = resolvePresetPatchParams(
			config,
			preset.patch as Record<string, unknown>,
		);
		if (!patchParams) {
			return;
		}

		setFxSlotParams(slot, patchParams);
		requestApplyModulePreset({
			module: config.moduleKey,
			preset: preset.id,
			patch: preset.patch,
		});
	};

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			meta={modeLabel}
			columns={columns}
			enabled={enabled}
			onToggle={() => setFxSlotParams(slot, { enabled: !enabled })}
			headerControl={
				<ModulePresetPopover
					title={config.presetTitle}
					value={selectedPreset}
					options={config.presets}
					onChange={handlePresetChange}
					accentColor={config.color}
				/>
			}
		>
			<Button
				type="button"
				onClick={() => setFxSlotParams(slot, { tapeMode: tapeMode ? 0 : 1 })}
				data-hover-info={getTooltip("delayTapeMode")}
				{...tapeModeHoverHandlers}
				className={`btn btn-xs h-8 min-h-0 justify-self-center px-4 col-span-full ${
					tapeMode
						? "border-amber-500/60 bg-amber-500/20 text-amber-300"
						: "border-cz-border bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
				}`}
			>
				{tapeMode ? "● TAPE" : "○ TAPE"}
			</Button>
			{timeControl ? (
				<ControlKnob
					value={asNumber(params.time, timeControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { time: value })}
					min={timeControl.min}
					max={timeControl.max}
					defaultValue={timeControl.defaultValue}
					size={52}
					color={config.color}
					label="Time"
					tooltip={getTooltip("delayTime")}
					valueFormatter={timeControl.formatter}
				/>
			) : null}
			{feedbackControl ? (
				<ControlKnob
					value={asNumber(params.feedback, feedbackControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { feedback: value })}
					min={feedbackControl.min}
					max={feedbackControl.max}
					defaultValue={feedbackControl.defaultValue}
					size={52}
					color={config.color}
					label="Fdbk"
					tooltip={getTooltip("delayFeedback")}
					valueFormatter={feedbackControl.formatter}
				/>
			) : null}
			{tapeMode && warmthControl ? (
				<ControlKnob
					value={asNumber(params.warmth, warmthControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { warmth: value })}
					min={warmthControl.min}
					max={warmthControl.max}
					defaultValue={warmthControl.defaultValue}
					size={52}
					color={config.color}
					label="Warmth"
					tooltip={getTooltip("delayWarmth")}
					valueFormatter={warmthControl.formatter}
				/>
			) : null}
			{mixControl ? (
				<ControlKnob
					value={asNumber(params.mix, mixControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { mix: value })}
					min={mixControl.min}
					max={mixControl.max}
					defaultValue={mixControl.defaultValue}
					size={52}
					color={config.color}
					label="Mix"
					tooltip={getTooltip("delayMix")}
					valueFormatter={mixControl.formatter}
				/>
			) : null}
		</ModuleFrame>
	);
}
