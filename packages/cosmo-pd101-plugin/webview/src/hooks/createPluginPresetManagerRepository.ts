import {
	createWebPresetManagerRepository,
	FACTORY_PRESETS,
	type LibraryPreset,
	type PresetActivationResult,
	type PresetEntry,
	type PresetLibraryStatus,
	type PresetManagerRepository,
	type PresetManagerSession,
	type PresetSource,
	type PresetTagOptions,
	type SavePresetRequest,
	type SynthPresetV1,
} from "@cosmo/cosmo-pd101";

type NativePresetLibraryEntry = {
	id: string;
	name: string;
	source: PresetSource;
	author: string;
	description?: string;
	starred: boolean;
	sortIndex?: number;
	favorite?: boolean;
	bankId?: string | null;
	bankName?: string | null;
	tags?: string[];
};

type NativePresetLibraryResponse = {
	entries?: NativePresetLibraryEntry[];
	status?: Exclude<PresetLibraryStatus, { state: "loading" }>;
};

type SavePluginPresetPayload = {
	id?: string | null;
	name: string;
	author?: string;
	description?: string;
	tags?: string[];
	data?: SynthPresetV1;
};

type ImportedPresetBank = {
	type: "preset-bank";
	schemaVersion: number;
	bank: {
		id: string;
		name: string;
		source: PresetSource;
	};
	presets: Array<{
		id: string;
		name: string;
		author?: string;
		description?: string;
		starred?: boolean;
		tags?: string[];
		data: SynthPresetV1;
	}>;
};

const DEFAULT_USER_PRESET_AUTHOR = "User";

function requireHostMethod(
	name: string,
	method: (() => Promise<unknown>) | undefined,
): () => Promise<unknown> {
	if (!method) {
		throw new Error(`Plugin host does not provide ${name}`);
	}
	return method;
}

function getSourceLabel(source: PresetSource): string {
	if (source === "cosmo-factory") {
		return "Cosmo Factory Library";
	}
	if (source === "cz-factory") {
		return "Temple Of CZ";
	}
	if (source === "addon") {
		return "Add-On Bank";
	}
	return "User";
}

declare global {
	interface Window {
		__czGetPresetLibrary?: (source?: string) => Promise<unknown>;
		__czRetryPresetLibrary?: () => Promise<unknown>;
		__czRepairPresetLibrary?: () => Promise<unknown>;
		__czRebuildPresetLibrary?: () => Promise<unknown>;
		__czLoadPresetData?: (id: string) => Promise<unknown>;
		__czSavePreset?: (payload: SavePluginPresetPayload) => Promise<unknown>;
		__czDeletePreset?: (id: string) => Promise<unknown>;
		__czRenamePreset?: (id: string, newName: string) => Promise<unknown>;
		__czSetPresetAuthor?: (id: string, author: string) => Promise<unknown>;
		__czSetPresetDescription?: (
			id: string,
			description: string,
		) => Promise<unknown>;
		__czSetPresetTags?: (id: string, tags: string[]) => Promise<unknown>;
		__czToggleStarred?: (id: string, starred: boolean) => Promise<unknown>;
		__czExportPreset?: (id: string) => Promise<unknown>;
		__czImportPresetBank?: (payload: ImportedPresetBank) => Promise<unknown>;
		__czHostPlatform?: "macos" | "ios";
	}
}

function isAuv3Host() {
	return (
		window.__czHostPlatform === "ios" || window.__czHostPlatform === "macos"
	);
}

function buildAuv3LibraryPresets(): LibraryPreset[] {
	return FACTORY_PRESETS.map((preset, index) => ({
		...preset,
		id: String(index),
		sortIndex: index,
	}));
}

function createSelection(
	activePresetId: string | null,
	activePresetNameBase: string,
	isDirty = false,
): PresetManagerSession {
	return { activePresetId, activePresetNameBase, isDirty };
}

function createActivationResult(
	session: PresetManagerSession,
	stateSync: PresetActivationResult["stateSync"],
): PresetActivationResult {
	return { session, stateSync };
}

