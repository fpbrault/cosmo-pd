import FxSlotKnob from "@/components/panels/effects/modules/controls/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import {
	asNumber,
	getButtonGroupControl,
	getFxControlOptionLabel,
} from "@/components/panels/effects/modules/custom/utils";
import Button from "@/components/primitives/buttons/Button";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";

export default function VibratoModuleRenderer() {
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
	const waveformControl = getButtonGroupControl(config, "waveform");
	const waveformValue = asNumber(params.waveform, 1);

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={3}
			enabled={enabled}
			onToggleEnabled={() => setFxSlotParams(slot, { enabled: !enabled })}
			presetValue={selectedPreset}
			presetOptions={presetOptions}
			onPresetChange={handlePresetChange}
			builtinPresetIds={builtinPresetIds}
			onSavePreset={handleSavePreset}
			onDeletePreset={handleDeletePreset}
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
						{getFxControlOptionLabel(config.type, "waveform", option.value)}
					</Button>
				))}
			</div>
			<FxSlotKnob param="rate" metaParamKey="vibratoRate" sync />
			<FxSlotKnob param="depth" metaParamKey="vibratoDepth" />
			<FxSlotKnob param="delay" metaParamKey="vibratoDelay" />
		</ModuleFrame>
	);
}
