import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { usePresetLibraryFilters } from "./PresetLibraryFiltersContext";
import {
	applyPresetLibraryFilters,
	getPresetFilterOptions,
} from "./presetLibraryFilters";
import {
	getVirtualRowHeight,
	type SortKey,
	VIRTUAL_OVERSCAN_PX,
	type VirtualPresetRow,
} from "./presetLibraryShared";
import { sortPresetLibraryEntries } from "./presetLibrarySort";

type UsePresetLibraryStateOptions = {
	allEntries: PresetEntry[];
	activeEntryId: string | null;
	activePresetName: string;
	isOpen: boolean;
	onNavigationEntriesChange?: (entryIds: string[]) => void;
};

export function usePresetLibraryState({
	allEntries,
	activeEntryId,
	activePresetName,
	isOpen,
	onNavigationEntriesChange,
}: UsePresetLibraryStateOptions) {
	const {
		search,
		setSearch,
		authorFilter: selectedAuthorFilter,
		setAuthorFilter: setSelectedAuthorFilter,
		bankFilter: selectedBankFilter,
		setBankFilter: setSelectedBankFilter,
		tagFilters: selectedTagFilters,
		setTagFilters: setSelectedTagFilters,
		sortState,
		setSortState,
	} = usePresetLibraryFilters();
	const [saveName, setSaveName] = useState("");
	const [saveAsOpen, setSaveAsOpen] = useState(false);
	const [saveAsName, setSaveAsName] = useState("");
	const [renameValue, setRenameValue] = useState("");
	const [authorValue, setAuthorValue] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");
	const [focusedEntryId, setFocusedEntryId] = useState(activeEntryId);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [virtualScrollTop, setVirtualScrollTop] = useState(0);
	const [virtualViewportHeight, setVirtualViewportHeight] = useState(0);
	const lastNavigationEntryIdsRef = useRef<string[]>([]);

	const { bankOptions, authorOptions, tagOptions } = useMemo(
		() =>
			getPresetFilterOptions(allEntries, {
				search,
				authorFilter: selectedAuthorFilter,
				bankFilter: selectedBankFilter,
				tagFilters: selectedTagFilters,
			}),
		[
			allEntries,
			search,
			selectedAuthorFilter,
			selectedBankFilter,
			selectedTagFilters,
		],
	);

	const filteredEntries = useMemo(() => {
		return applyPresetLibraryFilters(allEntries, {
			search,
			authorFilter: selectedAuthorFilter,
			bankFilter: selectedBankFilter,
			tagFilters: selectedTagFilters,
		}).sort((a, b) => {
			return a.label.localeCompare(b.label, undefined, {
				numeric: true,
				sensitivity: "base",
			});
		});
	}, [
		allEntries,
		search,
		selectedAuthorFilter,
		selectedBankFilter,
		selectedTagFilters,
	]);

	const sortedEntries = useMemo(
		() => sortPresetLibraryEntries(filteredEntries, sortState),
		[filteredEntries, sortState],
	);

	const virtualRows = useMemo<VirtualPresetRow[]>(
		() =>
			sortedEntries.map((entry) => ({
				id: entry.id,
				kind: "entry" as const,
				entry,
			})),
		[sortedEntries],
	);

	const virtualLayout = useMemo(() => {
		let totalHeight = 0;
		const offsets = virtualRows.map(() => {
			const offset = totalHeight;
			totalHeight += getVirtualRowHeight();
			return offset;
		});
		return { offsets, totalHeight };
	}, [virtualRows]);

	const visibleVirtualRows = useMemo(() => {
		const listScrollTop = Math.max(0, virtualScrollTop);
		const startBoundary = Math.max(0, listScrollTop - VIRTUAL_OVERSCAN_PX);
		const endBoundary =
			listScrollTop + virtualViewportHeight + VIRTUAL_OVERSCAN_PX;
		let startIndex = 0;
		while (
			startIndex < virtualRows.length &&
			virtualLayout.offsets[startIndex] + getVirtualRowHeight() < startBoundary
		) {
			startIndex++;
		}

		let endIndex = startIndex;
		while (
			endIndex < virtualRows.length &&
			virtualLayout.offsets[endIndex] < endBoundary
		) {
			endIndex++;
		}

		return virtualRows.slice(startIndex, endIndex).map((row, index) => {
			const rowIndex = startIndex + index;
			return { row, rowIndex, top: virtualLayout.offsets[rowIndex] };
		});
	}, [
		virtualLayout.offsets,
		virtualRows,
		virtualScrollTop,
		virtualViewportHeight,
	]);

	const focusedEntry = sortedEntries.find(
		(entry) => entry.id === focusedEntryId,
	);
	const activeLocalEntry =
		activeEntryId === null
			? null
			: allEntries.find(
					(entry) => entry.id === activeEntryId && entry.type === "local",
				);
	const activeEntry =
		activeEntryId === null
			? null
			: allEntries.find((entry) => entry.id === activeEntryId);
	const selectedEntry = focusedEntry ?? activeEntry;
	const selectedLocalEntry =
		selectedEntry?.type === "local" ? selectedEntry : null;

	useEffect(() => {
		if (!isOpen) return;
		if (sortedEntries.length === 0) {
			setFocusedEntryId(null);
			return;
		}
		if (!sortedEntries.some((entry) => entry.id === focusedEntryId)) {
			setFocusedEntryId(activeEntryId ?? sortedEntries[0]?.id ?? null);
		}
	}, [activeEntryId, sortedEntries, focusedEntryId, isOpen]);

	useEffect(() => {
		if (!isOpen || !onNavigationEntriesChange) {
			return;
		}
		const nextEntryIds = sortedEntries.map((entry) => entry.id);
		const previousEntryIds = lastNavigationEntryIdsRef.current;
		const unchanged =
			nextEntryIds.length === previousEntryIds.length &&
			nextEntryIds.every(
				(entryId, index) => entryId === previousEntryIds[index],
			);
		if (unchanged) {
			return;
		}
		lastNavigationEntryIdsRef.current = nextEntryIds;
		onNavigationEntriesChange(nextEntryIds);
	}, [isOpen, onNavigationEntriesChange, sortedEntries]);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) return;

		const updateViewportHeight = () => {
			setVirtualViewportHeight(scrollContainer.clientHeight);
			setVirtualScrollTop(scrollContainer.scrollTop);
		};

		updateViewportHeight();
		const resizeObserver = new ResizeObserver(updateViewportHeight);
		resizeObserver.observe(scrollContainer);
		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	const toggleSort = useCallback(
		(key: SortKey) => {
			const scrollContainer = scrollContainerRef.current;
			if (scrollContainer) scrollContainer.scrollTop = 0;
			setVirtualScrollTop(0);
			setSortState((prev) => {
				if (prev.key === key) {
					return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
				}
				return {
					key,
					direction: key === "favorite" || key === "star" ? "desc" : "asc",
				};
			});
		},
		[setSortState],
	);

	const sortIndicator = useCallback(
		(key: SortKey) => {
			if (sortState.key !== key) return "";
			return sortState.direction === "asc" ? " ▲" : " ▼";
		},
		[sortState],
	);

	useEffect(() => {
		setRenameValue(selectedLocalEntry?.label ?? "");
		setAuthorValue(selectedLocalEntry?.author ?? "");
		setDescriptionValue(selectedLocalEntry?.description ?? "");
	}, [selectedLocalEntry]);

	useEffect(() => {
		if (!isOpen) return;
		setSaveName(activePresetName.replace(/\s+\*$/, ""));
	}, [activePresetName, isOpen]);

	return {
		search,
		setSearch,
		saveName,
		setSaveName,
		saveAsOpen,
		setSaveAsOpen,
		saveAsName,
		setSaveAsName,
		renameValue,
		setRenameValue,
		authorValue,
		setAuthorValue,
		descriptionValue,
		setDescriptionValue,
		selectedAuthorFilter,
		setSelectedAuthorFilter,
		selectedBankFilter,
		setSelectedBankFilter,
		selectedTagFilters,
		setSelectedTagFilters,
		bankOptions,
		authorOptions,
		tagOptions,
		focusedEntryId,
		setFocusedEntryId,
		scrollContainerRef,
		virtualScrollTop,
		setVirtualScrollTop,
		sortedEntries,
		virtualRows,
		virtualLayout,
		visibleVirtualRows,
		focusedEntry,
		activeLocalEntry,
		selectedEntry,
		selectedLocalEntry,
		toggleSort,
		sortIndicator,
	};
}
