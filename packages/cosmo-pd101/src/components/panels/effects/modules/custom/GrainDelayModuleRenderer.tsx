import FxSlotKnob from "@/components/panels/effects/modules/controls/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";

export default function GrainDelayModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		presetOptions,
		setFxSlotParams,
		enabled,
		handlePresetChange,
		builtinPresetIds,
		handleSavePreset,
		handleDeletePreset,
	} = useFxSlotModule();

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
