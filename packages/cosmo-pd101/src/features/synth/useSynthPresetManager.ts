import { useCallback, useEffect, useMemo, useState } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { getPresetSourceLabel } from "@/lib/synth/presetSources";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
	importPreset,
	listPresetFavorites,
	listStoredPresets,
	loadCurrentPresetSession,
	loadCurrentState,
	loadStoredPreset,
	type PresetMetadata,
	renamePreset,
	saveCurrentPresetSession,
	saveCurrentState,
	saveStoredPreset,
	setPresetFavorite,
	updatePresetMetadata,
	updateStoredPreset,
} from "@/lib/synth/presetStorage";
import {
	inferPresetTags,
	normalizePresetTags,
	type PresetTagOptions,
} from "@/lib/synth/presetTags";
import type { EnginePresetV1, FrontendPresetV1 } from "@/lib/synth/presetTypes";

type UseSynthPresetManagerOptions = {
	builtinPresets: Record<string, FrontendPresetV1>;
	gatherState: () => SynthPresetV1;
	applyPreset: (data: SynthPresetV1) => void;
	onBeforeApplyPreset?: () => void;
	libraryPresets?: LibraryPreset[];
	onLoadLibraryPreset?: (preset: LibraryPreset) => void;
	shouldLoadCurrentState?: () => boolean;
	presetStateKey?: string;
};

type UseSynthPresetManagerResult = {
	allPresetEntries: PresetEntry[];
	visiblePresetEntries: PresetEntry[];
	activePresetId: string | null;
	activePresetNameBase: string;
	activePresetName: string;
	loadedPresetFingerprint: string | null;
	pendingPresetChange: PendingPresetChange | null;
	handleSyncBuiltinSelection: (name: string) => void;
	handleLoadLocal: (id: string) => void;
	handleLoadBuiltin: (name: string) => void;
	handleLoadLibrary: (preset: LibraryPreset) => void;
	handleStepPreset: (direction: -1 | 1) => void;
	handleSavePreset: (name: string) => void;
	handleDeletePreset: (id: string) => void;
	handleRenamePreset: (id: string, newName: string) => void;
	handleSetPresetAuthor: (id: string, author: string) => void;
	handleSetPresetFavorite: (id: string, favorite: boolean) => void;
	handleSetPresetTags: (id: string, tags: PresetTagOptions[]) => void;
	handleInitPreset: () => void;
	handleExportPreset: (id: string) => void;
	handleImportPreset: (json: string, filename: string) => void;
	handleExportCurrentState: (name: string) => void;
	handleSavePendingPresetChange: (name?: string) => void;
	handleDiscardPendingPresetChange: () => void;
	handleCancelPendingPresetChange: () => void;
};

type PendingNavigation =
	| { type: "local"; entryId: string; id: string }
	| { type: "builtin"; entryId: string; name: string }
	| { type: "library"; entryId: string; preset: LibraryPreset };

type PendingPresetChange = {
	activePresetName: string;
	activeLocalName: string | null;
	suggestedName: string;
	changes: PendingPresetDiffEntry[];
};

type PendingPresetDiffEntry = {
	path: string;
	previous: string;
	next: string;
};

type JsonLike = null | boolean | number | string | JsonLike[] | JsonLikeObject;

type JsonLikeObject = {
	[key: string]: JsonLike | undefined;
};

const presetNameCollator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

function sortPresetEntries(entries: PresetEntry[]): PresetEntry[] {
	return [...entries].sort((a, b) => {
		const labelCompare = presetNameCollator.compare(a.label, b.label);
		return labelCompare === 0
			? presetNameCollator.compare(a.id, b.id)
			: labelCompare;
	});
}

function getPresetFingerprint(preset: EnginePresetV1): string {
	return JSON.stringify(preset);
}

