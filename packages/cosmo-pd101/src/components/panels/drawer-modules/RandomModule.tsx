import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";

export default function RandomModule() {
	return (
		<ModuleFrame
			title="Random"
			color="#c2571a"
			enabled
			columns={1}
			presetValue=""
			presetOptions={[]}
			onPresetChange={() => {}}
			presetDisabled
		>
			<SynthParamKnob paramKey="randomRate" color="#c2571a" label="Rate" />
		</ModuleFrame>
	);
}
