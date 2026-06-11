import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import type { PresetSource } from "@/lib/synth/presetSources";
import type { PresetTagOptions } from "./presetTags";

export type EnginePresetV1 = SynthPresetV1;

export type PresetMetadata = {
	description: string;
	tags: PresetTagOptions[];
};

type ExtraParams = {
	params: {
		macroLabels?: string[];
	};
};

type FrontendPresetData = EnginePresetV1 & ExtraParams;

export type FrontendPresetV1 = {
	id: string;
	name: string;
	source: PresetSource;
	author: string;
	starred: boolean;
	data: FrontendPresetData;
} & PresetMetadata;
