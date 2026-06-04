import type { PresetTagOptions } from "@/lib/synth/presetTags";
import type { PresetEntry } from "./types/presetEntry";

export type PresetManagerSession = {
	activePresetId: string | null;
	activePresetNameBase: string;
	isDirty: boolean;
};

export type PresetStateSync = "immediate" | "deferred";

export type PresetActivationResult = {
	session: PresetManagerSession;
	stateSync: PresetStateSync;
};

export type ExportedPresetFile = {
	filename: string;
	json: string;
};

export type SavePresetRequest = {
	existingEntry: PresetEntry | null;
	name: string;
};

export interface PresetManagerRepository {
	listEntries: () => Promise<PresetEntry[]>;
	loadEntry: (entry: PresetEntry) => Promise<PresetActivationResult | null>;
	savePreset: (request: SavePresetRequest) => Promise<PresetActivationResult>;
	deletePreset: (id: string) => Promise<void>;
	renamePreset: (id: string, newName: string) => Promise<void>;
	setPresetAuthor: (id: string, author: string) => Promise<void>;
	setPresetFavorite: (id: string, favorite: boolean) => Promise<void>;
	setPresetTags: (id: string, tags: PresetTagOptions[]) => Promise<void>;
	initPreset: () => Promise<PresetActivationResult>;
	exportPreset: (id: string) => Promise<ExportedPresetFile | null>;
	importPreset: (
		json: string,
		filename: string,
	) => Promise<PresetActivationResult | null>;
	exportCurrentState: (name: string) => Promise<ExportedPresetFile>;
}
