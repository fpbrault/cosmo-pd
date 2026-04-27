import { memo } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import BitcrusherModule from "./drawer-modules/BitcrusherModule";
import ChorusModule from "./drawer-modules/ChorusModule";
import CompressorModule from "./drawer-modules/CompressorModule";
import DelayModule from "./drawer-modules/DelayModule";
import DistortionModule from "./drawer-modules/DistortionModule";
import EqModule from "./drawer-modules/EqModule";
import GrainDelayModule from "./drawer-modules/GrainDelayModule";
import JunoChorusModule from "./drawer-modules/JunoChorusModule";
import PhaseModModule from "./drawer-modules/PhaseModModule";
import PhaserModule from "./drawer-modules/PhaserModule";
import ReverbModule from "./drawer-modules/ReverbModule";
import RingModModule from "./drawer-modules/RingModModule";
import ShimmerVerbModule from "./drawer-modules/ShimmerVerbModule";
import TremoloModule from "./drawer-modules/TremoloModule";
import VibratoModule from "./drawer-modules/VibratoModule";
import WavefolderModule from "./drawer-modules/WavefolderModule";

const FX_SLOT_OPTIONS: { value: FxSlotType; label: string }[] = [
	{ value: "empty", label: "Empty" },
	{ value: "chorus", label: "Chorus" },
	{ value: "phaser", label: "Phaser" },
	{ value: "delay", label: "Delay" },
	{ value: "reverb", label: "Reverb" },
	{ value: "vibrato", label: "Vibrato" },
	{ value: "phaseMod", label: "Phase Mod" },
	{ value: "compressor", label: "Compressor" },
	{ value: "eq5Band", label: "5-Band EQ" },
	{ value: "grainDelay", label: "Grain Delay" },
	{ value: "bitcrusher", label: "Bitcrusher" },
	{ value: "shimmerVerb", label: "Shimmer Verb" },
	{ value: "distortion", label: "Distortion" },
	{ value: "junoChorus", label: "Juno Chorus" },
	{ value: "ringMod", label: "Ring Mod" },
	{ value: "tremolo", label: "Tremolo" },
	{ value: "wavefolder", label: "Wavefolder" },
];

function SlotModule({ type, slot }: { type: FxSlotType; slot: number }) {
	switch (type) {
		case "chorus":
			return <ChorusModule />;
		case "phaser":
			return <PhaserModule />;
		case "delay":
			return <DelayModule />;
		case "reverb":
			return <ReverbModule />;
		case "vibrato":
			return <VibratoModule />;
		case "phaseMod":
			return <PhaseModModule />;
		case "compressor":
			return <CompressorModule slot={slot} />;
		case "eq5Band":
			return <EqModule slot={slot} />;
		case "grainDelay":
			return <GrainDelayModule slot={slot} />;
		case "bitcrusher":
			return <BitcrusherModule slot={slot} />;
		case "shimmerVerb":
			return <ShimmerVerbModule slot={slot} />;
		case "distortion":
			return <DistortionModule slot={slot} />;
		case "junoChorus":
			return <JunoChorusModule slot={slot} />;
		case "ringMod":
			return <RingModModule slot={slot} />;
		case "tremolo":
			return <TremoloModule slot={slot} />;
		case "wavefolder":
			return <WavefolderModule slot={slot} />;
		default:
			return null;
	}
}

export default memo(function FxSlotFrame({ slot }: { slot: number }) {
	const fxSlotTypes = useSynthStore((s) => s.fxSlotTypes);
	const setFxSlotType = useSynthStore((s) => s.setFxSlotType);
	const currentType = fxSlotTypes[slot] ?? "empty";

	return (
		<div className="flex flex-col gap-1 h-full min-h-0">
			<select
				className="select select-xs select-bordered w-full"
				value={currentType}
				onChange={(e) => setFxSlotType(slot, e.target.value as FxSlotType)}
			>
				{FX_SLOT_OPTIONS.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
			<div className="flex-1 min-h-0 overflow-hidden">
				<SlotModule type={currentType} slot={slot} />
			</div>
		</div>
	);
});
