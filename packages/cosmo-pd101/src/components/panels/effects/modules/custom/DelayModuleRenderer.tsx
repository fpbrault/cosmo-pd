import FxSlotKnob from "@/components/panels/effects/modules/controls/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import {
	asNumber,
	getTooltip,
} from "@/components/panels/effects/modules/custom/utils";
import BadgeToggle from "@/components/primitives/buttons/BadgeToggle";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";

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
	const tapeMode = asNumber(params.tapeMode, 0) === 1;
	const columns = tapeMode ? 4 : 3;
	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={columns}
			enabled={enabled}
			onToggleEnabled={() => setFxSlotParams(slot, { enabled: !enabled })}
			presetValue={selectedPreset}
			presetOptions={presetOptions}
			onPresetChange={handlePresetChange}
			builtinPresetIds={builtinPresetIds}
			onSavePreset={handleSavePreset}
			onDeletePreset={handleDeletePreset}
		>
			<BadgeToggle
				active={tapeMode}
				label="Tape"
				onClick={() => setFxSlotParams(slot, { tapeMode: tapeMode ? 0 : 1 })}
				tooltip={getTooltip("delayTapeMode")}
				className="col-span-full"
			/>
			<FxSlotKnob param="time" metaParamKey="delayTime" size={64} sync />
			<FxSlotKnob param="feedback" metaParamKey="delayFeedback" size={64} />
			{tapeMode ? (
				<FxSlotKnob param="warmth" metaParamKey="delayWarmth" size={64} />
			) : null}
			<FxSlotKnob param="mix" metaParamKey="delayMix" size={64} />
		</ModuleFrame>
	);
}
