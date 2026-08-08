import FxSlotSlider from "@/components/panels/effects/modules/controls/FxSlotSlider";
import FxVerticalSliderGroup from "@/components/panels/effects/modules/controls/FxVerticalSliderGroup";
import { useFxSlotModule } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import {
	getKnobControl,
	getModDestinationByParam,
} from "@/components/panels/effects/modules/custom/utils";
import ModuleFrame from "@/components/primitives/containers/ModuleFrame";

const EQ_BANDS = [
	{ param: "gainBand1", label: "64" },
	{ param: "gainBand2", label: "125" },
	{ param: "gainBand3", label: "250" },
	{ param: "gainBand4", label: "500" },
	{ param: "gainBand5", label: "1k" },
	{ param: "gainBand6", label: "2k" },
	{ param: "gainBand7", label: "4k" },
	{ param: "gainBand8", label: "8k" },
] as const;

export default function Eq8BandModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		presetOptions,
		enabled,
		handlePresetChange,
		params,
		setFxSlotParams,
		builtinPresetIds,
		handleSavePreset,
		handleDeletePreset,
	} = useFxSlotModule();
	const modDestinationByParam = getModDestinationByParam(config.type);

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={8}
			enabled={enabled}
			onToggleEnabled={() => setFxSlotParams(slot, { enabled: !enabled })}
			presetValue={selectedPreset}
			presetOptions={presetOptions}
			onPresetChange={handlePresetChange}
			builtinPresetIds={builtinPresetIds}
			onSavePreset={handleSavePreset}
			onDeletePreset={handleDeletePreset}
		>
			<div className="col-span-full rounded-md bg-cz-inset/25 px-2 pt-2 pb-1.5">
				<FxVerticalSliderGroup
					rulerTopOffset={17}
					rulerHeight={122}
					rulerLaneWidthClassName="w-1.5"
					rulerTickWidthMajor={8}
					rulerTickWidthMinor={4}
				>
					{EQ_BANDS.map((band) => {
						const control = getKnobControl(config, band.param);
						const sourceIndex = control?.sourceIndex ?? 0;
						const value =
							typeof params[band.param] === "number"
								? (params[band.param] as number)
								: 0;
						return (
							<div
								key={band.param}
								className="flex min-w-0 flex-col items-center"
							>
								<FxSlotSlider
									value={value}
									min={-12}
									max={12}
									step={0.1}
									onChange={(next) =>
										setFxSlotParams(slot, { [band.param]: next })
									}
									orientation="vertical"
									label={band.label}
									tooltip={band.label}
									color="#fbbf24"
									trackLength={122}
									trackThickness={14}
									modDestination={modDestinationByParam[band.param]}
									midiTargetKey={`fxSlot${slot + 1}Knob${sourceIndex + 1}`}
									midiLabel={`FX ${slot + 1} Knob ${sourceIndex + 1}`}
									centerDetent
									centerDetentThreshold={0.35}
									curveMode="fine"
									valueFormatter={(next) =>
										`${next >= 0 ? "+" : ""}${next.toFixed(1)} dB`
									}
								/>
							</div>
						);
					})}
				</FxVerticalSliderGroup>
			</div>
		</ModuleFrame>
	);
}
