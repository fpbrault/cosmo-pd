import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import type {
	ExportedPresetFile,
	PresetManagerRepository,
	PresetManagerSession,
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
	syncExternalSelection: (session: PresetManagerSession) => void;
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
	markDirtyFromEdit: () => void;
	syncDirtyState: (dirty: boolean) => void;
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
	const lastCleanEditVersionRef = useRef(presetEditVersion);
	const dirtyEditVersionRef = useRef(presetEditVersion);

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

	const syncDirtyState = useCallback((dirty: boolean) => {
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

	const commitPresetSelection = useCallback(
		(session: PresetManagerSession) => {
			setActivePresetId(session.activePresetId);
			setActivePresetNameBase(session.activePresetNameBase);
			syncDirtyState(session.isDirty);
		},
		[syncDirtyState],
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
				return normalizedCurrent;
			}
			return nextEntries.map((entry) => entry.id);
		});
	}, [repository]);

	const markDirtyFromEdit = useCallback(() => {
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
		void reloadLibrary();
	}, [reloadLibrary]);

	const syncExternalSelection = useCallback(
		(session: PresetManagerSession) => {
			commitPresetSelection(session);
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
			const session = await repository.loadEntry(entry);
			if (!session) {
				return;
			}
			commitPresetSelection(session);
		},
		[allPresetEntries, commitPresetSelection, repository],
	);

	const setNavigationEntryIds = useCallback(
		(entryIds: PresetEntryId[]) => {
			setNavigationEntryIdsState(
				normalizeNavigationEntryIds(entryIds, allPresetEntries),
			);
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
			commitPresetSelection(session);
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
		const session = await repository.initPreset();
		commitPresetSelection(session);
	}, [commitPresetSelection, repository]);

	const exportPreset = useCallback(
		async (id: string) => repository.exportPreset(id),
		[repository],
	);

	const importPreset = useCallback(
		async (json: string, filename: string) => {
			const session = await repository.importPreset(json, filename);
			if (!session) {
				return;
			}
			await reloadLibrary();
			commitPresetSelection(session);
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
			markDirtyFromEdit,
			syncDirtyState,
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
			markDirtyFromEdit,
			navigationEntryIds,
			reloadLibrary,
			renamePreset,
			savePreset,
			setNavigationEntryIds,
			setPresetAuthor,
			setPresetFavorite,
			setPresetTags,
			stepPreset,
			syncDirtyState,
			syncExternalSelection,
		],
	);
}
