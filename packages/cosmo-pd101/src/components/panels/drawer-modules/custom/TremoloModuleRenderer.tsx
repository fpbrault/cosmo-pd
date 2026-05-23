import Button from "@/components/controls/Button";
import {
	asNumber,
	getButtonGroupControl,
	getFxControlOptionLabel,
} from "@/components/panels/drawer-modules/custom/utils";
import FxSlotKnob from "@/components/panels/drawer-modules/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import ModuleFrame from "@/components/primitives/ModuleFrame";

export default function TremoloModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		setFxSlotParams,
		params,
		enabled,
		handlePresetChange,
	} = useFxSlotModule();
	const waveformControl = getButtonGroupControl(config, "waveform");
	const waveformValue = asNumber(params.waveform, 0);

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={3}
			enabled={enabled}
			presetTitle={config.presetTitle}
			presetValue={selectedPreset}
			presetOptions={config.presets}
			onPresetChange={handlePresetChange}
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
			<FxSlotKnob param="rate" metaParamKey="tremoloRate" sync />
			<FxSlotKnob param="depth" metaParamKey="tremoloDepth" />
			<FxSlotKnob param="mix" metaParamKey="tremoloMix" />
		</ModuleFrame>
	);
}
