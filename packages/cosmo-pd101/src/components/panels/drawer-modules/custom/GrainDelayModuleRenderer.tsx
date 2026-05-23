import FxSlotKnob from "@/components/panels/drawer-modules/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import ModuleFrame from "@/components/primitives/ModuleFrame";

export default function GrainDelayModuleRenderer() {
	const { config, selectedPreset, enabled, handlePresetChange } =
		useFxSlotModule();

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
			<FxSlotKnob param="time" metaParamKey="grainDelayTime" sync />
			<FxSlotKnob param="feedback" metaParamKey="grainDelayFeedback" />
			<FxSlotKnob param="scatter" metaParamKey="grainDelayScatter" />
			<FxSlotKnob param="density" metaParamKey="grainDelayDensity" />
			<FxSlotKnob param="mix" metaParamKey="grainDelayMix" />
			<FxSlotKnob
				param="pitchSemitones"
				metaParamKey="pitch"
				label="Pitch"
				step={1}
				bipolar
				valueFormatter={(value) =>
					`${value > 0 ? "+" : ""}${Math.round(value)} st`
				}
			/>
		</ModuleFrame>
	);
}
