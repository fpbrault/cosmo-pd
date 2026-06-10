import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";
import {
	getEntrySearchText,
	getVirtualRowHeight,
	type SortDirection,
	type SortKey,
	VIRTUAL_OVERSCAN_PX,
	type VirtualPresetRow,
} from "./presetLibraryShared";

export type FilterOptions = Array<{ value: string; disabled: boolean }>;

type ActiveFilters = {
	search: string;
	authorFilter: string | null;
	bankFilter: string | null;
	tagFilters: string[];
	showOnlyUser: boolean;
};

function applyFilters(
	entries: PresetEntry[],
	filters: ActiveFilters,
): PresetEntry[] {
	let result = entries;
	const normalizedSearch = filters.search.trim().toLowerCase();
	if (normalizedSearch) {
		result = result.filter((entry) =>
			getEntrySearchText(entry).includes(normalizedSearch),
		);
	}
	if (filters.authorFilter) {
		result = result.filter((entry) => entry.author === filters.authorFilter);
	}
	if (filters.bankFilter) {
		result = result.filter((entry) => entry.bankName === filters.bankFilter);
	}
	if (filters.tagFilters.length > 0) {
		result = result.filter((entry) =>
			filters.tagFilters.every((tag) => entry.tags.includes(tag)),
		);
	}
	if (filters.showOnlyUser) {
		result = result.filter((entry) => entry.source === "user");
	}
	return result;
}

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
	const [showOnlyUserPresets, setShowOnlyUserPresets] = useState(false);
	const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<
		string | null
	>(null);
	const [selectedBankFilter, setSelectedBankFilter] = useState<string | null>(
		null,
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
	const availableBanks = useMemo(
		() =>
			Array.from(
				new Set(
					allEntries
						.map((entry) => entry.bankName?.trim())
						.filter((bankName): bankName is string => Boolean(bankName)),
				),
			).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
		[allEntries],
	);

	const bankOptions = useMemo<FilterOptions>(() => {
		return availableBanks.map((bank) => {
			if (bank === selectedBankFilter) return { value: bank, disabled: false };
			const count = applyFilters(allEntries, {
				search,
				authorFilter: selectedAuthorFilter,
				bankFilter: bank,
				tagFilters: selectedTagFilters,
				showOnlyUser: showOnlyUserPresets,
			}).length;
			return { value: bank, disabled: count === 0 };
		});
	}, [
		availableBanks,
		selectedBankFilter,
		allEntries,
		search,
		selectedAuthorFilter,
		selectedTagFilters,
		showOnlyUserPresets,
	]);

	const authorOptions = useMemo<FilterOptions>(() => {
		return availableAuthors.map((author) => {
			if (author === selectedAuthorFilter)
				return { value: author, disabled: false };
			const count = applyFilters(allEntries, {
				search,
				authorFilter: author,
				bankFilter: selectedBankFilter,
				tagFilters: selectedTagFilters,
				showOnlyUser: showOnlyUserPresets,
			}).length;
			return { value: author, disabled: count === 0 };
		});
	}, [
		availableAuthors,
		selectedAuthorFilter,
		allEntries,
		search,
		selectedBankFilter,
		selectedTagFilters,
		showOnlyUserPresets,
	]);

	const tagOptions = useMemo<FilterOptions>(() => {
		return availableTags.map((tag) => {
			const isSelected = selectedTagFilters.includes(tag);
			if (isSelected) return { value: tag, disabled: false };
			const count = applyFilters(allEntries, {
				search,
				authorFilter: selectedAuthorFilter,
				bankFilter: selectedBankFilter,
				tagFilters: [...selectedTagFilters, tag],
				showOnlyUser: showOnlyUserPresets,
			}).length;
			return { value: tag, disabled: count === 0 };
		});
	}, [
		selectedTagFilters,
		allEntries,
		search,
		selectedAuthorFilter,
		selectedBankFilter,
		showOnlyUserPresets,
	]);

	const filteredEntries = useMemo(() => {
		const filters: ActiveFilters = {
			search,
			authorFilter: selectedAuthorFilter,
			bankFilter: selectedBankFilter,
			tagFilters: selectedTagFilters,
			showOnlyUser: showOnlyUserPresets,
		};
		return applyFilters(allEntries, filters).sort((a, b) => {
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
		showOnlyUserPresets,
	]);

	const sortedEntries = useMemo(() => {
		return [...filteredEntries].sort((a, b) => {
			if (sortState.key === "star") {
				if (a.starred && b.starred) {
					const aSort = a.preset?.sortIndex ?? Infinity;
					const bSort = b.preset?.sortIndex ?? Infinity;
					if (aSort !== bSort) return aSort - bSort;
				} else if (a.starred !== b.starred) {
					return sortState.direction === "asc"
						? (a.starred ? 1 : 0) - (b.starred ? 1 : 0)
						: (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
				}
				return a.label.localeCompare(b.label, undefined, {
					numeric: true,
					sensitivity: "base",
				});
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
	const selectedLocalEntry =
		focusedEntry?.type === "local" ? focusedEntry : activeLocalEntry;

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
		showOnlyUserPresets,
		setShowOnlyUserPresets,
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
		availableBanks,
		availableAuthors,
		sortedEntries,
		virtualRows,
		virtualLayout,
		visibleVirtualRows,
		focusedEntry,
		activeLocalEntry,
		selectedLocalEntry,
		toggleSort,
		sortIndicator,
	};
}
