import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import {
	type PresetImportFile,
	preparePresetImportFiles,
} from "@/lib/synth/presetImport";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import type {
	ExportedPresetFile,
	PresetImportBatchResult,
	PresetLibraryStatus,
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
	libraryStatus: PresetLibraryStatus;
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
	savePresetAs: (name: string) => Promise<void>;
	deletePreset: (id: string) => Promise<void>;
	renamePreset: (id: string, newName: string) => Promise<void>;
	setPresetAuthor: (id: string, author: string) => Promise<void>;
	setPresetDescription: (id: string, description: string) => Promise<void>;
	setPresetFavorite: (id: string, favorite: boolean) => Promise<void>;
	setPresetTags: (id: string, tags: PresetTagOptions[]) => Promise<void>;
	initPreset: () => Promise<void>;
	exportPreset: (id: string) => Promise<ExportedPresetFile | null>;
	importPreset: (json: string, filename: string) => Promise<void>;
	importPresetFiles: (
		files: PresetImportFile[],
	) => Promise<PresetImportBatchResult>;
	exportCurrentState: (name: string) => Promise<ExportedPresetFile>;
	recomputeDirtyState: () => void;
	reloadLibrary: () => Promise<void>;
	retryLibrary: () => Promise<void>;
	repairLibrary: () => Promise<void>;
	rebuildLibrary: () => Promise<void>;
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
	const [libraryStatus, setLibraryStatus] = useState<PresetLibraryStatus>({
		state: "loading",
	});
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
		const snapshot = await repository.listEntries();
		const nextEntries = snapshot.entries;
		setAllPresetEntries(nextEntries);
		setLibraryStatus(snapshot.status);
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

	const runLibraryRecovery = useCallback(
		async (action: (() => Promise<void>) | undefined) => {
			if (!action) {
				return;
			}
			try {
				await action();
				await reloadLibrary();
			} catch (error) {
				setLibraryStatus({
					state: "degraded",
					message: error instanceof Error ? error.message : String(error),
				});
			}
		},
		[reloadLibrary],
	);

	const retryLibrary = useCallback(
		() => runLibraryRecovery(repository.retryLibrary),
		[repository.retryLibrary, runLibraryRecovery],
	);
	const repairLibrary = useCallback(
		() => runLibraryRecovery(repository.repairLibrary),
		[repository.repairLibrary, runLibraryRecovery],
	);
	const rebuildLibrary = useCallback(
		() => runLibraryRecovery(repository.rebuildLibrary),
		[repository.rebuildLibrary, runLibraryRecovery],
	);

	useEffect(() => {
		if (presetEditVersion < 0) {
			return;
		}
		recomputeDirtyState();
	}, [presetEditVersion, recomputeDirtyState]);

	useEffect(() => {
		void reloadLibrary().catch((error) => {
			setLibraryStatus({
				state: "degraded",
				message: error instanceof Error ? error.message : String(error),
			});
		});
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
				mode: "overwrite",
			});
			await reloadLibrary();
			commitPresetSelection(session.session, { stateSync: session.stateSync });
		},
		[activeLocalPreset, commitPresetSelection, reloadLibrary, repository],
	);

	const savePresetAs = useCallback(
		async (name: string) => {
			const session = await repository.savePreset({
				existingEntry: activeLocalPreset,
				name,
				mode: "create",
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

	const setPresetDescription = useCallback(
		async (id: string, description: string) => {
			await repository.setPresetDescription(id, description.trim());
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
			await reloadLibrary();
			if (!activation) {
				return;
			}
			commitPresetSelection(activation.session, {
				stateSync: activation.stateSync,
			});
		},
		[commitPresetSelection, reloadLibrary, repository],
	);

	const importPresetFiles = useCallback(
		async (files: PresetImportFile[]): Promise<PresetImportBatchResult> => {
			const preparation = preparePresetImportFiles(files);
			const failures = [...preparation.failures];
			let importedCount = 0;
			let lastActivation: Awaited<
				ReturnType<PresetManagerRepository["importPreset"]>
			> | null = null;

			for (const prepared of preparation.imports) {
				try {
					const activation = await repository.importPreset(
						prepared.json,
						prepared.filename,
					);
					if (!activation) {
						failures.push({
							filename: prepared.filename,
							reason: "Invalid preset file.",
						});
						continue;
					}
					importedCount += 1;
					lastActivation = activation;
				} catch {
					failures.push({
						filename: prepared.filename,
						reason: "Invalid preset file.",
					});
				}
			}

			if (preparation.imports.length > 0 || importedCount > 0) {
				await reloadLibrary();
			}
			if (lastActivation) {
				commitPresetSelection(lastActivation.session, {
					stateSync: lastActivation.stateSync,
				});
			}

			return { importedCount, failures };
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
			libraryStatus,
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
			savePresetAs,
			deletePreset,
			renamePreset,
			setPresetAuthor,
			setPresetDescription,
			setPresetFavorite,
			setPresetTags,
			initPreset,
			exportPreset,
			importPreset,
			importPresetFiles,
			exportCurrentState,
			recomputeDirtyState,
			reloadLibrary,
			retryLibrary,
			repairLibrary,
			rebuildLibrary,
		}),
		[
			activePresetId,
			activePresetName,
			activePresetNameBase,
			activatePreset,
			allPresetEntries,
			libraryStatus,
			deletePreset,
			exportCurrentState,
			exportPreset,
			importPreset,
			importPresetFiles,
			initPreset,
			isPresetDirty,
			navigationEntryIds,
			reloadLibrary,
			retryLibrary,
			repairLibrary,
			rebuildLibrary,
			renamePreset,
			savePreset,
			savePresetAs,
			setNavigationEntryIds,
			setPresetAuthor,
			setPresetDescription,
			setPresetFavorite,
			setPresetTags,
			stepPreset,
			syncExternalSelection,
			recomputeDirtyState,
		],
	);
}
