import FxSlotKnob from "@/components/panels/effects/modules/controls/FxSlotKnob";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import { getTooltip } from "@/components/panels/effects/modules/custom/utils";
import BadgeToggle from "@/components/primitives/buttons/BadgeToggle";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";

export default function PhaseModModuleRenderer() {
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
	const pmPreEnabled = Boolean(params.pmPre);

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
			<BadgeToggle
				active={pmPreEnabled}
				label="Pre"
				onClick={() => setFxSlotParams(slot, { pmPre: !pmPreEnabled })}
				tooltip={getTooltip("pmPre")}
				className="col-span-2"
			/>
			<FxSlotKnob
				param="intPmAmount"
				valueParam={["amount", "intPmAmount"]}
				writeParam="amount"
				size={64}
			/>
			<FxSlotKnob
				param="intPmRatio"
				valueParam={["ratio", "intPmRatio"]}
				writeParam="ratio"
				size={64}
			/>
		</ModuleFrame>
	);
}
