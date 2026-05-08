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

function clampToColumns(value: number, columns: number) {
	return Math.min(Math.max(value, 1), columns);
}

function clampGridColumns(columns: number) {
	return Math.min(Math.max(Math.floor(columns), 1), 6);
}

function resolveGridPlacementStyle({
	colSpan,
	colStart,
	row,
	columns,
}: {
	colSpan?: number;
	colStart?: number;
	row?: number;
	columns: number;
}): React.CSSProperties {
	const safeColSpan = clampToColumns(colSpan ?? 1, columns);
	const safeColStart = colStart ? clampToColumns(colStart, columns) : undefined;
	const style: React.CSSProperties = {
		gridColumn: safeColStart
			? `${safeColStart} / span ${safeColSpan}`
			: `span ${safeColSpan}`,
	};

	if (typeof row === "number" && Number.isFinite(row)) {
		style.gridRowStart = Math.max(1, Math.floor(row) + 1);
	}

	return style;
}

function resolveButtonGroupSpan(
	options: { value: number; label: string }[],
	columns: number,
) {
	if (columns <= 1) {
		return 1;
	}

	const needsExtraWidth =
		options.length >= 3 || options.some((opt) => opt.label.length > 4);
	return needsExtraWidth ? 2 : 1;
}

function resolveBinaryToggleState(
	options: { value: number; label: string }[],
	value: unknown,
) {
	if (options.length < 2) {
		return null;
	}

	const offOption = options[0];
	const onOption = options[1];
	const isOn = value === onOption.value;

	return {
		offOption,
		onOption,
		isOn,
	};
}

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
	const defaultColumns = clampGridColumns(config.columns ?? 4);
	const dynamicColumnRule = config.dynamicColumns;
	const dynamicColumns = dynamicColumnRule
		? params[dynamicColumnRule.param] === dynamicColumnRule.equals
			? dynamicColumnRule.columns
			: (dynamicColumnRule.otherwiseColumns ?? defaultColumns)
		: defaultColumns;
	const moduleColumns = clampGridColumns(dynamicColumns);
	const visibleControls = config.controls
		.filter((ctrl) => {
			if (!ctrl.visibleWhen) {
				return true;
			}
			return params[ctrl.visibleWhen.param] === ctrl.visibleWhen.equals;
		})
		.slice()
		.sort((a, b) => {
			const rowA = a.row ?? Number.MAX_SAFE_INTEGER;
			const rowB = b.row ?? Number.MAX_SAFE_INTEGER;
			if (rowA !== rowB) {
				return rowA - rowB;
			}

			const orderA = a.order ?? a.sourceIndex;
			const orderB = b.order ?? b.sourceIndex;
			if (orderA !== orderB) {
				return orderA - orderB;
			}

			return a.sourceIndex - b.sourceIndex;
		});

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
			columns={moduleColumns}
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
			{visibleControls.map((ctrl) =>
				ctrl.kind === "knob"
					? (() => {
							const engineMeta = knobMetaByParam[ctrl.param];
							const min = engineMeta?.min ?? ctrl.min;
							const max = engineMeta?.max ?? ctrl.max;
							const defaultValue =
								engineMeta?.defaultValue ?? ctrl.defaultValue;
							const gridPlacementStyle = resolveGridPlacementStyle({
								colSpan: ctrl.colSpan,
								colStart: ctrl.colStart,
								row: ctrl.row,
								columns: moduleColumns,
							});
							return (
								<div
									key={ctrl.param}
									className="min-w-0"
									style={gridPlacementStyle}
								>
									<ControlKnob
										value={(params[ctrl.param] as number) ?? defaultValue}
										onChange={(v) => setFxSlotParams(slot, { [ctrl.param]: v })}
										min={min}
										max={max}
										defaultValue={defaultValue}
										size={ctrl.size ?? 48}
										color={config.color}
										label={ctrl.label}
										valueFormatter={ctrl.formatter}
										modDestination={
											modDestinationByParam[ctrl.param] as
												| ModDestination
												| undefined
										}
									/>
								</div>
							);
						})()
					: (() => {
							const fallbackColSpan = resolveButtonGroupSpan(
								ctrl.options,
								moduleColumns,
							);
							const gridPlacementStyle = resolveGridPlacementStyle({
								colSpan: ctrl.colSpan ?? fallbackColSpan,
								colStart: ctrl.colStart,
								row: ctrl.row,
								columns: moduleColumns,
							});
							const binaryToggleState =
								ctrl.buttonPresentation === "compactBinaryToggle"
									? resolveBinaryToggleState(ctrl.options, params[ctrl.param])
									: null;
							const groupAlignment = ctrl.centered
								? "items-center"
								: "items-stretch";
							return (
								<div
									key={ctrl.param}
									className="min-w-0"
									style={gridPlacementStyle}
								>
									<div className={`flex flex-col gap-1.5 ${groupAlignment}`}>
										{!ctrl.hideLabel && (
											<span className="text-center text-3xs text-base-content/58 uppercase tracking-[0.2em]">
												{ctrl.label}
											</span>
										)}
										{binaryToggleState ? (
											<Button
												type="button"
												onClick={() =>
													setFxSlotParams(slot, {
														[ctrl.param]: binaryToggleState.isOn
															? binaryToggleState.offOption.value
															: binaryToggleState.onOption.value,
													})
												}
												className={`btn btn-xs h-8 min-h-0 justify-self-center px-4 ${
													binaryToggleState.isOn
														? "border-amber-500/60 bg-amber-500/20 text-amber-300"
														: "border-cz-border bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
												}`}
											>
												{binaryToggleState.isOn
													? `● ${binaryToggleState.onOption.label.toUpperCase()}`
													: `○ ${binaryToggleState.onOption.label.toUpperCase()}`}
											</Button>
										) : (
											<div className="join w-full overflow-hidden rounded-md border border-cz-border/65">
												{ctrl.options.map((opt) => (
													<Button
														key={opt.value}
														type="button"
														className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
															(params[ctrl.param] as number) === opt.value
																? "border-amber-500/60 bg-amber-500/20 text-amber-300"
																: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
														}`}
														onClick={() =>
															setFxSlotParams(slot, { [ctrl.param]: opt.value })
														}
													>
														{opt.label}
													</Button>
												))}
											</div>
										)}
									</div>
								</div>
							);
						})(),
			)}
		</ModuleFrame>
	);
}
