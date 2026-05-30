import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_SYNTH_PRESETS } from "../src/lib/synth/defaultPresets";
import { FACTORY_CZ_PRESET_DEFINITIONS } from "../src/lib/synth/factoryCzPresetDefinitions";
import { createPresetId } from "../src/lib/synth/presetIdentity";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_MACRO_LABELS = ["Brightness", "Timbre", "Time", "Movement"];

type FactoryEntry = {
	id: string;
	name: string;
	source: "cosmo-factory" | "cz-factory";
	author: string;
	starred: boolean;
	tags: string[];
	macroLabels: string[];
	factoryVersion: number;
	data: { schemaVersion: number; params: Record<string, unknown> };
};

const cosmoEntries: FactoryEntry[] = Object.values(DEFAULT_SYNTH_PRESETS)
	.map((fp) => {
		const params = { ...fp.data.params } as Record<string, unknown>;
		const rawMacroLabels = params.macroLabels;
		delete params.macroLabels;

		const macroLabels: string[] = Array.isArray(rawMacroLabels)
			? rawMacroLabels
			: DEFAULT_MACRO_LABELS;

		return {
			id: createPresetId({
				name: fp.name,
				source: "cosmo-factory",
				author: "Purr Audio",
				starred: fp.starred,
				tags: fp.tags,
				data: fp.data,
			}),
			name: fp.name,
			source: "cosmo-factory" as const,
			author: "Purr Audio",
			starred: fp.starred,
			tags: fp.tags,
			macroLabels,
			factoryVersion: 1,
			data: {
				schemaVersion: fp.data.schemaVersion,
				params,
			},
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));

const czEntries: FactoryEntry[] = FACTORY_CZ_PRESET_DEFINITIONS.map((dp) => ({
	id: createPresetId({
		name: dp.name,
		source: "cz-factory",
		author: "Temple of CZ",
		starred: false,
		tags: dp.tags || [],
		data: dp.data,
	}),
	name: dp.name,
	source: "cz-factory" as const,
	author: "Temple of CZ",
	starred: false,
	tags: dp.tags || [],
	macroLabels: DEFAULT_MACRO_LABELS,
	factoryVersion: 1,
	data: dp.data,
})).sort((a, b) => a.name.localeCompare(b.name));

const allPresets = [...cosmoEntries, ...czEntries];

const outputPath = resolve(__dirname, "../src/lib/synth/factory_presets.json");

writeFileSync(outputPath, `${JSON.stringify(allPresets, null, 2)}\n`);

console.log(`Wrote ${allPresets.length} presets to factory_presets.json`);
console.log(`  cosmo-factory: ${cosmoEntries.length}`);
console.log(`  cz-factory: ${czEntries.length}`);
