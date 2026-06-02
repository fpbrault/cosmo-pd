import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
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
import { buildAllPresetEntries } from "./synthPresetManagerHelpers";
import { usePresetManagerPersistence } from "./usePresetManagerPersistence";

type UseSynthPresetManagerOptions = {
	builtinPresets?: Record<string, FrontendPresetV1>;
	gatherPresetState: () => SynthPresetV1;
	applyPreset: (data: SynthPresetV1) => void;
	onBeforeApplyPreset?: () => void;
	libraryPresets?: LibraryPreset[];
	onLoadLibraryPreset?: (preset: LibraryPreset) => void;
	onLoadPresetData?: (id: string) => Promise<string>;
	initialIsPresetDirty?: boolean;
};

type UseSynthPresetManagerResult = {
	allPresetEntries: PresetEntry[];
	visiblePresetEntries: PresetEntry[];
	activePresetId: string | null;
	activePresetNameBase: string;
	activePresetName: string;
	isPresetDirty: boolean;
	handleSyncPresetSelection: (
		name: string,
		options?: { isDirty?: boolean },
	) => void;
	handleLoadPresetByName: (name: string) => void;
	handleSyncBuiltinSelection: (
		name: string,
		options?: { isDirty?: boolean },
	) => void;
	handleLoadLocal: (id: string) => Promise<void>;
	handleLoadBuiltin: (name: string) => void;
	handleLoadLibrary: (preset: LibraryPreset) => void;
	handleStepPreset: (direction: -1 | 1) => void;
	handleSavePreset: (name: string) => Promise<void>;
	handleDeletePreset: (id: string) => Promise<void>;
	handleRenamePreset: (id: string, newName: string) => Promise<void>;
	handleSetPresetAuthor: (id: string, author: string) => Promise<void>;
	handleSetPresetFavorite: (id: string, favorite: boolean) => Promise<void>;
	handleSetPresetTags: (id: string, tags: PresetTagOptions[]) => Promise<void>;
	handleInitPreset: () => void;
	handleExportPreset: (id: string) => Promise<void>;
	handleImportPreset: (json: string, filename: string) => Promise<void>;
	handleExportCurrentState: (name: string) => void;
	markPresetDirty: () => void;
	setPresetDirtyState: (dirty: boolean) => void;
};

function normalizeBuiltinPresets(
	builtinPresets: Record<string, FrontendPresetV1>,
): LibraryPreset[] {
	return Object.values(builtinPresets).map((preset) => ({
		id: preset.id,
		name: preset.name,
		source: preset.source,
		author: preset.author,
		starred: preset.starred,
		data: preset.data,
		tags: preset.tags,
	}));
}