function isSynthPresetV1(value: unknown): value is SynthPresetV1 {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const candidate = value as Partial<SynthPresetV1> & {
		schemaVersion?: unknown;
		params?: unknown;
	};
	return candidate.schemaVersion === 1 && !!candidate.params;
}

function parseImportedPreset(
	json: string,
	filename: string,
): {
	name: string;
	data: SynthPresetV1;
	author: string;
	description: string;
	tags: string[];
} | null {
	try {
		const parsed = JSON.parse(json) as Record<string, unknown>;
		if (
			typeof parsed.name === "string" &&
			typeof parsed.author === "string" &&
			Array.isArray(parsed.tags) &&
			isSynthPresetV1(parsed.data)
		) {
			return {
				name: parsed.name,
				data: parsed.data,
				author: parsed.author,
				description:
					typeof parsed.description === "string" ? parsed.description : "",
				tags: parsed.tags.filter(
					(tag): tag is string => typeof tag === "string",
				),
			};
		}

		if (isSynthPresetV1(parsed)) {
			return {
				name: filename.trim() || "Imported",
				data: parsed,
				author: "",
				description: "",
				tags: [],
			};
		}

		if (
			typeof parsed._name === "string" &&
			isSynthPresetV1({
				schemaVersion: parsed.schemaVersion,
				params: parsed.params,
			})
		) {
			return {
				name: parsed._name,
				data: {
					schemaVersion: parsed.schemaVersion as number,
					params: parsed.params as SynthPresetV1["params"],
				},
				author: "",
				description: "",
				tags: [],
			};
		}
	} catch {
		return null;
	}

	return null;
}

function parseImportedPresetBank(json: string): ImportedPresetBank | null {
	try {
		const parsed = JSON.parse(json) as ImportedPresetBank;
		if (
			parsed.type !== "preset-bank" ||
			parsed.schemaVersion !== 1 ||
			typeof parsed.bank?.id !== "string" ||
			typeof parsed.bank?.name !== "string" ||
			!["cosmo-factory", "cz-factory", "addon"].includes(parsed.bank?.source) ||
			!Array.isArray(parsed.presets)
		) {
			return null;
		}

		const presets = parsed.presets.filter(
			(preset) =>
				typeof preset?.id === "string" &&
				typeof preset?.name === "string" &&
				isSynthPresetV1(preset?.data),
		);

		if (presets.length !== parsed.presets.length) {
			return null;
		}

		return {
			type: "preset-bank",
			schemaVersion: 1,
			bank: parsed.bank,
			presets: presets.map((preset) => ({
				id: preset.id,
				name: preset.name,
				author: typeof preset.author === "string" ? preset.author : "",
				description:
					typeof preset.description === "string" ? preset.description : "",
				starred: preset.starred === true,
				tags: Array.isArray(preset.tags)
					? preset.tags.filter((tag): tag is string => typeof tag === "string")
					: [],
				data: preset.data,
			})),
		};
	} catch {
		return null;
	}
}

function mapNativeEntryToPresetEntry(
	entry: NativePresetLibraryEntry,
): PresetEntry {
	return {
		id: entry.id,
		label: entry.name,
		type: entry.source === "user" ? "local" : "library",
		source: entry.source,
		sourceLabel: getSourceLabel(entry.source),
		bankId: entry.bankId ?? null,
		bankName: entry.bankName ?? null,
		author: entry.author,
		description: entry.description ?? "",
		starred: entry.starred,
		favorite: entry.favorite === true,
		tags: entry.tags ?? [],
		preset:
			entry.source === "user"
				? undefined
				: {
						id: entry.id,
						name: entry.name,
						source: entry.source,
						author: entry.author,
						description: entry.description ?? "",
						starred: entry.starred,
						sortIndex: entry.sortIndex,
						bankId: entry.bankId ?? null,
						bankName: entry.bankName ?? null,
						tags: entry.tags,
					},
	};
}

