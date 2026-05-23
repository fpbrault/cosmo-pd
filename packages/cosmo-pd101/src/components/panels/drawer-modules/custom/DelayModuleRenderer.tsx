import {
	asNumber,
	getTooltip,
} from "@/components/panels/drawer-modules/custom/utils";
import FxSlotKnob from "@/components/panels/drawer-modules/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import BadgeToggle from "@/components/primitives/BadgeToggle";
import ModuleFrame from "@/components/primitives/ModuleFrame";

export default function DelayModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		setFxSlotParams,
		params,
		enabled,
		handlePresetChange,
	} = useFxSlotModule();
	const tapeMode = asNumber(params.tapeMode, 0) === 1;
	const columns = tapeMode ? 4 : 3;
	const modeLabel = tapeMode ? "Tape Echo" : "Digital";

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			meta={modeLabel}
			columns={columns}
			enabled={enabled}
			presetTitle={config.presetTitle}
			presetValue={selectedPreset}
			presetOptions={config.presets}
			onPresetChange={handlePresetChange}
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