export function useSynthPresetManager({
	builtinPresets = {},
	gatherPresetState,
	applyPreset,
	onBeforeApplyPreset,
	libraryPresets = [],
	onLoadLibraryPreset,
	onLoadPresetData,
	initialIsPresetDirty = false,
}: UseSynthPresetManagerOptions): UseSynthPresetManagerResult {
	const [localPresetEntries, setLocalPresetEntries] = useState<StoredPreset[]>(
		[],
	);
	const [favoritePresetIds, setFavoritePresetIds] = useState<string[]>([]);
	const [activePresetId, setActivePresetId] = useState<string | null>(null);
	const [activePresetNameBase, setActivePresetNameBase] =
		useState("Current State");
	const [isPresetDirty, setIsPresetDirty] = useState(initialIsPresetDirty);
	const mergedLibraryPresets = useMemo(
		() => [...normalizeBuiltinPresets(builtinPresets), ...libraryPresets],
		[builtinPresets, libraryPresets],
	);
	const libraryPresetByName = useMemo(
		() => new Map(mergedLibraryPresets.map((preset) => [preset.name, preset])),
		[mergedLibraryPresets],
	);
	const activePresetName = isPresetDirty
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
	const presetEditVersion = useSynthStore((state) => state.presetEditVersion);
	const lastCleanEditVersionRef = useRef(presetEditVersion);
	const dirtyEditVersionRef = useRef(presetEditVersion);

	const setPresetDirtyState = useCallback((dirty: boolean) => {
		if (dirty) {
			dirtyEditVersionRef.current = useSynthStore.getState().presetEditVersion;
			setIsPresetDirty(true);
			return;
		}

		const currentVersion = useSynthStore.getState().presetEditVersion;
		lastCleanEditVersionRef.current = currentVersion;
		dirtyEditVersionRef.current = currentVersion;
		setIsPresetDirty(false);
	}, []);

	const markPresetDirty = useCallback(() => {
		if (isPresetDirty) {
			return;
		}
		dirtyEditVersionRef.current = useSynthStore.getState().presetEditVersion;
		setIsPresetDirty(true);
	}, [isPresetDirty]);

	useEffect(() => {
		if (presetEditVersion === lastCleanEditVersionRef.current) {
			return;
		}
		if (presetEditVersion <= dirtyEditVersionRef.current) {
			return;
		}
		setIsPresetDirty(true);
	}, [presetEditVersion]);

	useEffect(() => {
		if (initialIsPresetDirty) {
			dirtyEditVersionRef.current = useSynthStore.getState().presetEditVersion;
		} else {
			lastCleanEditVersionRef.current =
				useSynthStore.getState().presetEditVersion;
			dirtyEditVersionRef.current = lastCleanEditVersionRef.current;
		}
		setIsPresetDirty(initialIsPresetDirty);
	}, [initialIsPresetDirty]);

	const refreshLocalPresetEntries = useCallback(async () => {
		setLocalPresetEntries(await listStoredPresets());
	}, []);

	const refreshFavoritePresetIds = useCallback(async () => {
		setFavoritePresetIds(await listPresetFavorites());
	}, []);

	const commitPresetSelection = useCallback(
		(id: string | null, name: string, dirty = false) => {
			setActivePresetId(id);
			setActivePresetNameBase(name);
			setPresetDirtyState(dirty);
		},
		[setPresetDirtyState],
	);

	const loadLocalPreset = useCallback(
		async (id: string) => {
			if (onLoadPresetData) {
				onBeforeApplyPreset?.();
				const name = await onLoadPresetData(id);
				commitPresetSelection(id, name, false);
				return;
			}
			const preset = await loadStoredPreset(id);
			if (!preset) return;
			onBeforeApplyPreset?.();
			applyPreset(preset.data);
			commitPresetSelection(preset.id, preset.name, false);
		},
		[applyPreset, commitPresetSelection, onBeforeApplyPreset, onLoadPresetData],
	);

	const loadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (onLoadPresetData) {
				onBeforeApplyPreset?.();
				void onLoadPresetData(preset.id).then((name) => {
					commitPresetSelection(preset.id, name, false);
				});
				return;
			}
			if (preset.data) {
				onBeforeApplyPreset?.();
				applyPreset(preset.data);
				commitPresetSelection(preset.id, preset.name, false);
				return;
			}
			if (!onLoadLibraryPreset) return;
			onBeforeApplyPreset?.();
			onLoadLibraryPreset(preset);
			commitPresetSelection(preset.id, preset.name, false);
		},
		[
			applyPreset,
			commitPresetSelection,
			onBeforeApplyPreset,
			onLoadLibraryPreset,
			onLoadPresetData,
		],
	);

	const handleLoadLocal = useCallback(
		async (id: string) => {
			await loadLocalPreset(id);
		},
		[loadLocalPreset],
	);

	const handleLoadPresetByName = useCallback(
		(name: string) => {
			const preset = libraryPresetByName.get(name);
			if (!preset) {
				return;
			}
			loadLibraryPreset(preset);
		},
		[libraryPresetByName, loadLibraryPreset],
	);

	const handleSyncPresetSelection = useCallback(
		(name: string, options?: { isDirty?: boolean }) => {
			const preset = libraryPresetByName.get(name);
			commitPresetSelection(
				preset?.id ?? null,
				name,
				options?.isDirty ?? false,
			);
		},
		[commitPresetSelection, libraryPresetByName],
	);

	const handleLoadLibrary = useCallback(
		(preset: LibraryPreset) => {
			loadLibraryPreset(preset);
		},
		[loadLibraryPreset],
	);

	const allPresetEntries = useMemo(
		() =>
			buildAllPresetEntries({
				localPresetEntries,
				libraryPresets: mergedLibraryPresets,
				favoritePresetIds,
			}),
		[favoritePresetIds, localPresetEntries, mergedLibraryPresets],
	);

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
				void handleLoadLocal(entry.id);
				return;
			}
			if (entry.preset) {
				handleLoadLibrary(entry.preset);
			}
		},
		[activePresetIndex, allPresetEntries, handleLoadLibrary, handleLoadLocal],
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

	const handleSavePreset = useCallback(
		async (name: string) => {
			const stored = await saveLocalPreset(name);
			commitPresetSelection(stored.id, stored.name, false);
		},
		[commitPresetSelection, saveLocalPreset],
	);

	const handleDeletePreset = useCallback(
		async (id: string) => {
			await deletePreset(id);
			await Promise.all([
				refreshLocalPresetEntries(),
				refreshFavoritePresetIds(),
			]);
			if (activePresetId === id) {
				commitPresetSelection(null, "Current State", false);
			}
		},
		[
			activePresetId,
			commitPresetSelection,
			refreshFavoritePresetIds,
			refreshLocalPresetEntries,
		],
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
		commitPresetSelection(null, "Current State", false);
	}, [applyPreset, commitPresetSelection, onBeforeApplyPreset]);

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
			commitPresetSelection(stored.id, stored.name, false);
		},
		[
			applyPreset,
			commitPresetSelection,
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
		isPresetDirty,
		handleSyncPresetSelection,
		handleLoadPresetByName,
		handleSyncBuiltinSelection: handleSyncPresetSelection,
		handleLoadLocal,
		handleLoadBuiltin: handleLoadPresetByName,
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
		markPresetDirty,
		setPresetDirtyState,
	};
}
