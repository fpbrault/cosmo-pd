import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";

export type EnginePresetV1 = SynthPresetV1;

export type PresetMetadata = {
	favorite: boolean;
	category: string;
	tags: string[];
};

export type FrontendPresetV1 = {
	name: string;
	data: EnginePresetV1;
} & PresetMetadata;