function parsePresetFingerprint(fingerprint: string | null): JsonLike | null {
	if (!fingerprint) {
		return null;
	}

	try {
		return JSON.parse(fingerprint) as JsonLike;
	} catch {
		return null;
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function roundNumber(value: number): number {
	return Math.round(value * 1e6) / 1e6;
}

function formatDiffValue(value: unknown): string {
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "number") return String(roundNumber(value));
	if (typeof value === "boolean" || value === null) {
		return String(value);
	}
	if (Array.isArray(value)) return `[${value.length} items]`;
	if (isPlainObject(value)) return "{...}";
	if (typeof value === "undefined") return "undefined";
	return String(value);
}

function collectPresetDiffs(
	previousValue: unknown,
	nextValue: unknown,
	out: PendingPresetDiffEntry[],
	path = "",
	maxEntries = 200,
): void {
	const normalizedPrev =
		typeof previousValue === "number"
			? roundNumber(previousValue)
			: previousValue;
	const normalizedNext =
		typeof nextValue === "number" ? roundNumber(nextValue) : nextValue;
	if (out.length >= maxEntries || Object.is(normalizedPrev, normalizedNext)) {
		return;
	}

	if (Array.isArray(previousValue) && Array.isArray(nextValue)) {
		if (previousValue.length !== nextValue.length) {
			out.push({
				path: path ? `${path}.length` : "length",
				previous: String(previousValue.length),
				next: String(nextValue.length),
			});
			if (out.length >= maxEntries) return;
		}

		for (
			let index = 0;
			index < Math.max(previousValue.length, nextValue.length);
			index++
		) {
			collectPresetDiffs(
				previousValue[index],
				nextValue[index],
				out,
				`${path}[${index}]`,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	if (isPlainObject(previousValue) && isPlainObject(nextValue)) {
		const keys = Array.from(
			new Set([...Object.keys(previousValue), ...Object.keys(nextValue)]),
		).sort();
		for (const key of keys) {
			const nextPath = path ? `${path}.${key}` : key;
			collectPresetDiffs(
				previousValue[key],
				nextValue[key],
				out,
				nextPath,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	out.push({
		path: path || "(root)",
		previous: formatDiffValue(previousValue),
		next: formatDiffValue(nextValue),
	});
}

export function useSynthPresetManager({
	builtinPresets,
	gatherState,
	applyPreset,
	onBeforeApplyPreset,
	libraryPresets = [],
	onLoadLibraryPreset,
	shouldLoadCurrentState,
	presetStateKey,
}: UseSynthPresetManagerOptions): UseSynthPresetManagerResult {
	const [localPresetEntries, setLocalPresetEntries] = useState(() =>
		listStoredPresets(),
	);
	const [favoritePresetIds, setFavoritePresetIds] = useState(() =>
		listPresetFavorites(),
	);
	const shouldHydratePersistedState = useMemo(
		() => (shouldLoadCurrentState ? shouldLoadCurrentState() : true),
		[shouldLoadCurrentState],
	);
	const initialPresetSession = useMemo(
		() => (shouldHydratePersistedState ? loadCurrentPresetSession() : null),
		[shouldHydratePersistedState],
	);
	const [activePresetId, setActivePresetId] = useState<string | null>(
		initialPresetSession?.activePresetId ?? null,
	);
	const [activePresetNameBase, setActivePresetNameBase] = useState(
		initialPresetSession?.activePresetNameBase ?? "Current State",
	);
	const [loadedPresetFingerprint, setLoadedPresetFingerprint] = useState<
		string | null
	>(initialPresetSession?.loadedPresetFingerprint ?? null);
	const [pendingNavigation, setPendingNavigation] =
		useState<PendingNavigation | null>(null);
	const currentPresetFingerprint =
		presetStateKey ?? getPresetFingerprint(gatherState());
	const hasUnsavedChanges =
		loadedPresetFingerprint !== null &&
		currentPresetFingerprint !== loadedPresetFingerprint;
	const activePresetName = hasUnsavedChanges
		? `${activePresetNameBase} *`
		: activePresetNameBase;
	const activeLocalPreset = useMemo(
		() =>
			activePresetId
				? (localPresetEntries.find((entry) => entry.id === activePresetId) ??
					null)
				: null,
		[activePresetId, localPresetEntries],
	);
	const activeLocalName = activeLocalPreset?.name ?? null;
	const pendingPresetChange = useMemo(() => {
		if (!pendingNavigation) {
			return null;
		}

		const changes: PendingPresetDiffEntry[] = [];
		const previousPreset = parsePresetFingerprint(loadedPresetFingerprint);
		const currentPreset = parsePresetFingerprint(currentPresetFingerprint);

		if (previousPreset !== null && currentPreset !== null) {
			collectPresetDiffs(previousPreset, currentPreset, changes);
		}

		if (changes.length === 0 && hasUnsavedChanges) {
			changes.push({
				path: "(preset)",
				previous: "saved preset",
				next: "current state",
			});
		}

		return {
			activePresetName: activePresetNameBase,
			activeLocalName,
			suggestedName:
				activePresetNameBase === "Current State" ? "" : activePresetNameBase,
			changes,
		};
	}, [
		activeLocalName,
		activePresetNameBase,
		currentPresetFingerprint,
		hasUnsavedChanges,
		loadedPresetFingerprint,
		pendingNavigation,
	]);

	const captureLoadedPresetFingerprint = useCallback(() => {
		setLoadedPresetFingerprint(getPresetFingerprint(gatherState()));
	}, [gatherState]);

	const refreshLocalPresetEntries = useCallback(() => {
		setLocalPresetEntries(listStoredPresets());
	}, []);

	const refreshFavoritePresetIds = useCallback(() => {
		setFavoritePresetIds(listPresetFavorites());
	}, []);

	const requestPresetChange = useCallback(
		(navigation: PendingNavigation) => {
			if (!hasUnsavedChanges || navigation.entryId === activePresetId) {
				return true;
			}

			setPendingNavigation(navigation);
			return false;
		},
		[activePresetId, hasUnsavedChanges],
	);

	const loadLocalPreset = useCallback(
		(id: string) => {
			const preset = loadStoredPreset(id);
			if (!preset) return;
			onBeforeApplyPreset?.();
			applyPreset(preset.data);
			setActivePresetId(preset.id);
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[applyPreset, captureLoadedPresetFingerprint, onBeforeApplyPreset],
	);

	const loadBuiltinPreset = useCallback(
		(name: string) => {
			const preset = builtinPresets[name];
			if (!preset) return;
			onBeforeApplyPreset?.();
			applyPreset(preset.data);
			setActivePresetId(preset.id);
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[
			applyPreset,
			builtinPresets,
			captureLoadedPresetFingerprint,
			onBeforeApplyPreset,
		],
	);

	const loadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (!onLoadLibraryPreset) return;
			onBeforeApplyPreset?.();
			onLoadLibraryPreset(preset);
			setActivePresetId(preset.id);
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[captureLoadedPresetFingerprint, onBeforeApplyPreset, onLoadLibraryPreset],
	);

	const handleLoadLocal = useCallback(
		(id: string) => {
			if (!requestPresetChange({ type: "local", entryId: id, id })) {
				return;
			}
			loadLocalPreset(id);
		},
		[loadLocalPreset, requestPresetChange],
	);

	const handleLoadBuiltin = useCallback(
		(name: string) => {
			const preset = builtinPresets[name];
			if (!preset) {
				return;
			}
			if (
				!requestPresetChange({
					type: "builtin",
					entryId: preset.id,
					name,
				})
			) {
				return;
			}
			loadBuiltinPreset(name);
		},
		[builtinPresets, loadBuiltinPreset, requestPresetChange],
	);

	const handleSyncBuiltinSelection = useCallback(
		(name: string) => {
			const preset = builtinPresets[name];
			setActivePresetId(preset?.id ?? null);
			setActivePresetNameBase(name);
			captureLoadedPresetFingerprint();
		},
		[builtinPresets, captureLoadedPresetFingerprint],
	);

	const handleLoadLibrary = useCallback(
		(preset: LibraryPreset) => {
			if (
				!requestPresetChange({
					type: "library",
					entryId: preset.id,
					preset,
				})
			) {
				return;
			}
			loadLibraryPreset(preset);
		},
		[loadLibraryPreset, requestPresetChange],
	);

	const allPresetEntries = useMemo(() => {
		const favoriteIds = new Set(favoritePresetIds);

		return [
			...sortPresetEntries(
				Object.values(builtinPresets).map((preset) => {
					const inferredTags = inferPresetTags(preset.name);
					const builtinTags = normalizePresetTags(
						preset.tags.length > 0 ? preset.tags : inferredTags,
					);

					return {
						id: preset.id,
						label: preset.name,
						type: "builtin" as const,
						source: preset.source,
						sourceLabel: getPresetSourceLabel(preset.source),
						author: preset.author,
						starred: preset.starred,
						favorite: favoriteIds.has(preset.id),
						tags: builtinTags,
					};
				}),
			),
			...sortPresetEntries(
				localPresetEntries.map((entry) => ({
					id: entry.id,
					label: entry.name,
					type: "local" as const,
					source: entry.source,
					sourceLabel: getPresetSourceLabel(entry.source),
					author: entry.author,
					starred: entry.starred,
					favorite: favoriteIds.has(entry.id),
					tags: entry.tags,
				})),
			),
			...sortPresetEntries(
				libraryPresets.map((preset) => {
					const presetTags = normalizePresetTags(
						preset.tags && preset.tags.length > 0
							? preset.tags
							: inferPresetTags(preset.name),
					);

					return {
						id: preset.id,
						label: preset.name,
						type: "library" as const,
						source: preset.source,
						sourceLabel: getPresetSourceLabel(preset.source),
						author: preset.author,
						starred: preset.starred,
						favorite: favoriteIds.has(preset.id),
						tags: presetTags,
						preset,
					};
				}),
			),
		];
	}, [builtinPresets, favoritePresetIds, libraryPresets, localPresetEntries]);

	const activePresetIndex = useMemo(
		() => allPresetEntries.findIndex((entry) => entry.id === activePresetId),
		[allPresetEntries, activePresetId],
	);

	const handleStepPreset = useCallback(
		(direction: -1 | 1) => {
			if (allPresetEntries.length === 0) return;
			let next = 0;
			if (activePresetIndex < 0) {
				next = direction === 1 ? 0 : allPresetEntries.length - 1;
			} else {
				next =
					(activePresetIndex + direction + allPresetEntries.length) %
					allPresetEntries.length;
			}
			const entry = allPresetEntries[next];
			if (!entry) return;
			if (entry.type === "local") {
				handleLoadLocal(entry.id);
				return;
			}
			if (entry.type === "builtin") {
				handleLoadBuiltin(entry.label);
				return;
			}
			if (entry.preset) {
				handleLoadLibrary(entry.preset);
			}
		},
		[
			activePresetIndex,
			allPresetEntries,
			handleLoadBuiltin,
			handleLoadLibrary,
			handleLoadLocal,
		],
	);

	const completePendingNavigation = useCallback(
		(navigation: PendingNavigation | null) => {
			if (!navigation) return;
			setPendingNavigation(null);
			if (navigation.type === "local") {
				loadLocalPreset(navigation.id);
				return;
			}
			if (navigation.type === "builtin") {
				loadBuiltinPreset(navigation.name);
				return;
			}
			loadLibraryPreset(navigation.preset);
		},
		[loadBuiltinPreset, loadLibraryPreset, loadLocalPreset],
	);

	const saveLocalPreset = useCallback(
		(name: string) => {
			const metadata: PresetMetadata = {
				tags: activeLocalPreset?.tags ?? [],
			};
			const stored = saveStoredPreset({
				id: activeLocalPreset?.id,
				name,
				data: gatherState(),
				source: "user",
				author: activeLocalPreset?.author ?? "",
				starred: activeLocalPreset?.starred ?? false,
				tags: metadata.tags,
			});
			refreshLocalPresetEntries();
			return stored;
		},
		[activeLocalPreset, gatherState, refreshLocalPresetEntries],
	);

	const handleSavePendingPresetChange = useCallback(
		(name?: string) => {
			const navigation = pendingNavigation;
			if (!navigation) return;
			const saveName = activeLocalName ?? name?.trim();
			if (!saveName) return;
			const stored = saveLocalPreset(saveName);
			setActivePresetId(stored.id);
			setActivePresetNameBase(stored.name);
			captureLoadedPresetFingerprint();
			completePendingNavigation(navigation);
		},
		[
			activeLocalName,
			captureLoadedPresetFingerprint,
			completePendingNavigation,
			pendingNavigation,
			saveLocalPreset,
		],
	);

	const handleDiscardPendingPresetChange = useCallback(() => {
		completePendingNavigation(pendingNavigation);
	}, [completePendingNavigation, pendingNavigation]);

	const handleCancelPendingPresetChange = useCallback(() => {
		setPendingNavigation(null);
	}, []);

	const handleSavePreset = useCallback(
		(name: string) => {
			const stored = saveLocalPreset(name);
			setActivePresetId(stored.id);
			setActivePresetNameBase(stored.name);
			captureLoadedPresetFingerprint();
		},
		[captureLoadedPresetFingerprint, saveLocalPreset],
	);

	const handleDeletePreset = useCallback(
		(id: string) => {
			deletePreset(id);
			refreshLocalPresetEntries();
			refreshFavoritePresetIds();
			setActivePresetId((previous) => (previous === id ? null : previous));
			setActivePresetNameBase((previous) =>
				activePresetId === id ? "Current State" : previous,
			);
			setLoadedPresetFingerprint((previous) =>
				activePresetId === id ? null : previous,
			);
		},
		[activePresetId, refreshFavoritePresetIds, refreshLocalPresetEntries],
	);

	const handleRenamePreset = useCallback(
		(id: string, newName: string) => {
			const trimmed = newName.trim();
			if (!trimmed) return;
			const renamed = loadStoredPreset(id);
			if (renamed?.name === trimmed) {
				return;
			}
			renamePreset(id, trimmed);
			refreshLocalPresetEntries();
			setActivePresetNameBase((previous) =>
				activePresetId === id ? trimmed : previous,
			);
		},
		[activePresetId, refreshLocalPresetEntries],
	);

	const handleSetPresetFavorite = useCallback(
		(id: string, favorite: boolean) => {
			setPresetFavorite(id, favorite);
			refreshFavoritePresetIds();
		},
		[refreshFavoritePresetIds],
	);

	const handleSetPresetAuthor = useCallback(
		(id: string, author: string) => {
			if (!updateStoredPreset(id, { author: author.trim() })) {
				return;
			}
			refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleSetPresetTags = useCallback(
		(id: string, tags: PresetTagOptions[]) => {
			if (!updatePresetMetadata(id, { tags })) {
				return;
			}
			refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleInitPreset = useCallback(() => {
		onBeforeApplyPreset?.();
		applyPreset(DEFAULT_PRESET);
		setActivePresetId(null);
		setActivePresetNameBase("Current State");
		captureLoadedPresetFingerprint();
	}, [applyPreset, captureLoadedPresetFingerprint, onBeforeApplyPreset]);

	const handleExportPreset = useCallback((id: string) => {
		const json = exportPreset(id);
		if (!json) return;
		const preset = loadStoredPreset(id);
		const filename = preset?.name ?? "preset";
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `${filename}.json`;
		anchor.click();
		URL.revokeObjectURL(url);
	}, []);

	const handleImportPreset = useCallback(
		(json: string, filename: string) => {
			const importedPreset = importPreset(json);
			if (!importedPreset) return;
			const name = filename.trim() || importedPreset.name || "imported";
			const existingNames = new Set(
				localPresetEntries.map((entry) => entry.name),
			);
			let candidate = name;
			let suffix = 2;
			while (existingNames.has(candidate)) {
				candidate = `${name} ${suffix++}`;
			}
			const stored = saveStoredPreset({
				name: candidate,
				data: importedPreset.data,
				source: "user",
				author: importedPreset.author,
				starred: importedPreset.starred,
				tags: importedPreset.tags,
			});
			refreshLocalPresetEntries();
			onBeforeApplyPreset?.();
			applyPreset(stored.data);
			setActivePresetId(stored.id);
			setActivePresetNameBase(stored.name);
			captureLoadedPresetFingerprint();
		},
		[
			applyPreset,
			captureLoadedPresetFingerprint,
			localPresetEntries,
			onBeforeApplyPreset,
			refreshLocalPresetEntries,
		],
	);

	const handleExportCurrentState = useCallback(
		(name: string) => {
			const state = gatherState();
			const json = JSON.stringify({ _name: name, ...state }, null, 2);
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = `${name}.json`;
			anchor.click();
			URL.revokeObjectURL(url);
		},
		[gatherState],
	);

	useEffect(() => {
		refreshLocalPresetEntries();
		refreshFavoritePresetIds();
		if (!shouldHydratePersistedState) return;
		if (!initialPresetSession) {
			const isTestMode = import.meta.env.VITE_TEST_HARNESS === "1";
			if (!isTestMode) {
				const firstPresetName = Object.keys(builtinPresets)[0];
				if (firstPresetName) {
					loadBuiltinPreset(firstPresetName);
					return;
				}
			}
		}
		const saved = loadCurrentState();
		if (saved) applyPreset(saved);
	}, [
		applyPreset,
		builtinPresets,
		initialPresetSession,
		loadBuiltinPreset,
		refreshFavoritePresetIds,
		refreshLocalPresetEntries,
		shouldHydratePersistedState,
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			saveCurrentState(gatherState());
			saveCurrentPresetSession({
				activePresetId,
				activePresetNameBase,
				loadedPresetFingerprint,
			});
		}, 500);
		return () => clearTimeout(timer);
	}, [
		activePresetId,
		activePresetNameBase,
		gatherState,
		loadedPresetFingerprint,
	]);

	return {
		allPresetEntries,
		visiblePresetEntries: allPresetEntries,
		activePresetId,
		activePresetNameBase,
		activePresetName,
		loadedPresetFingerprint,
		pendingPresetChange,
		handleSyncBuiltinSelection,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleStepPreset,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetAuthor,
		handleSetPresetFavorite,
		handleSetPresetTags,
		handleInitPreset,
		handleExportPreset,
		handleImportPreset,
		handleExportCurrentState,
		handleSavePendingPresetChange,
		handleDiscardPendingPresetChange,
		handleCancelPendingPresetChange,
	};
}
