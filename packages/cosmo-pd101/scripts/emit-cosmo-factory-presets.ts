import { DEFAULT_SYNTH_PRESETS } from "../src/lib/synth/defaultPresets";
import { createPresetId } from "../src/lib/synth/presetIdentity";

const DEFAULT_MACRO_LABELS = ["Brightness", "Timbre", "Time", "Movement"];

const entries = Object.values(DEFAULT_SYNTH_PRESETS)
	.map((preset) => {
		const params = {
			...preset.data.params,
		} as Record<string, unknown>;
		const rawMacroLabels = params.macroLabels;
		delete params.macroLabels;

		const macroLabels = Array.isArray(rawMacroLabels)
			? rawMacroLabels
			: DEFAULT_MACRO_LABELS;

		return {
			id: createPresetId({
				name: preset.name,
				source: "cosmo-factory",
				author: "Purr Audio",
				starred: preset.starred,
				tags: preset.tags,
				data: preset.data,
			}),
			name: preset.name,
			source: "cosmo-factory" as const,
			author: "Purr Audio",
			starred: preset.starred,
			tags: preset.tags,
			macroLabels,
			factoryVersion: 1,
			data: {
				schemaVersion: preset.data.schemaVersion,
				params,
			},
		};
	})
	.sort((left, right) => left.name.localeCompare(right.name));

process.stdout.write(JSON.stringify(entries));
