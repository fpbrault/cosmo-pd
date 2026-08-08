import SynthParamKnob from "@/components/controls/parameters/SynthParamKnob";
import { useSynthParam } from "@/features/synth/SynthParamController";

export default function MasterVolumeControl() {
	const { value: volume, setValue: setVolume } = useSynthParam("volume");

	return (
		<div className="shrink-0">
			<SynthParamKnob
				paramKey="volume"
				value={volume as number}
				size={64}
				onChange={setVolume}
				color="white"
				label="Main Volume"
				modDestination="volume"
			/>
		</div>
	);
}
