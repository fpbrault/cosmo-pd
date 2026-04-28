import { useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotModuleConfig } from "./fxSlotModuleConfig";

export default function GenericFxSlotModule({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	const setFxSlotParams = useSynthStore((s) => s.setFxSlotParams);

	if (rawSlot?.type !== config.type) return null;
	const params = rawSlot.params as Record<string, unknown>;
	const enabled = (params.enabled as boolean) ?? false;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = config.presets.find((e) => e.id === presetId);
		if (!preset) return;
		const patchParams = (preset.patch as Record<string, unknown>)[
			config.patchKey
		] as Record<string, unknown>;
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
			meta={config.meta}
			columns={config.columns}
			headerControl={
				<ModulePresetPopover
					title={config.presetTitle}
					value={selectedPreset}
					options={config.presets}
					onChange={handlePresetChange}
					accentColor={config.color}
				/>
			}
			enabled={enabled}
			onToggle={() => setFxSlotParams(slot, { enabled: !enabled })}
		>
			{config.controls.map((ctrl) =>
				ctrl.kind === "knob" ? (
					<ControlKnob
						key={ctrl.param}
						value={(params[ctrl.param] as number) ?? ctrl.defaultValue}
						onChange={(v) => setFxSlotParams(slot, { [ctrl.param]: v })}
						min={ctrl.min}
						max={ctrl.max}
						defaultValue={ctrl.defaultValue}
						size={ctrl.size ?? 40}
						color={config.color}
						label={ctrl.label}
						valueFormatter={ctrl.formatter}
					/>
				) : (
					<div key={ctrl.param} className="flex flex-col gap-1">
						<span className="text-xs text-center opacity-60">{ctrl.label}</span>
						<div className="join">
							{ctrl.options.map((opt) => (
								<Button
									key={opt.value}
									type="button"
									className={
										(params[ctrl.param] as number) === opt.value
											? "join-item btn btn-sm btn-primary"
											: "join-item btn btn-sm btn-outline btn-primary"
									}
									onClick={() =>
										setFxSlotParams(slot, { [ctrl.param]: opt.value })
									}
								>
									{opt.label}
								</Button>
							))}
						</div>
					</div>
				),
			)}
		</ModuleFrame>
	);
}
