import { BaseFxSection, type FxKnobConfig } from "./BaseFxSection";
import { PARAM_META } from "@/lib/synth/paramMeta";

interface ReverbSectionProps {
	space: number;
	setSpace: (v: number) => void;
	mix: number;
	setMix: (v: number) => void;
	predelay: number;
	setPredelay: (v: number) => void;
	distance: number;
	setDistance: (v: number) => void;
	character: number;
	setCharacter: (v: number) => void;
}

export function ReverbSection({
	space,
	setSpace,
	mix,
	setMix,
	predelay,
	setPredelay,
	distance,
	setDistance,
	character,
	setCharacter,
}: ReverbSectionProps) {
	const knobs: FxKnobConfig[] = [
		{
			label: "Space",
			tooltip: PARAM_META.reverbSpace?.tooltip,
			value: space,
			setValue: setSpace,
			min: 0,
			max: 1,
			size: 44,
			color: "#9cb937",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
		{
			label: "Pre-Dly",
			tooltip: PARAM_META.reverbPredelay?.tooltip,
			value: predelay,
			setValue: setPredelay,
			min: 0,
			max: 0.1,
			size: 44,
			color: "#9cb937",
			valueFormatter: (value) => `${Math.round(value * 1000)}ms`,
		},
		{
			label: "Char",
			tooltip: PARAM_META.reverbCharacter?.tooltip,
			value: character,
			setValue: setCharacter,
			min: 0,
			max: 1,
			size: 44,
			color: "#9cb937",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
		{
			label: "Dist",
			tooltip: PARAM_META.reverbDistance?.tooltip,
			value: distance,
			setValue: setDistance,
			min: 0,
			max: 1,
			size: 44,
			color: "#9cb937",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
		{
			label: "Mix",
			tooltip: PARAM_META.reverbMix?.tooltip,
			value: mix,
			setValue: setMix,
			min: 0,
			max: 1,
			size: 44,
			color: "#3dff3d",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
	];
	return <BaseFxSection title="Reverb" knobs={knobs} />;
}
