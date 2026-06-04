import type {
	ExportedPresetFile,
	PresetActivationResult,
	PresetManagerRepository,
	PresetManagerSession,
	SavePresetRequest,
} from "@/features/synth/presetManagerRepository";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { convertDecodedPatchToSynthPreset } from "@/lib/synth/czPresetConverter";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
	importPreset,
	listPresetFavorites,
	listStoredPresets,
	loadStoredPreset,
	saveStoredPreset,
	setPresetFavorite,
	updatePresetMetadata,
	updateStoredPreset,
} from "@/lib/synth/presetStorage";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import { buildAllPresetEntries } from "./synthPresetManagerHelpers";

type CreateWebPresetManagerRepositoryOptions = {
	applyPreset: (data: SynthPresetV1) => void;
	gatherPresetState: () => SynthPresetV1;
	libraryPresets: LibraryPreset[];
	onBeforeApplyPreset?: () => void;
};

function createSelection(
	activePresetId: string | null,
	activePresetNameBase: string,
	isDirty = false,
): PresetManagerSession {
	return { activePresetId, activePresetNameBase, isDirty };
}

function createActivationResult(
	session: PresetManagerSession,
): PresetActivationResult {
	return { session, stateSync: "immediate" };
}

function buildCurrentStateExport(
	name: string,
	gatherPresetState: () => SynthPresetV1,
): ExportedPresetFile {
	return {
		filename: `${name}.json`,
		json: JSON.stringify({ _name: name, ...gatherPresetState() }, null, 2),
	};
}

export function createWebPresetManagerRepository({
	applyPreset,
	gatherPresetState,
	libraryPresets,
	onBeforeApplyPreset,
}: CreateWebPresetManagerRepositoryOptions): PresetManagerRepository {
	const refreshEntries = async (): Promise<PresetEntry[]> => {
		const [localPresetEntries, favoritePresetIds] = await Promise.all([
			listStoredPresets(),
			listPresetFavorites(),
		]);

		return buildAllPresetEntries({
			localPresetEntries,
			libraryPresets,
			favoritePresetIds,
		});
	};

	return {
		listEntries: refreshEntries,
		loadEntry: async (entry) => {
			onBeforeApplyPreset?.();
			if (entry.type === "local") {
				const preset = await loadStoredPreset(entry.id);
				if (!preset) {
					return null;
				}
				applyPreset(preset.data);
				return createActivationResult(createSelection(preset.id, preset.name));
			}

			if (entry.preset?.data) {
				applyPreset(entry.preset.data);
				return createActivationResult(createSelection(entry.id, entry.label));
			}

			if (entry.preset?.sysexData) {
				const decoded = decodeCzPatch(entry.preset.sysexData);
				if (!decoded) {
					return null;
				}
				applyPreset(convertDecodedPatchToSynthPreset(decoded));
				return createActivationResult(createSelection(entry.id, entry.label));
			}

			return null;
		},
		savePreset: async ({ existingEntry, name }: SavePresetRequest) => {
			const currentStoredPreset =
				existingEntry?.type === "local"
					? await loadStoredPreset(existingEntry.id)
					: null;
			const stored = await saveStoredPreset({
				id: currentStoredPreset?.id,
				name,
				data: gatherPresetState(),
				source: "user",
				author: currentStoredPreset?.author ?? "",
				starred: currentStoredPreset?.starred ?? false,
				tags: currentStoredPreset?.tags ?? [],
			});

			return createActivationResult(createSelection(stored.id, stored.name));
		},
		deletePreset,
		renamePreset: async (id, newName) => {
			await updateStoredPreset(id, { name: newName });
		},
		setPresetAuthor: async (id, author) => {
			await updateStoredPreset(id, { author });
		},
		setPresetFavorite,
		setPresetTags: async (id, tags) => {
			await updatePresetMetadata(id, { tags: tags as PresetTagOptions[] });
		},
		initPreset: async () => {
			onBeforeApplyPreset?.();
			applyPreset(DEFAULT_PRESET);
			return createActivationResult(createSelection(null, "Current State"));
		},
		exportPreset: async (id) => {
			const json = await exportPreset(id);
			if (!json) {
				return null;
			}
			const preset = await loadStoredPreset(id);
			return {
				filename: `${preset?.name ?? "preset"}.json`,
				json,
			};
		},
		importPreset: async (json, filename) => {
			const importedPreset = await importPreset(json);
			if (!importedPreset) {
				return null;
			}

			const existingNames = new Set(
				(await listStoredPresets()).map((entry) => entry.name),
			);
			const baseName = filename.trim() || importedPreset.name || "imported";
			let candidate = baseName;
			let suffix = 2;
			while (existingNames.has(candidate)) {
				candidate = `${baseName} ${suffix++}`;
			}

			const stored = await saveStoredPreset({
				name: candidate,
				data: importedPreset.data,
				source: "user",
				author: importedPreset.author,
				starred: importedPreset.starred,
				tags: importedPreset.tags,
			});
			onBeforeApplyPreset?.();
			applyPreset(stored.data);
			return createActivationResult(createSelection(stored.id, stored.name));
		},
		exportCurrentState: async (name) =>
			buildCurrentStateExport(name, gatherPresetState),
	};
}
