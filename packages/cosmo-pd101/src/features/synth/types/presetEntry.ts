import type { LibraryPreset } from "./libraryPreset";

export type PresetEntry = {
	id: string;
	label: string;
	type: "local" | "library";
	source: LibraryPreset["source"];
	sourceLabel: string;
	author: string;
	starred: boolean;
	favorite: boolean;
	tags: string[];
	preset?: LibraryPreset;
};
