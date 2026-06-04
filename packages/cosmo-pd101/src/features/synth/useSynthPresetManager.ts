import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import type {
	ExportedPresetFile,
	PresetManagerRepository,
	PresetManagerSession,
	PresetStateSync,
} from "./presetManagerRepository";
import type { PresetEntry } from "./types/presetEntry";

type UseSynthPresetManagerOptions = {
	repository: PresetManagerRepository;
};

export type PresetEntryId = string;

export type PresetRef = {
	entryId: PresetEntryId;
};

export interface PresetManagerController {
	allPresetEntries: PresetEntry[];
	navigationEntryIds: PresetEntryId[];
	activePresetId: string | null;
	activePresetNameBase: string;
	activePresetName: string;
	isPresetDirty: boolean;
	syncExternalSelection: (
		session: PresetManagerSession,
		options?: { stateSync?: PresetStateSync },
	) => void;
	activatePreset: (ref: PresetRef) => Promise<void>;
	setNavigationEntryIds: (entryIds: PresetEntryId[]) => void;
	stepPreset: (direction: -1 | 1) => Promise<void>;
	savePreset: (name: string) => Promise<void>;
	deletePreset: (id: string) => Promise<void>;
	renamePreset: (id: string, newName: string) => Promise<void>;
	setPresetAuthor: (id: string, author: string) => Promise<void>;
	setPresetFavorite: (id: string, favorite: boolean) => Promise<void>;
	setPresetTags: (id: string, tags: PresetTagOptions[]) => Promise<void>;
	initPreset: () => Promise<void>;
	exportPreset: (id: string) => Promise<ExportedPresetFile | null>;
	importPreset: (json: string, filename: string) => Promise<void>;
	exportCurrentState: (name: string) => Promise<ExportedPresetFile>;
	recomputeDirtyState: () => void;
	reloadLibrary: () => Promise<void>;
}

function normalizeNavigationEntryIds(
	entryIds: PresetEntryId[],
	allPresetEntries: PresetEntry[],
): PresetEntryId[] {
	const validEntryIds = new Set(allPresetEntries.map((entry) => entry.id));
	const dedupedEntryIds: PresetEntryId[] = [];
	for (const entryId of entryIds) {
		if (!validEntryIds.has(entryId) || dedupedEntryIds.includes(entryId)) {
			continue;
		}
		dedupedEntryIds.push(entryId);
	}
	return dedupedEntryIds;
}

function areEntryIdListsEqual(
	left: PresetEntryId[],
	right: PresetEntryId[],
): boolean {
	return (
		left.length === right.length &&
		left.every((entryId, index) => entryId === right[index])
	);
}

