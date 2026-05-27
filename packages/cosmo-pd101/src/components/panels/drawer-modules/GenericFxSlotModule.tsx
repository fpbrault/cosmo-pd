import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import {
	getFxControlLabel,
	getFxControlOptionLabel,
} from "@/components/panels/drawer-modules/custom/utils";
import FxSlotKnob from "@/components/panels/drawer-modules/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import type { ButtonGroupControlDef } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";

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
		options.length >= 3 || options.some((option) => option.label.length > 4);
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
	return {
		offOption,
		onOption,
		isOn: value === onOption.value,
	};
}

const FxButtonGroupControl = memo(function FxButtonGroupControl({
	ctrl,
	moduleColumns,
}: {
	ctrl: ButtonGroupControlDef;
	moduleColumns: number;
}) {
	const { config, slot, params, setFxSlotParams } = useFxSlotModule();
	const localizedOptions = ctrl.options.map((option) => ({
		...option,
		label: getFxControlOptionLabel(config.type, ctrl.param, option.value),
	}));
	const fallbackColSpan = resolveButtonGroupSpan(
		localizedOptions,
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
			? resolveBinaryToggleState(localizedOptions, params[ctrl.param])
			: null;
	const resolvedLabel = getFxControlLabel(config.type, ctrl.param);
	const groupAlignment = ctrl.centered ? "items-center" : "items-stretch";

	return (
		<div className="min-w-0" style={gridPlacementStyle}>
			<div className={`flex flex-col gap-1.5 ${groupAlignment}`}>
				{!ctrl.hideLabel ? (
					<span className="text-center text-3xs text-base-content/58 uppercase tracking-[0.2em]">
						{resolvedLabel}
					</span>
				) : null}
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
						{localizedOptions.map((option) => (
							<Button
								key={option.value}
								type="button"
								className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
									params[ctrl.param] === option.value
										? "border-amber-500/60 bg-amber-500/20 text-amber-300"
										: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
								}`}
								onClick={() =>
									setFxSlotParams(slot, { [ctrl.param]: option.value })
								}
							>
								{option.label}
							</Button>
						))}
					</div>
				)}
			</div>
		</div>
	);
});

export default function GenericFxSlotModule() {
	const { t } = useTranslation("synth");
	const {
		config,
		slot,
		selectedPreset,
		presetOptions,
		params,
		enabled,
		setFxSlotParams,
		handlePresetChange,
		builtinPresetIds,
		handleSavePreset,
		handleDeletePreset,
	} = useFxSlotModule();
	const defaultColumns = clampGridColumns(config.columns ?? 4);
	const dynamicColumnRule = config.dynamicColumns;
	const dynamicColumns = dynamicColumnRule
		? params[dynamicColumnRule.param] === dynamicColumnRule.equals
			? dynamicColumnRule.columns
			: (dynamicColumnRule.otherwiseColumns ?? defaultColumns)
		: defaultColumns;
	const moduleColumns = clampGridColumns(dynamicColumns);
	const visibleControls = config.controls
		.filter((control) => {
			if (!control.visibleWhen) {
				return true;
			}
			return params[control.visibleWhen.param] === control.visibleWhen.equals;
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

	const moduleTitle =
		t(`fx.modules.${config.type}.title`, { defaultValue: "" }) || config.title;

	return (
		<ModuleFrame
			title={moduleTitle}
			color={config.color}
			columns={moduleColumns}
			enabled={enabled}
			onToggleEnabled={() => setFxSlotParams(slot, { enabled: !enabled })}
			presetValue={selectedPreset}
			presetOptions={presetOptions}
			onPresetChange={handlePresetChange}
			builtinPresetIds={builtinPresetIds}
			onSavePreset={handleSavePreset}
			onDeletePreset={handleDeletePreset}
		>
			{visibleControls.map((control) =>
				control.kind === "knob" ? (
					<div
						key={control.param}
						className="min-w-0"
						style={resolveGridPlacementStyle({
							colSpan: control.colSpan,
							colStart: control.colStart,
							row: control.row,
							columns: moduleColumns,
						})}
					>
						<FxSlotKnob
							param={control.param}
							control={control}
							color={config.color}
							size={control.size ?? 64}
						/>
					</div>
				) : (
					<FxButtonGroupControl
						key={control.param}
						ctrl={control}
						moduleColumns={moduleColumns}
					/>
				),
			)}
		</ModuleFrame>
	);
}
