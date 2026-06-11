import type { LibraryPreset } from "./libraryPreset";

export type PresetEntry = {
	id: string;
	label: string;
	type: "local" | "library";
	source: LibraryPreset["source"];
	sourceLabel: string;
	bankId?: string | null;
	bankName?: string | null;
	author: string;
	description: string;
	starred: boolean;
	favorite: boolean;
	tags: string[];
	preset?: LibraryPreset;
};