export function useSynthPresetManager({
	repository,
}: UseSynthPresetManagerOptions): PresetManagerController {
	const [allPresetEntries, setAllPresetEntries] = useState<PresetEntry[]>([]);
	const [navigationEntryIds, setNavigationEntryIdsState] = useState<
		PresetEntryId[]
	>([]);
	const [activePresetId, setActivePresetId] = useState<string | null>(null);
	const [activePresetNameBase, setActivePresetNameBase] =
		useState("Current State");
	const [isPresetDirty, setIsPresetDirty] = useState(false);
	const presetEditVersion = useSynthStore((state) => state.presetEditVersion);
	const gatherPresetState = useSynthStore((state) => state.gatherPresetState);
	const cleanBaselineFingerprintRef = useRef<string | null>(null);
	const pendingBaselineSyncRef = useRef(false);
	const restoredDirtyWithoutBaselineRef = useRef(false);

	const activePresetName = isPresetDirty
		? `${activePresetNameBase} *`
		: activePresetNameBase;
	const activeLocalPreset = useMemo(
		() =>
			activePresetId
				? (allPresetEntries.find(
						(entry) => entry.id === activePresetId && entry.type === "local",
					) ?? null)
				: null,
		[activePresetId, allPresetEntries],
	);

	const getCurrentPresetFingerprint = useCallback(
		() => JSON.stringify(gatherPresetState()),
		[gatherPresetState],
	);

	const commitDirtyTracking = useCallback(
		({
			isDirty,
			stateSync,
		}: {
			isDirty: boolean;
			stateSync: PresetStateSync;
		}) => {
			if (isDirty) {
				cleanBaselineFingerprintRef.current = null;
				pendingBaselineSyncRef.current = false;
				restoredDirtyWithoutBaselineRef.current = true;
				setIsPresetDirty(true);
				return;
			}

			restoredDirtyWithoutBaselineRef.current = false;
			if (stateSync === "deferred") {
				cleanBaselineFingerprintRef.current = null;
				pendingBaselineSyncRef.current = true;
				setIsPresetDirty(false);
				return;
			}

			cleanBaselineFingerprintRef.current = getCurrentPresetFingerprint();
			pendingBaselineSyncRef.current = false;
			setIsPresetDirty(false);
		},
		[getCurrentPresetFingerprint],
	);

	const recomputeDirtyState = useCallback(() => {
		const currentFingerprint = getCurrentPresetFingerprint();
		if (pendingBaselineSyncRef.current) {
			cleanBaselineFingerprintRef.current = currentFingerprint;
			pendingBaselineSyncRef.current = false;
			restoredDirtyWithoutBaselineRef.current = false;
			setIsPresetDirty(false);
			return;
		}

		if (restoredDirtyWithoutBaselineRef.current) {
			setIsPresetDirty(true);
			return;
		}

		if (cleanBaselineFingerprintRef.current === null) {
			cleanBaselineFingerprintRef.current = currentFingerprint;
			setIsPresetDirty(false);
			return;
		}

		setIsPresetDirty(
			currentFingerprint !== cleanBaselineFingerprintRef.current,
		);
	}, [getCurrentPresetFingerprint]);

	const commitPresetSelection = useCallback(
		(
			session: PresetManagerSession,
			options: { stateSync?: PresetStateSync } = {},
		) => {
			setActivePresetId(session.activePresetId);
			setActivePresetNameBase(session.activePresetNameBase);
			commitDirtyTracking({
				isDirty: session.isDirty,
				stateSync: options.stateSync ?? "immediate",
			});
		},
		[commitDirtyTracking],
	);

	const reloadLibrary = useCallback(async () => {
		const nextEntries = await repository.listEntries();
		setAllPresetEntries(nextEntries);
		setNavigationEntryIdsState((current) => {
			const normalizedCurrent = normalizeNavigationEntryIds(
				current,
				nextEntries,
			);
			if (normalizedCurrent.length > 0) {
				return areEntryIdListsEqual(current, normalizedCurrent)
					? current
					: normalizedCurrent;
			}
			const defaultEntryIds = nextEntries.map((entry) => entry.id);
			return areEntryIdListsEqual(current, defaultEntryIds)
				? current
				: defaultEntryIds;
		});
	}, [repository]);

	useEffect(() => {
		if (presetEditVersion < 0) {
			return;
		}
		recomputeDirtyState();
	}, [presetEditVersion, recomputeDirtyState]);

	useEffect(() => {
		void reloadLibrary();
	}, [reloadLibrary]);

	const syncExternalSelection = useCallback(
		(
			session: PresetManagerSession,
			options: { stateSync?: PresetStateSync } = {},
		) => {
			commitPresetSelection(session, options);
		},
		[commitPresetSelection],
	);

	const activatePreset = useCallback(
		async ({ entryId }: PresetRef) => {
			const entry = allPresetEntries.find(
				(candidate) => candidate.id === entryId,
			);
			if (!entry) {
				return;
			}
			const activation = await repository.loadEntry(entry);
			if (!activation) {
				return;
			}
			commitPresetSelection(activation.session, {
				stateSync: activation.stateSync,
			});
		},
		[allPresetEntries, commitPresetSelection, repository],
	);

	const setNavigationEntryIds = useCallback(
		(entryIds: PresetEntryId[]) => {
			setNavigationEntryIdsState((current) => {
				const normalizedEntryIds = normalizeNavigationEntryIds(
					entryIds,
					allPresetEntries,
				);
				return areEntryIdListsEqual(current, normalizedEntryIds)
					? current
					: normalizedEntryIds;
			});
		},
		[allPresetEntries],
	);

	const stepPreset = useCallback(
		async (direction: -1 | 1) => {
			if (navigationEntryIds.length === 0) {
				return;
			}

			const currentIndex = activePresetId
				? navigationEntryIds.indexOf(activePresetId)
				: -1;
			const nextIndex =
				currentIndex < 0
					? direction === 1
						? 0
						: navigationEntryIds.length - 1
					: (currentIndex + direction + navigationEntryIds.length) %
						navigationEntryIds.length;
			const nextEntryId = navigationEntryIds[nextIndex];
			if (!nextEntryId) {
				return;
			}

			await activatePreset({ entryId: nextEntryId });
		},
		[activatePreset, activePresetId, navigationEntryIds],
	);

	const savePreset = useCallback(
		async (name: string) => {
			const session = await repository.savePreset({
				existingEntry: activeLocalPreset,
				name,
			});
			await reloadLibrary();
			commitPresetSelection(session.session, { stateSync: session.stateSync });
		},
		[activeLocalPreset, commitPresetSelection, reloadLibrary, repository],
	);

	const deletePreset = useCallback(
		async (id: string) => {
			await repository.deletePreset(id);
			await reloadLibrary();
			if (activePresetId === id) {
				commitPresetSelection({
					activePresetId: null,
					activePresetNameBase: "Current State",
					isDirty: false,
				});
			}
		},
		[activePresetId, commitPresetSelection, reloadLibrary, repository],
	);

	const renamePreset = useCallback(
		async (id: string, newName: string) => {
			const trimmed = newName.trim();
			if (!trimmed) {
				return;
			}
			await repository.renamePreset(id, trimmed);
			await reloadLibrary();
			setActivePresetNameBase((previous) =>
				activePresetId === id ? trimmed : previous,
			);
		},
		[activePresetId, reloadLibrary, repository],
	);

	const setPresetFavorite = useCallback(
		async (id: string, favorite: boolean) => {
			await repository.setPresetFavorite(id, favorite);
			await reloadLibrary();
		},
		[reloadLibrary, repository],
	);

	const setPresetAuthor = useCallback(
		async (id: string, author: string) => {
			await repository.setPresetAuthor(id, author.trim());
			await reloadLibrary();
		},
		[reloadLibrary, repository],
	);

	const setPresetTags = useCallback(
		async (id: string, tags: PresetTagOptions[]) => {
			await repository.setPresetTags(id, tags);
			await reloadLibrary();
		},
		[reloadLibrary, repository],
	);

	const initPreset = useCallback(async () => {
		const activation = await repository.initPreset();
		commitPresetSelection(activation.session, {
			stateSync: activation.stateSync,
		});
	}, [commitPresetSelection, repository]);

	const exportPreset = useCallback(
		async (id: string) => repository.exportPreset(id),
		[repository],
	);

	const importPreset = useCallback(
		async (json: string, filename: string) => {
			const activation = await repository.importPreset(json, filename);
			if (!activation) {
				return;
			}
			await reloadLibrary();
			commitPresetSelection(activation.session, {
				stateSync: activation.stateSync,
			});
		},
		[commitPresetSelection, reloadLibrary, repository],
	);

	const exportCurrentState = useCallback(
		async (name: string) => repository.exportCurrentState(name),
		[repository],
	);

	return useMemo(
		() => ({
			allPresetEntries,
			navigationEntryIds,
			activePresetId,
			activePresetNameBase,
			activePresetName,
			isPresetDirty,
			syncExternalSelection,
			activatePreset,
			setNavigationEntryIds,
			stepPreset,
			savePreset,
			deletePreset,
			renamePreset,
			setPresetAuthor,
			setPresetFavorite,
			setPresetTags,
			initPreset,
			exportPreset,
			importPreset,
			exportCurrentState,
			recomputeDirtyState,
			reloadLibrary,
		}),
		[
			activePresetId,
			activePresetName,
			activePresetNameBase,
			activatePreset,
			allPresetEntries,
			deletePreset,
			exportCurrentState,
			exportPreset,
			importPreset,
			initPreset,
			isPresetDirty,
			navigationEntryIds,
			reloadLibrary,
			renamePreset,
			savePreset,
			setNavigationEntryIds,
			setPresetAuthor,
			setPresetFavorite,
			setPresetTags,
			stepPreset,
			syncExternalSelection,
			recomputeDirtyState,
		],
	);
}
