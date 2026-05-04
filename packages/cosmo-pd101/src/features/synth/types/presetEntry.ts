import type { LibraryPreset } from "./libraryPreset";

export type PresetEntry = {
	id: string;
	label: string;
	type: "local" | "library" | "builtin";
	sourceLabel: string;
	starred: boolean;
	favorite: boolean;
	category: string;
	tags: string[];
	preset?: LibraryPreset;
};
