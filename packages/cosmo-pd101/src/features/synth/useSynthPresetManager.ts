import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
	importPreset,
	listPresetFavorites,
	listStoredPresets,
	loadStoredPreset,
	type PresetMetadata,
	renamePreset,
	type StoredPreset,
	saveStoredPreset,
	setPresetFavorite,
	updatePresetMetadata,
	updateStoredPreset,
} from "@/lib/synth/presetStorage";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";
import {
	buildAllPresetEntries,
	buildPendingPresetDiffs,
	getPresetFingerprint,
	type PendingPresetDiffEntry,
} from "./synthPresetManagerHelpers";
import { usePresetManagerPersistence } from "./usePresetManagerPersistence";

type UseSynthPresetManagerOptions = {
	builtinPresets?: Record<string, FrontendPresetV1>;
	gatherPresetState: () => SynthPresetV1;
	applyPreset: (data: SynthPresetV1) => void;
	onBeforeApplyPreset?: () => void;
	libraryPresets?: LibraryPreset[];
	onLoadLibraryPreset?: (preset: LibraryPreset) => void;
	presetStateKey?: string;
	onLoadPresetData?: (id: string) => Promise<string>;
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

export function useSynthPresetManager({
	builtinPresets = {},
	gatherPresetState,
	applyPreset,
	onBeforeApplyPreset,
	libraryPresets = [],
	onLoadLibraryPreset,
	presetStateKey,
	onLoadPresetData,
}: UseSynthPresetManagerOptions): UseSynthPresetManagerResult {
	const [localPresetEntries, setLocalPresetEntries] = useState<StoredPreset[]>(
		[],
	);
	const [favoritePresetIds, setFavoritePresetIds] = useState<string[]>([]);
	const [activePresetId, setActivePresetId] = useState<string | null>(null);
	const [activePresetNameBase, setActivePresetNameBase] =
		useState("Current State");
	const [loadedPresetFingerprint, setLoadedPresetFingerprint] = useState<
		string | null
	>(null);
	const [pendingNavigation, setPendingNavigation] =
		useState<PendingNavigation | null>(null);
	const currentPresetFingerprint =
		presetStateKey ?? getPresetFingerprint(gatherPresetState());
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

		return {
			activePresetName: activePresetNameBase,
			activeLocalName,
			suggestedName:
				activePresetNameBase === "Current State" ? "" : activePresetNameBase,
			changes: buildPendingPresetDiffs({
				loadedPresetFingerprint,
				currentPresetFingerprint,
				hasUnsavedChanges,
			}),
		};
	}, [
		activeLocalName,
		activePresetNameBase,
		currentPresetFingerprint,
		hasUnsavedChanges,
		loadedPresetFingerprint,
		pendingNavigation,
	]);

	const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current);
			}
		};
	}, []);

	const captureLoadedPresetFingerprint = useCallback(() => {
		if (syncTimeoutRef.current) {
			clearTimeout(syncTimeoutRef.current);
			syncTimeoutRef.current = null;
		}
		setLoadedPresetFingerprint(getPresetFingerprint(gatherPresetState()));
	}, [gatherPresetState]);

	const refreshLocalPresetEntries = useCallback(async () => {
		setLocalPresetEntries(await listStoredPresets());
	}, []);

	const refreshFavoritePresetIds = useCallback(async () => {
		setFavoritePresetIds(await listPresetFavorites());
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
		async (id: string) => {
			if (onLoadPresetData) {
				onBeforeApplyPreset?.();
				const name = await onLoadPresetData(id);
				setActivePresetId(id);
				setActivePresetNameBase(name);
				captureLoadedPresetFingerprint();
				return;
			}
			const preset = await loadStoredPreset(id);
			if (!preset) return;
			onBeforeApplyPreset?.();
			applyPreset(preset.data);
			setActivePresetId(preset.id);
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[
			applyPreset,
			captureLoadedPresetFingerprint,
			onBeforeApplyPreset,
			onLoadPresetData,
		],
	);

	const loadBuiltinPreset = useCallback(
		(name: string) => {
			if (onLoadPresetData) return;
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
			onLoadPresetData,
		],
	);

	const loadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (onLoadPresetData) {
				onBeforeApplyPreset?.();
				void onLoadPresetData(preset.id).then((name) => {
					setActivePresetId(preset.id);
					setActivePresetNameBase(name);
					captureLoadedPresetFingerprint();
				});
				return;
			}
			if (!onLoadLibraryPreset) return;
			onBeforeApplyPreset?.();
			onLoadLibraryPreset(preset);
			setActivePresetId(preset.id);
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[
			captureLoadedPresetFingerprint,
			onBeforeApplyPreset,
			onLoadLibraryPreset,
			onLoadPresetData,
		],
	);

	const handleLoadLocal = useCallback(
		async (id: string) => {
			if (!requestPresetChange({ type: "local", entryId: id, id })) {
				return;
			}
			await loadLocalPreset(id);
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
			// Delayed re-capture ensures fingerprint is captured after
			// async bridge hydration completes (plugin mode race condition)
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current);
			}
			syncTimeoutRef.current = setTimeout(() => {
				captureLoadedPresetFingerprint();
				syncTimeoutRef.current = null;
			}, 500);
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
		return buildAllPresetEntries({
			builtinPresets,
			localPresetEntries,
			libraryPresets,
			favoritePresetIds,
		});
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
		async (navigation: PendingNavigation | null) => {
			if (!navigation) return;
			setPendingNavigation(null);
			if (navigation.type === "local") {
				await loadLocalPreset(navigation.id);
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
		async (name: string) => {
			const metadata: PresetMetadata = {
				tags: activeLocalPreset?.tags ?? [],
			};
			const stored = await saveStoredPreset({
				id: activeLocalPreset?.id,
				name,
				data: gatherPresetState(),
				source: "user",
				author: activeLocalPreset?.author ?? "",
				starred: activeLocalPreset?.starred ?? false,
				tags: metadata.tags,
			});
			await refreshLocalPresetEntries();
			return stored;
		},
		[activeLocalPreset, gatherPresetState, refreshLocalPresetEntries],
	);

	const handleSavePendingPresetChange = useCallback(
		async (name?: string) => {
			const navigation = pendingNavigation;
			if (!navigation) return;
			const saveName = activeLocalName ?? name?.trim();
			if (!saveName) return;
			const stored = await saveLocalPreset(saveName);
			setActivePresetId(stored.id);
			setActivePresetNameBase(stored.name);
			captureLoadedPresetFingerprint();
			await completePendingNavigation(navigation);
		},
		[
			activeLocalName,
			captureLoadedPresetFingerprint,
			completePendingNavigation,
			pendingNavigation,
			saveLocalPreset,
		],
	);

	const handleDiscardPendingPresetChange = useCallback(async () => {
		await completePendingNavigation(pendingNavigation);
	}, [completePendingNavigation, pendingNavigation]);

	const handleCancelPendingPresetChange = useCallback(() => {
		setPendingNavigation(null);
	}, []);

	const handleSavePreset = useCallback(
		async (name: string) => {
			const stored = await saveLocalPreset(name);
			setActivePresetId(stored.id);
			setActivePresetNameBase(stored.name);
			captureLoadedPresetFingerprint();
		},
		[captureLoadedPresetFingerprint, saveLocalPreset],
	);

	const handleDeletePreset = useCallback(
		async (id: string) => {
			await deletePreset(id);
			await Promise.all([
				refreshLocalPresetEntries(),
				refreshFavoritePresetIds(),
			]);
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
		async (id: string, newName: string) => {
			const trimmed = newName.trim();
			if (!trimmed) return;
			const renamed = await loadStoredPreset(id);
			if (renamed?.name === trimmed) {
				return;
			}
			await renamePreset(id, trimmed);
			await refreshLocalPresetEntries();
			setActivePresetNameBase((previous) =>
				activePresetId === id ? trimmed : previous,
			);
		},
		[activePresetId, refreshLocalPresetEntries],
	);

	const handleSetPresetFavorite = useCallback(
		async (id: string, favorite: boolean) => {
			await setPresetFavorite(id, favorite);
			await refreshFavoritePresetIds();
		},
		[refreshFavoritePresetIds],
	);

	const handleSetPresetAuthor = useCallback(
		async (id: string, author: string) => {
			if (!(await updateStoredPreset(id, { author: author.trim() }))) {
				return;
			}
			await refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleSetPresetTags = useCallback(
		async (id: string, tags: PresetTagOptions[]) => {
			if (!(await updatePresetMetadata(id, { tags }))) {
				return;
			}
			await refreshLocalPresetEntries();
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

	const handleExportPreset = useCallback(async (id: string) => {
		const json = await exportPreset(id);
		if (!json) return;
		const preset = await loadStoredPreset(id);
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
		async (json: string, filename: string) => {
			const importedPreset = await importPreset(json);
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
			const stored = await saveStoredPreset({
				name: candidate,
				data: importedPreset.data,
				source: "user",
				author: importedPreset.author,
				starred: importedPreset.starred,
				tags: importedPreset.tags,
			});
			await refreshLocalPresetEntries();
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
			const presetState = gatherPresetState();
			const json = JSON.stringify({ _name: name, ...presetState }, null, 2);
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = `${name}.json`;
			anchor.click();
			URL.revokeObjectURL(url);
		},
		[gatherPresetState],
	);

	usePresetManagerPersistence({
		refreshFavoritePresetIds,
		refreshLocalPresetEntries,
	});

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
