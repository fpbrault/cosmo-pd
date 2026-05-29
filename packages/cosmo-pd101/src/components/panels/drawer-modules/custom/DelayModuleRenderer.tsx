import FxSlotKnob from "@/components/panels/drawer-modules/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import ModuleFrame from "@/components/primitives/ModuleFrame";

const MODE_OPTIONS = [
	{ value: 0, label: "Digital" },
	{ value: 1, label: "Tape" },
	{ value: 2, label: "BBD" },
	{ value: 3, label: "Stereo" },
] as const;

const EXTRA_LABEL_BY_MODE = ["", "Warmth", "Modulation", "Spread"] as const;
const EXTRA_TOOLTIP_BY_MODE = [
	"",
	"Adds tape-style saturation and high-frequency rolloff.",
	"Adds analog BBD-style modulation and filtering.",
	"Controls stereo spread width and spatial placement.",
] as const;

export default function DelayModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		presetOptions,
		setFxSlotParams,
		params,
		enabled,
		handlePresetChange,
		builtinPresetIds,
		handleSavePreset,
		handleDeletePreset,
	} = useFxSlotModule();
	const mode = Math.min(Math.max(Math.round(Number(params.mode) || 0), 0), 3);
	const showExtra = mode !== 0;
	const extraLabel = EXTRA_LABEL_BY_MODE[mode];

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={2}
			enabled={enabled}
			onToggleEnabled={() => setFxSlotParams(slot, { enabled: !enabled })}
			presetValue={selectedPreset}
			presetOptions={presetOptions}
			onPresetChange={handlePresetChange}
			builtinPresetIds={builtinPresetIds}
			onSavePreset={handleSavePreset}
			onDeletePreset={handleDeletePreset}
		>
			<div style={{ gridColumn: "1 / -1" }} className="w-full">
				<div className="join w-full overflow-hidden rounded-md border border-cz-border/65">
					{MODE_OPTIONS.map((option) => (
						<button
							key={option.value}
							type="button"
							className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
								params.mode === option.value
									? "border-amber-500/60 bg-amber-500/20 text-amber-300"
									: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
							}`}
							onClick={() => setFxSlotParams(slot, { mode: option.value })}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>
			<FxSlotKnob param="time" metaParamKey="delayTime" size={64} sync />
			<FxSlotKnob param="feedback" metaParamKey="delayFeedback" size={64} />
			{showExtra ? (
				<FxSlotKnob
					param="extra"
					label={extraLabel}
					tooltip={EXTRA_TOOLTIP_BY_MODE[mode]}
					metaParamKey="delayWarmth"
					size={64}
				/>
			) : null}
			<div
				className="flex justify-center"
				style={showExtra ? undefined : { gridColumn: "1 / -1" }}
			>
				<FxSlotKnob param="mix" metaParamKey="delayMix" size={64} />
			</div>
		</ModuleFrame>
	);
}
