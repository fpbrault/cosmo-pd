import {
	getKnobControl,
	getModDestinationByParam,
} from "@/components/panels/drawer-modules/custom/utils";
import { useFxSlotModule } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import FxSlotSlider from "@/components/panels/drawer-modules/FxSlotSlider";
import FxVerticalSliderGroup from "@/components/panels/drawer-modules/FxVerticalSliderGroup";
import ModuleFrame from "@/components/primitives/ModuleFrame";

const EQ_BANDS = [
	{ param: "gain80", label: "80" },
	{ param: "gain240", label: "240" },
	{ param: "gain750", label: "750" },
	{ param: "gain2200", label: "2.2k" },
	{ param: "gain8000", label: "8k" },
] as const;

export default function Eq5BandModuleRenderer() {
	const {
		config,
		slot,
		selectedPreset,
		enabled,
		handlePresetChange,
		params,
		setFxSlotParams,
	} = useFxSlotModule();
	const modDestinationByParam = getModDestinationByParam(config.type);

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={5}
			enabled={enabled}
			presetValue={selectedPreset}
			presetOptions={config.presets}
			onPresetChange={handlePresetChange}
		>
			<div className="col-span-full rounded-md bg-cz-inset/25 px-2 pt-2 pb-1.5">
				<FxVerticalSliderGroup rulerTopOffset={17} rulerHeight={122}>
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
									trackThickness={20}
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
