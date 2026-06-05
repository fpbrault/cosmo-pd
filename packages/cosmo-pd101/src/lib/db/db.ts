import { defineDatabase } from "@/lib/db/indexedDB";

export const db = defineDatabase({
	name: "cosmo-pd101-preset-storage",
	version: 2,
	stores: [
		{ name: "presets", keyPath: "id" },
		{ name: "kv", keyPath: "key" },
		{ name: "favorites", keyPath: "id" },
		{ name: "fxModulePresets", keyPath: "id" },
	],
});
