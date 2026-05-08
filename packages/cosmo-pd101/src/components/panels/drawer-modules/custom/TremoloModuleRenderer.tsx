import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import {
	asNumber,
	getButtonGroupControl,
	getKnobControl,
	getModDestinationByParam,
	getTooltip,
	resolveEnabled,
	resolvePresetPatchParams,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";

export default function TremoloModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((state) => state.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);

	if (rawSlot?.type !== config.type) {
		return null;
	}

	const params = (rawSlot as { params: Record<string, unknown> }).params;
	const enabled = resolveEnabled(params);
	const waveformControl = getButtonGroupControl(config, "waveform");
	const rateControl = getKnobControl(config, "rate");
	const depthControl = getKnobControl(config, "depth");
	const mixControl = getKnobControl(config, "mix");
	const waveformValue = asNumber(params.waveform, 0);
	const modDestinationByParam = getModDestinationByParam(config.type);

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
			columns={3}
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
			<div className="join col-span-3 w-full overflow-hidden rounded-md border border-cz-border/65">
				{waveformControl?.options.map((option) => (
					<Button
						key={option.value}
						type="button"
						className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
							waveformValue === option.value
								? "border-amber-500/60 bg-amber-500/20 text-amber-300"
								: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
						}`}
						onClick={() => setFxSlotParams(slot, { waveform: option.value })}
					>
						{option.label}
					</Button>
				))}
			</div>
			{rateControl ? (
				<ControlKnob
					value={asNumber(params.rate, rateControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { rate: value })}
					min={rateControl.min}
					max={rateControl.max}
					defaultValue={rateControl.defaultValue}
					color={config.color}
					label="Rate"
					tooltip={getTooltip("tremoloRate")}
					valueFormatter={rateControl.formatter}
					modDestination={modDestinationByParam.rate}
				/>
			) : null}
			{depthControl ? (
				<ControlKnob
					value={asNumber(params.depth, depthControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { depth: value })}
					min={depthControl.min}
					max={depthControl.max}
					defaultValue={depthControl.defaultValue}
					color={config.color}
					label="Depth"
					tooltip={getTooltip("tremoloDepth")}
					valueFormatter={depthControl.formatter}
					modDestination={modDestinationByParam.depth}
				/>
			) : null}
			{mixControl ? (
				<ControlKnob
					value={asNumber(params.mix, mixControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { mix: value })}
					min={mixControl.min}
					max={mixControl.max}
					defaultValue={mixControl.defaultValue}
					color={config.color}
					label="Mix"
					tooltip={getTooltip("tremoloMix")}
					valueFormatter={mixControl.formatter}
					modDestination={modDestinationByParam.mix}
				/>
			) : null}
		</ModuleFrame>
	);
}
