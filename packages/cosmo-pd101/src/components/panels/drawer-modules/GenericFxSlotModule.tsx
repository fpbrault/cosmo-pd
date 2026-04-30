import { useMemo, useState } from "react";
import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import { FX_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";

type EngineKnobMeta = {
	min?: number;
	max?: number;
	defaultValue?: number;
};

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

	// Build a param→modDestinationKey lookup from FX_DEFINITIONS_V1
	const modDestinationByParam = useMemo(() => {
		const def = FX_DEFINITIONS_V1.find((d) => d.slotType === config.type);
		const map: Record<string, string> = {};
		if (def) {
			for (const ctrl of def.controls) {
				if (ctrl.modDestinationKey) {
					map[ctrl.id] = ctrl.modDestinationKey;
				}
			}
		}
		return map;
	}, [config.type]);

	const knobMetaByParam = useMemo(() => {
		const def = FX_DEFINITIONS_V1.find((d) => d.slotType === config.type);
		const map: Record<string, EngineKnobMeta> = {};
		if (def) {
			for (const ctrl of def.controls) {
				if (ctrl.kind !== "knob") {
					continue;
				}
				map[ctrl.id] = {
					min: ctrl.min ?? undefined,
					max: ctrl.max ?? undefined,
					defaultValue: ctrl.defaultF32 ?? undefined,
				};
			}
		}
		return map;
	}, [config.type]);

	if (rawSlot?.type !== config.type) return null;
	const params = (rawSlot as { params: Record<string, unknown> }).params;
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
					(() => {
						const engineMeta = knobMetaByParam[ctrl.param];
						const min = engineMeta?.min ?? ctrl.min;
						const max = engineMeta?.max ?? ctrl.max;
						const defaultValue = engineMeta?.defaultValue ?? ctrl.defaultValue;
						return (
							<ControlKnob
								key={ctrl.param}
								value={(params[ctrl.param] as number) ?? defaultValue}
								onChange={(v) => setFxSlotParams(slot, { [ctrl.param]: v })}
								min={min}
								max={max}
								defaultValue={defaultValue}
								size={ctrl.size ?? 40}
								color={config.color}
								label={ctrl.label}
								valueFormatter={ctrl.formatter}
								modDestination={
									modDestinationByParam[ctrl.param] as
										| ModDestination
										| undefined
								}
							/>
						);
					})()
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
