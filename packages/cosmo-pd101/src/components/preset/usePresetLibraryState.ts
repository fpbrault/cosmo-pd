import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";
import {
	getEntrySearchText,
	getVirtualRowHeight,
	type SortDirection,
	type SortKey,
	TABLE_HEADER_HEIGHT,
	VIRTUAL_OVERSCAN_PX,
	type VirtualPresetRow,
} from "./presetLibraryShared";

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
	const [search, setSearch] = useState("");
	const [saveName, setSaveName] = useState("");
	const [saveAsOpen, setSaveAsOpen] = useState(false);
	const [saveAsName, setSaveAsName] = useState("");
	const [importError, setImportError] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [authorValue, setAuthorValue] = useState("");
	const [tagDraft, setTagDraft] = useState("");
	const [showOnlyUserPresets, setShowOnlyUserPresets] = useState(false);
	const [selectedAuthorFilters, setSelectedAuthorFilters] = useState<string[]>(
		[],
	);
	const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
	const [sortState, setSortState] = useState<{
		key: SortKey;
		direction: SortDirection;
	}>({ key: "star", direction: "desc" });
	const [focusedEntryId, setFocusedEntryId] = useState(activeEntryId);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [virtualScrollTop, setVirtualScrollTop] = useState(0);
	const [virtualViewportHeight, setVirtualViewportHeight] = useState(0);
	const lastNavigationEntryIdsRef = useRef<string[]>([]);

	const availableTags = PRESET_TAG_OPTIONS;
	const availableAuthors = useMemo(
		() =>
			Array.from(
				new Set(
					allEntries
						.map((entry) => entry.author.trim())
						.filter((author) => author.length > 0),
				),
			).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
		[allEntries],
	);

	const filteredEntries = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		const bySearch = normalizedSearch
			? allEntries.filter((entry) =>
					getEntrySearchText(entry).includes(normalizedSearch),
				)
			: allEntries;

		const byAuthor =
			selectedAuthorFilters.length > 0
				? bySearch.filter((entry) =>
						selectedAuthorFilters.includes(entry.author),
					)
				: bySearch;

		const byTags =
			selectedTagFilters.length > 0
				? byAuthor.filter((entry) =>
						selectedTagFilters.every((tag) => entry.tags.includes(tag)),
					)
				: byAuthor;

		const byType = showOnlyUserPresets
			? byTags.filter((entry) => entry.source === "user")
			: byTags;

		return [...byType].sort((a, b) => {
			return a.label.localeCompare(b.label, undefined, {
				numeric: true,
				sensitivity: "base",
			});
		});
	}, [
		allEntries,
		search,
		selectedAuthorFilters,
		selectedTagFilters,
		showOnlyUserPresets,
	]);

	const sortedEntries = useMemo(() => {
		return [...filteredEntries].sort((a, b) => {
			if (sortState.key === "star") {
				const aValue = a.starred ? 1 : 0;
				const bValue = b.starred ? 1 : 0;
				if (aValue === bValue) {
					return a.label.localeCompare(b.label, undefined, {
						numeric: true,
						sensitivity: "base",
					});
				}
				return sortState.direction === "asc"
					? aValue - bValue
					: bValue - aValue;
			}

			if (sortState.key === "favorite") {
				const aValue = a.favorite ? 1 : 0;
				const bValue = b.favorite ? 1 : 0;
				if (aValue === bValue) {
					return a.label.localeCompare(b.label, undefined, {
						numeric: true,
						sensitivity: "base",
					});
				}
				return sortState.direction === "asc"
					? aValue - bValue
					: bValue - aValue;
			}

			if (sortState.key === "author") {
				const authorCompare = a.author.localeCompare(b.author, undefined, {
					sensitivity: "base",
				});
				if (authorCompare !== 0) {
					return sortState.direction === "asc" ? authorCompare : -authorCompare;
				}
				const nameCompare = a.label.localeCompare(b.label, undefined, {
					numeric: true,
					sensitivity: "base",
				});
				return sortState.direction === "asc" ? nameCompare : -nameCompare;
			}

			if (sortState.key === "tags") {
				const aTagLabel = a.tags.join(", ");
				const bTagLabel = b.tags.join(", ");
				const tagCompare = aTagLabel.localeCompare(bTagLabel, undefined, {
					sensitivity: "base",
				});
				if (tagCompare !== 0) {
					return sortState.direction === "asc" ? tagCompare : -tagCompare;
				}
				const nameCompare = a.label.localeCompare(b.label, undefined, {
					numeric: true,
					sensitivity: "base",
				});
				return sortState.direction === "asc" ? nameCompare : -nameCompare;
			}

			const nameCompare = a.label.localeCompare(b.label, undefined, {
				numeric: true,
				sensitivity: "base",
			});
			return sortState.direction === "asc" ? nameCompare : -nameCompare;
		});
	}, [filteredEntries, sortState]);

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
		const listScrollTop = Math.max(0, virtualScrollTop - TABLE_HEADER_HEIGHT);
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
	const selectedLocalEntry =
		focusedEntry?.type === "local" ? focusedEntry : activeLocalEntry;

	const tagSuggestions = useMemo(() => {
		const normalizedDraft = tagDraft.trim().toLowerCase();
		if (!normalizedDraft) {
			return PRESET_TAG_OPTIONS.filter(
				(tag) => !selectedLocalEntry?.tags.includes(tag),
			);
		}

		return PRESET_TAG_OPTIONS.filter(
			(tag) =>
				tag.includes(normalizedDraft) &&
				!selectedLocalEntry?.tags.includes(tag),
		);
	}, [selectedLocalEntry?.tags, tagDraft]);

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
		if (!onNavigationEntriesChange) {
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
	}, [onNavigationEntriesChange, sortedEntries]);

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

	const toggleSort = useCallback((key: SortKey) => {
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
	}, []);

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
		setTagDraft("");
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
		importError,
		setImportError,
		renameValue,
		setRenameValue,
		authorValue,
		setAuthorValue,
		tagDraft,
		setTagDraft,
		showOnlyUserPresets,
		setShowOnlyUserPresets,
		selectedAuthorFilters,
		setSelectedAuthorFilters,
		selectedTagFilters,
		setSelectedTagFilters,
		focusedEntryId,
		setFocusedEntryId,
		scrollContainerRef,
		virtualScrollTop,
		setVirtualScrollTop,
		availableTags,
		availableAuthors,
		sortedEntries,
		virtualRows,
		virtualLayout,
		visibleVirtualRows,
		focusedEntry,
		activeLocalEntry,
		selectedLocalEntry,
		tagSuggestions,
		toggleSort,
		sortIndicator,
	};
}
