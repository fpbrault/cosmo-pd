import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import { FACTORY_CZ_PRESET_DEFINITIONS } from "@/lib/synth/factoryCzPresetDefinitions";
import { createPresetId } from "@/lib/synth/presetIdentity";

export const FACTORY_CZ_PRESETS: LibraryPreset[] =
	FACTORY_CZ_PRESET_DEFINITIONS.map((preset) => ({
		id: createPresetId({
			name: preset.name,
			source: "cz-factory",
			author: "Temple of CZ",
			starred: false,
			tags: preset.tags || [],
			data: preset.data,
		}),
		name: preset.name,
		source: "cz-factory",
		author: "Temple of CZ",
		starred: false,
		data: preset.data,
		tags: preset.tags || [],
	}));
