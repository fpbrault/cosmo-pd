import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import type { PresetSource } from "@/lib/synth/presetSources";

export type LibraryPreset = {
	id: string;
	name: string;
	source: PresetSource;
	author: string;
	starred: boolean;
	sortIndex?: number;
	data?: SynthPresetV1;
	sysexData?: Uint8Array;
	tags?: string[];
};