export function createPluginPresetManagerRepository({
	applyPreset,
	gatherPresetState,
	onBeforeApplyPreset,
}: {
	applyPreset: (data: SynthPresetV1) => void;
	gatherPresetState: () => SynthPresetV1;
	onBeforeApplyPreset?: () => void;
}): PresetManagerRepository {
	if (isAuv3Host()) {
		return createWebPresetManagerRepository({
			applyPreset,
			gatherPresetState,
			libraryPresets: buildAuv3LibraryPresets(),
			onBeforeApplyPreset,
		});
	}

	return {
		listEntries: async () => {
			const result = (await window.__czGetPresetLibrary?.()) as
				| NativePresetLibraryResponse
				| undefined;
			if (!result?.entries) {
				return {
					entries: [],
					status: result?.status ?? { state: "ready" },
				};
			}
			return {
				entries: result.entries.map(mapNativeEntryToPresetEntry),
				status: result.status ?? { state: "ready" },
			};
		},
		loadEntry: async (entry) => {
			const result = (await window.__czLoadPresetData?.(entry.id)) as
				| { preset_name?: string }
				| undefined;
			return createActivationResult(
				createSelection(entry.id, result?.preset_name ?? entry.label),
				"deferred",
			);
		},
		savePreset: async ({ existingEntry, name, mode }: SavePresetRequest) => {
			const result = (await window.__czSavePreset?.({
				id: mode === "overwrite" ? (existingEntry?.id ?? null) : null,
				name,
				author: existingEntry?.author?.trim()
					? existingEntry.author
					: DEFAULT_USER_PRESET_AUTHOR,
				description: existingEntry?.description ?? "",
				tags: existingEntry?.tags ?? [],
			})) as { id?: string; name?: string } | undefined;
			return createActivationResult(
				createSelection(
					result?.id ??
						(mode === "overwrite" ? (existingEntry?.id ?? null) : null),
					result?.name ?? name,
				),
				"immediate",
			);
		},
		deletePreset: async (id) => {
			await window.__czDeletePreset?.(id);
		},
		renamePreset: async (id, newName) => {
			await window.__czRenamePreset?.(id, newName);
		},
		setPresetAuthor: async (id, author) => {
			await window.__czSetPresetAuthor?.(id, author);
		},
		setPresetDescription: async (id, description) => {
			await window.__czSetPresetDescription?.(id, description);
		},
		setPresetFavorite: async (id, favorite) => {
			await window.__czToggleStarred?.(id, favorite);
		},
		setPresetTags: async (id, tags) => {
			await window.__czSetPresetTags?.(id, tags as PresetTagOptions[]);
		},
		initPreset: async () =>
			createActivationResult(
				createSelection(null, "Current State"),
				"immediate",
			),
		exportPreset: async (id) => {
			const result = (await window.__czExportPreset?.(id)) as
				| { filename?: string; json?: string }
				| undefined;
			if (!result?.filename || !result.json) {
				return null;
			}
			return {
				filename: result.filename,
				json: result.json,
			};
		},
		importPreset: async (json, filename) => {
			const importedBank = parseImportedPresetBank(json);
			if (importedBank) {
				await window.__czImportPresetBank?.(importedBank);
				return null;
			}

			const imported = parseImportedPreset(json, filename);
			if (!imported) {
				return null;
			}
			const result = (await window.__czSavePreset?.({
				name: imported.name,
				author: imported.author,
				description: imported.description,
				tags: imported.tags,
				data: imported.data,
			})) as { id?: string; name?: string } | undefined;
			if (!result?.id) {
				return null;
			}
			const activated = (await window.__czLoadPresetData?.(result.id)) as
				| { preset_name?: string }
				| undefined;
			return createActivationResult(
				createSelection(
					result.id,
					activated?.preset_name ?? result.name ?? imported.name,
				),
				"deferred",
			);
		},
		exportCurrentState: async (name) => ({
			filename: `${name}.json`,
			json: JSON.stringify({ _name: name, ...gatherPresetState() }, null, 2),
		}),
		retryLibrary: async () => {
			await requireHostMethod(
				"preset library retry",
				window.__czRetryPresetLibrary,
			)();
		},
		repairLibrary: async () => {
			await requireHostMethod(
				"preset library repair",
				window.__czRepairPresetLibrary,
			)();
		},
		rebuildLibrary: async () => {
			await requireHostMethod(
				"preset library rebuild",
				window.__czRebuildPresetLibrary,
			)();
		},
	};
}
