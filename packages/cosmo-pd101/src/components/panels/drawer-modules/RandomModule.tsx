import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { useSynthParam } from "@/features/synth/SynthParamController";

export default function RandomModule() {
	const { value: randomRate, setValue: setRandomRate } =
		useSynthParam("randomRate");
	return (
		<ModuleFrame title="Random" color="#c2571a" enabled columns={1}>
			<SynthParamKnob
				paramKey="randomRate"
				value={randomRate}
				onChange={setRandomRate}
				size={52}
				color="#c2571a"
				label="Rate"
			/>
		</ModuleFrame>
	);
}
