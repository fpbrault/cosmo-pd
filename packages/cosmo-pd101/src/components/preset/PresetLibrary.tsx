import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/controls/Button";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";

type PresetLibrary = {
	allEntries: PresetEntry[];
	showLibraryPresets: boolean;
	onToggleLibraryPresets: () => void;
	activeEntryId: string | null;
	activePresetName: string;
	onLoadLocal: (name: string) => void;
	onLoadLibrary: (preset: LibraryPreset) => void;
	onLoadBuiltin: (name: string) => void;
	onSavePreset: (name: string) => void;
	onDeletePreset: (name: string) => void;
	onRenamePreset: (oldName: string, newName: string) => void;
	onSetPresetFavorite: (name: string, favorite: boolean) => void;
	onSetPresetCategory: (name: string, category: string) => void;
	onSetPresetTags: (name: string, tags: string[]) => void;
	onExportPreset: (name: string) => void;
	onExportCurrentState: (name: string) => void;
	onImportPreset: (json: string, filename: string) => void;
	onInitPreset: () => void;
	onClose: () => void;
	isOpen?: boolean;
};

type VirtualPresetRow = { id: string; kind: "entry"; entry: PresetEntry };

type SortKey = "star" | "favorite" | "name" | "source" | "tags";
type SortDirection = "asc" | "desc";

const TABLE_HEADER_HEIGHT = 32;
const ENTRY_ROW_HEIGHT = 52;
const VIRTUAL_OVERSCAN_PX = ENTRY_ROW_HEIGHT * 8;

function getVirtualRowHeight(row: VirtualPresetRow) {
	return row.kind === "entry" ? ENTRY_ROW_HEIGHT : ENTRY_ROW_HEIGHT;
}

function getEntrySearchText(entry: PresetEntry) {
	return `${entry.label} ${entry.sourceLabel} ${entry.category} ${entry.tags.join(" ")}`.toLowerCase();
}

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) {
		return false;
	}
	if (target.isContentEditable || target.closest("[contenteditable='true']")) {
		return true;
	}
	if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
		return true;
	}
	if (target.tagName !== "INPUT") {
		return false;
	}
	const input = target as HTMLInputElement;
	return !(
		input.type === "range" ||
		input.type === "checkbox" ||
		input.type === "radio" ||
		input.type === "button"
	);
}

export default function PresetLibrary({
	allEntries,
	showLibraryPresets,
	onToggleLibraryPresets,
	activeEntryId,
	activePresetName,
	onLoadLocal,
	onLoadLibrary,
	onLoadBuiltin,
	onSavePreset,
	onDeletePreset,
	onRenamePreset,
	onSetPresetFavorite,
	onSetPresetCategory,
	onSetPresetTags,
	onExportPreset,
	onExportCurrentState,
	onImportPreset,
	onInitPreset,
	onClose,
	isOpen = true,
}: PresetLibrary) {
	const isPluginRuntime =
		typeof (
			window as Window & {
				__BEAMER__?: { emit?: (event: string, data?: unknown) => void };
			}
		).__BEAMER__?.emit === "function";
	const [search, setSearch] = useState("");
	const [saveName, setSaveName] = useState("");
	const [saveAsOpen, setSaveAsOpen] = useState(false);
	const [saveAsName, setSaveAsName] = useState("");
	const [importError, setImportError] = useState<string | null>(null);
	const [renameEntry, setRenameEntry] = useState<PresetEntry | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [metadataEntry, setMetadataEntry] = useState<PresetEntry | null>(null);
	const [metadataCategoryValue, setMetadataCategoryValue] = useState("");
	const [metadataTagsValue, setMetadataTagsValue] = useState("");
	const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
	const [tagSortMode, setTagSortMode] = useState<"name" | "tag">("name");
	const [sortState, setSortState] = useState<{
		key: SortKey;
		direction: SortDirection;
	}>({ key: "star", direction: "desc" });
	const [deleteEntry, setDeleteEntry] = useState<PresetEntry | null>(null);
	const [focusedEntryId, setFocusedEntryId] = useState(activeEntryId);
	const importFileRef = useRef<HTMLInputElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const [virtualScrollTop, setVirtualScrollTop] = useState(0);
	const [virtualViewportHeight, setVirtualViewportHeight] = useState(0);

	const availableTags = useMemo(
		() =>
			Array.from(
				new Set(
					allEntries
						.flatMap((entry) => entry.tags)
						.map((tag) => tag.trim().toLowerCase())
						.filter((tag) => tag.length > 0),
				),
			).sort((a, b) => a.localeCompare(b)),
		[allEntries],
	);

	const filteredEntries = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		const bySearch = normalizedSearch
			? allEntries.filter((entry) =>
					getEntrySearchText(entry).includes(normalizedSearch),
				)
			: allEntries;

		const byTags =
			selectedTagFilters.length > 0
				? bySearch.filter((entry) =>
						selectedTagFilters.every((tag) => entry.tags.includes(tag)),
					)
				: bySearch;

		const sorted = [...byTags].sort((a, b) => {
			if (tagSortMode === "tag") {
				const aTag = a.tags[0] ?? "";
				const bTag = b.tags[0] ?? "";
				const tagCompare = aTag.localeCompare(bTag);
				if (tagCompare !== 0) {
					return tagCompare;
				}
			}
			return a.label.localeCompare(b.label, undefined, {
				numeric: true,
				sensitivity: "base",
			});
		});

		return sorted;
	}, [allEntries, search, selectedTagFilters, tagSortMode]);

	const sortedEntries = useMemo(() => {
		const sorted = [...filteredEntries].sort((a, b) => {
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

			if (sortState.key === "source") {
				const sourceCompare = a.sourceLabel.localeCompare(
					b.sourceLabel,
					undefined,
					{
						sensitivity: "base",
					},
				);
				if (sourceCompare !== 0) {
					return sortState.direction === "asc" ? sourceCompare : -sourceCompare;
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

		return sorted;
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
		const offsets = virtualRows.map((row) => {
			const offset = totalHeight;
			totalHeight += getVirtualRowHeight(row);
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
			virtualLayout.offsets[startIndex] +
				getVirtualRowHeight(virtualRows[startIndex]) <
				startBoundary
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
			return {
				row,
				rowIndex,
				top: virtualLayout.offsets[rowIndex],
			};
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
		if (!isOpen) return;
		if (!focusedEntryId) return;
		if (document.activeElement === searchInputRef.current) {
			return;
		}
		const focusedNode = rowRefs.current[focusedEntryId];
		if (focusedNode) {
			focusedNode.focus();
			return;
		}

		const rowIndex = virtualRows.findIndex(
			(row) => row.kind === "entry" && row.entry.id === focusedEntryId,
		);
		const scrollContainer = scrollContainerRef.current;
		if (rowIndex < 0 || !scrollContainer) return;

		const top = virtualLayout.offsets[rowIndex] + TABLE_HEADER_HEIGHT;
		const bottom = top + getVirtualRowHeight(virtualRows[rowIndex]);
		if (top < scrollContainer.scrollTop) {
			scrollContainer.scrollTop = top;
			setVirtualScrollTop(top);
		}
		if (bottom > scrollContainer.scrollTop + scrollContainer.clientHeight) {
			const nextScrollTop = bottom - scrollContainer.clientHeight;
			scrollContainer.scrollTop = nextScrollTop;
			setVirtualScrollTop(nextScrollTop);
		}
	}, [focusedEntryId, isOpen, virtualLayout.offsets, virtualRows]);

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

	const handleLoad = useCallback(
		(entry: PresetEntry) => {
			if (entry.type === "local") {
				onLoadLocal(entry.label);
				return;
			}
			if (entry.type === "builtin") {
				onLoadBuiltin(entry.label);
				return;
			}
			if (entry.preset) {
				onLoadLibrary(entry.preset);
			}
		},
		[onLoadBuiltin, onLoadLibrary, onLoadLocal],
	);

	const handleKeyboardNavigation = useCallback(
		(event: { key: string; preventDefault: () => void }) => {
			if (sortedEntries.length === 0) return;
			const currentIndex = Math.max(
				0,
				sortedEntries.findIndex((entry) => entry.id === focusedEntryId),
			);
			if (event.key === "ArrowDown") {
				event.preventDefault();
				const nextEntry =
					sortedEntries[(currentIndex + 1) % sortedEntries.length];
				if (nextEntry) {
					setFocusedEntryId(nextEntry.id);
					handleLoad(nextEntry);
				}
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				const prevEntry =
					sortedEntries[
						(currentIndex - 1 + sortedEntries.length) % sortedEntries.length
					];
				if (prevEntry) {
					setFocusedEntryId(prevEntry.id);
					handleLoad(prevEntry);
				}
			}
			if (event.key === "Home") {
				event.preventDefault();
				const firstEntry = sortedEntries[0];
				if (firstEntry) {
					setFocusedEntryId(firstEntry.id);
					handleLoad(firstEntry);
				}
			}
			if (event.key === "End") {
				event.preventDefault();
				const lastEntry = sortedEntries[sortedEntries.length - 1];
				if (lastEntry) {
					setFocusedEntryId(lastEntry.id);
					handleLoad(lastEntry);
				}
			}
			if (event.key === "Enter" && focusedEntry) {
				event.preventDefault();
				handleLoad(focusedEntry);
			}
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		},
		[sortedEntries, focusedEntry, focusedEntryId, handleLoad, onClose],
	);

	const toggleSort = (key: SortKey) => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
		setVirtualScrollTop(0);
		setSortState((prev) => {
			if (prev.key === key) {
				return {
					key,
					direction: prev.direction === "asc" ? "desc" : "asc",
				};
			}
			return {
				key,
				direction: key === "favorite" || key === "star" ? "desc" : "asc",
			};
		});
	};

	const sortIndicator = (key: SortKey) => {
		if (sortState.key !== key) return "";
		return sortState.direction === "asc" ? " ▲" : " ▼";
	};

	useEffect(() => {
		if (!isOpen) return;
		const handleWindowKeyDown = (event: KeyboardEvent) => {
			if (!document.hasFocus()) {
				return;
			}
			if (event.defaultPrevented) {
				return;
			}
			if (isEditableTarget(event.target)) {
				return;
			}
			if (
				event.key !== "ArrowDown" &&
				event.key !== "ArrowUp" &&
				event.key !== "Home" &&
				event.key !== "End"
			) {
				return;
			}
			handleKeyboardNavigation(event);
		};

		window.addEventListener("keydown", handleWindowKeyDown);
		return () => {
			window.removeEventListener("keydown", handleWindowKeyDown);
		};
	}, [handleKeyboardNavigation, isOpen]);

	const handleSave = () => {
		if (!activeLocalEntry) return;
		onSavePreset(activeLocalEntry.label);
	};

	const toggleTagFilter = (tag: string) => {
		setSelectedTagFilters((prev) =>
			prev.includes(tag)
				? prev.filter((value) => value !== tag)
				: [...prev, tag],
		);
	};

	const openSaveAsModal = () => {
		setSaveAsName(
			activeLocalEntry?.label ?? activePresetName.replace(/\s+\*$/, ""),
		);
		setSaveAsOpen(true);
	};

	const commitSaveAs = () => {
		const name = saveAsName.trim();
		if (!name) return;
		onSavePreset(name);
		setSaveAsOpen(false);
		setSaveAsName("");
	};

	const handleExportCurrentState = () => {
		const name = saveName.trim();
		if (!name) return;
		onExportCurrentState(name);
	};

	const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const filename = file.name.replace(/\.json$/i, "");
		const reader = new FileReader();
		reader.onload = (readerEvent) => {
			const text = readerEvent.target?.result;
			if (typeof text !== "string") return;
			try {
				onImportPreset(text, filename);
				setImportError(null);
			} catch {
				setImportError("Invalid preset file.");
			}
		};
		reader.readAsText(file);
		event.target.value = "";
	};

	const openRenameModal = (entry: PresetEntry) => {
		setRenameEntry(entry);
		setRenameValue(entry.label);
	};

	const openMetadataModal = (entry: PresetEntry) => {
		setMetadataEntry(entry);
		setMetadataCategoryValue(entry.category);
		setMetadataTagsValue(entry.tags.join(", "));
	};

	const commitRename = () => {
		if (!renameEntry) return;
		const nextName = renameValue.trim();
		if (nextName && nextName !== renameEntry.label) {
			onRenamePreset(renameEntry.label, nextName);
		}
		setRenameEntry(null);
		setRenameValue("");
	};

	const commitMetadata = () => {
		if (!metadataEntry) return;
		const category = metadataCategoryValue.trim();
		const tags = Array.from(
			new Set(
				metadataTagsValue
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0)
					.map((tag) => tag.toLowerCase()),
			),
		);
		onSetPresetCategory(metadataEntry.label, category);
		onSetPresetTags(metadataEntry.label, tags);
		setMetadataEntry(null);
		setMetadataCategoryValue("");
		setMetadataTagsValue("");
	};

	const commitDelete = () => {
		if (!deleteEntry) return;
		onDeletePreset(deleteEntry.label);
		setDeleteEntry(null);
	};

	return (
		<div className="relative z-10 flex min-h-0 flex-1 flex-col">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-cz-border bg-cz-panel">
				<div className="grid grid-cols-[1fr_auto] items-center gap-3 border-cz-border border-b bg-cz-body px-5 py-4">
					<div>
						<p className="font-mono text-3xs text-cz-gold uppercase tracking-[0.32em]">
							Preset Library
						</p>
						<h2 className="mt-1 truncate font-bold font-mono text-cz-cream text-xl">
							{activePresetName}
						</h2>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
							{sortedEntries.length}{" "}
							{sortedEntries.length === 1 ? "Preset" : "Presets"} found
						</p>
						<input
							ref={searchInputRef}
							type="text"
							className="h-10 min-w-48 rounded-md border border-cz-border bg-cz-inset px-3 text-cz-cream text-sm placeholder-cz-cream-dim/70 outline-none focus:border-cz-light-blue"
							placeholder="Search presets"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<Button
							type="button"
							className={`btn btn-sm border-cz-border ${showLibraryPresets ? "bg-cz-gold text-cz-panel" : "bg-cz-inset text-cz-cream hover:bg-cz-body"}`}
							onClick={onToggleLibraryPresets}
						>
							{showLibraryPresets
								? "Factory Presets: Visible"
								: "Factory Presets: Hidden"}
						</Button>
						<Button
							type="button"
							className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream hover:bg-cz-body"
							onClick={onClose}
						>
							Return
						</Button>
					</div>
					<div className="col-span-2 flex flex-wrap items-center gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Filter tags
						</p>
						<button
							type="button"
							className={`badge badge-sm capitalize ${selectedTagFilters.length === 0 ? "badge-primary" : "badge-neutral"}`}
							onClick={() => setSelectedTagFilters([])}
						>
							all
						</button>
						{availableTags.map((tag) => {
							const active = selectedTagFilters.includes(tag);
							return (
								<button
									key={tag}
									type="button"
									className={`badge badge-sm capitalize ${active ? "badge-primary" : "badge-neutral"}`}
									onClick={() => toggleTagFilter(tag)}
								>
									{tag.toLowerCase()}
								</button>
							);
						})}
						<p className="ml-2 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Sort
						</p>
						<Button
							type="button"
							className={`btn btn-xs ${tagSortMode === "name" ? "btn-secondary" : "border-cz-border bg-cz-inset text-cz-cream"}`}
							onClick={() => setTagSortMode("name")}
						>
							Name
						</Button>
						<Button
							type="button"
							className={`btn btn-xs ${tagSortMode === "tag" ? "btn-secondary" : "border-cz-border bg-cz-inset text-cz-cream"}`}
							onClick={() => setTagSortMode("tag")}
						>
							Tag
						</Button>
					</div>
				</div>

				<div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_17rem]">
					<div
						ref={scrollContainerRef}
						className="min-h-0 overflow-y-auto [scrollbar-gutter:stable]"
						role="listbox"
						aria-label="Preset library"
						data-preset-library="true"
						tabIndex={-1}
						onScroll={(event) => {
							setVirtualScrollTop(event.currentTarget.scrollTop);
						}}
						onKeyDownCapture={(event) => {
							if (!isPluginRuntime) {
								return;
							}
							if (event.key !== " ") {
								return;
							}
							if (isEditableTarget(event.target)) {
								return;
							}
							const target = event.target;
							if (target instanceof HTMLElement) {
								target.blur();
							}
						}}
						onKeyDown={(event) => {
							if (isEditableTarget(event.target)) {
								return;
							}
							handleKeyboardNavigation(event);
						}}
					>
						<div className="grid grid-cols-[2.5rem_2.5rem_minmax(12rem,1fr)_8rem_minmax(10rem,1fr)_9rem] border-cz-border border-b bg-cz-body px-4 py-2 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.22em]">
							<button
								type="button"
								className="text-left hover:text-cz-cream"
								onClick={() => toggleSort("star")}
							>
								★{sortIndicator("star")}
							</button>
							<button
								type="button"
								className="text-left hover:text-cz-cream"
								onClick={() => toggleSort("favorite")}
							>
								♥{sortIndicator("favorite")}
							</button>
							<button
								type="button"
								className="text-left hover:text-cz-cream"
								onClick={() => toggleSort("name")}
							>
								Name{sortIndicator("name")}
							</button>
							<button
								type="button"
								className="text-left hover:text-cz-cream"
								onClick={() => toggleSort("source")}
							>
								Source{sortIndicator("source")}
							</button>
							<button
								type="button"
								className="text-left hover:text-cz-cream"
								onClick={() => toggleSort("tags")}
							>
								Tags{sortIndicator("tags")}
							</button>
							<span className="text-right">Actions</span>
						</div>
						{sortedEntries.length === 0 ? (
							<div className="px-5 py-10 text-cz-cream text-sm">
								No presets available.
							</div>
						) : (
							<div
								className="relative"
								style={{ height: virtualLayout.totalHeight }}
							>
								{visibleVirtualRows.map(({ row, top }) => {
									const entry = row.entry;
									const active = entry.id === activeEntryId;
									const focused = entry.id === focusedEntryId;
									const canToggleFavorite = entry.type === "local";
									return (
										<div
											key={entry.id}
											className={`absolute inset-x-0 grid grid-cols-[2.5rem_2.5rem_minmax(12rem,1fr)_8rem_minmax(10rem,1fr)_9rem] items-center border-cz-border border-b px-4 py-1 text-sm transition ${
												active
													? "bg-cz-surface/20"
													: focused
														? "bg-cz-surface/50 text-cz-cream"
														: "bg-cz-surface text-cz-cream hover:bg-cz-surface/30"
											}`}
											style={{
												height: ENTRY_ROW_HEIGHT,
												transform: `translateY(${top}px)`,
											}}
											onClick={(event) => {
												const target = event.target;
												if (
													target instanceof HTMLElement &&
													target.closest(
														"button, input, textarea, select, a, [role='button']",
													)
												) {
													return;
												}
												setFocusedEntryId(entry.id);
												handleLoad(entry);
											}}
											role="option"
											aria-selected={active}
											tabIndex={-1}
											onKeyDown={(event) => {
												if (event.key !== "Enter" && event.key !== " ") {
													return;
												}
												const target = event.target;
												if (
													target instanceof HTMLElement &&
													target.closest(
														"button, input, textarea, select, a, [role='button']",
													)
												) {
													return;
												}
												event.preventDefault();
												setFocusedEntryId(entry.id);
												handleLoad(entry);
											}}
										>
											<span
												className={`px-2 text-lg leading-none ${entry.starred ? "text-cz-gold" : "text-cz-cream-dim/40"}`}
												title={entry.starred ? "Starred" : "Not starred"}
											>
												{entry.starred ? "★" : "☆"}
											</span>
											<Button
												type="button"
												className={`btn btn-ghost px-2 text-xl leading-none ${entry.favorite ? "text-cz-gold" : "text-cz-cream-dim"} ${!canToggleFavorite ? "cursor-not-allowed opacity-40" : ""}`}
												aria-label={`${entry.favorite ? "Unfavorite" : "Favorite"} ${entry.label}`}
												disabled={!canToggleFavorite}
												onClick={() =>
													onSetPresetFavorite(entry.label, !entry.favorite)
												}
											>
												{entry.favorite ? "♥" : "♡"}
											</Button>
											<div className="min-w-0">
												<button
													type="button"
													ref={(node) => {
														rowRefs.current[entry.id] = node;
													}}
													className="h-auto min-h-0 w-full min-w-0 truncate bg-transparent px-0 py-0.5 text-left font-medium text-cz-cream text-xs outline-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
													onFocus={() => setFocusedEntryId(entry.id)}
													onClick={() => handleLoad(entry)}
												>
													{entry.label}
												</button>
												<p className="truncate font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
													{entry.category
														? `Category: ${entry.category}`
														: entry.sourceLabel}
												</p>
											</div>
											<span className="truncate font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.16em]">
												{entry.sourceLabel}
											</span>
											<div className="flex flex-wrap gap-2">
												{entry.tags.length > 0 ? (
													entry.tags.map((tag) => (
														<button
															key={`${entry.id}-${tag}`}
															type="button"
															className="badge badge-primary capitalize"
															onClick={() => toggleTagFilter(tag)}
														>
															{tag.toLowerCase()}
														</button>
													))
												) : (
													<span className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
														-
													</span>
												)}
											</div>
											<div className="flex justify-end gap-1">
												{entry.type === "local" ? (
													<>
														<Button
															type="button"
															className="btn btn-ghost text-cz-cream"
															aria-label={`Edit metadata ${entry.label}`}
															onClick={() => openMetadataModal(entry)}
														>
															Meta
														</Button>
														<Button
															type="button"
															className="btn btn-ghost text-cz-cream"
															aria-label={`Rename ${entry.label}`}
															onClick={() => openRenameModal(entry)}
														>
															Rename
														</Button>
														<Button
															type="button"
															className="btn btn-ghost text-cz-light-blue"
															aria-label={`Export ${entry.label}`}
															onClick={() => onExportPreset(entry.label)}
														>
															Export
														</Button>
														<Button
															type="button"
															className="btn btn-ghost text-red-400"
															aria-label={`Delete ${entry.label}`}
															onClick={() => setDeleteEntry(entry)}
														>
															Delete
														</Button>
													</>
												) : null}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					<aside className="border-cz-border border-t-0 border-l bg-cz-surface p-4">
						<div className="space-y-5">
							<section>
								<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
									Current State
								</h3>
								<div className="mt-2 grid grid-cols-2 gap-2">
									<Button
										type="button"
										className="btn btn-sm btn-warning"
										disabled={!activeLocalEntry}
										onClick={handleSave}
									>
										Save
									</Button>
									<Button
										type="button"
										className="btn btn-sm btn-success"
										onClick={openSaveAsModal}
									>
										Save As
									</Button>
								</div>
								<div className="mt-3">
									<input
										type="text"
										className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream placeholder-cz-cream-dim/70"
										placeholder="Export file name"
										value={saveName}
										onChange={(event) => setSaveName(event.target.value)}
										onKeyDown={(event) => {
											if (event.key === "Enter") handleExportCurrentState();
										}}
									/>
								</div>
								<div className="mt-2 grid grid-cols-1 gap-2">
									<Button
										type="button"
										className="btn btn-sm border-cz-border bg-cz-inset text-cz-light-blue"
										aria-label="Export current state"
										disabled={!saveName.trim()}
										onClick={handleExportCurrentState}
									>
										Export
									</Button>
								</div>
							</section>

							<section>
								<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
									File
								</h3>
								<div className="grid grid-cols-2 gap-2">
									<Button
										type="button"
										className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
										onClick={() => importFileRef.current?.click()}
									>
										Import
									</Button>
									<Button
										type="button"
										className="btn btn-sm border-cz-border bg-cz-inset text-red-400"
										onClick={onInitPreset}
									>
										Init
									</Button>
								</div>
								<input
									ref={importFileRef}
									type="file"
									accept=".json,application/json"
									className="hidden"
									onChange={handleImportFile}
								/>
								{importError ? (
									<p className="mt-2 text-red-400 text-xs">{importError}</p>
								) : null}
							</section>
						</div>
					</aside>
				</div>
			</div>

			<dialog
				className="modal"
				open={renameEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					setRenameEntry(null);
					setRenameValue("");
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Rename preset</h3>
					<input
						type="text"
						className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
						value={renameValue}
						onChange={(event) => setRenameValue(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") commitRename();
							if (event.key === "Escape") setRenameEntry(null);
						}}
					/>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={() => setRenameEntry(null)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn btn-primary"
							aria-label="Confirm rename"
							onClick={commitRename}
						>
							Rename
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={deleteEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					setDeleteEntry(null);
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Delete preset?</h3>
					<p className="mt-3 text-cz-cream-dim text-sm">
						{deleteEntry?.label} will be removed from your local presets.
					</p>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={() => setDeleteEntry(null)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn bg-red-700 text-white"
							aria-label="Confirm delete"
							onClick={commitDelete}
						>
							Delete
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={metadataEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					setMetadataEntry(null);
					setMetadataCategoryValue("");
					setMetadataTagsValue("");
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Preset metadata</h3>
					<p className="mt-2 text-cz-cream-dim text-xs">
						{metadataEntry?.label}
					</p>
					<div className="mt-4 space-y-3">
						<div>
							<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
								Category
							</p>
							<input
								type="text"
								className="input w-full border-cz-border bg-cz-inset text-cz-cream"
								placeholder="Lead, Bass, Pad"
								value={metadataCategoryValue}
								onChange={(event) =>
									setMetadataCategoryValue(event.target.value)
								}
							/>
						</div>
						<div>
							<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
								Tags
							</p>
							<input
								type="text"
								className="input w-full border-cz-border bg-cz-inset text-cz-cream"
								placeholder="warm, analog, bright"
								value={metadataTagsValue}
								onChange={(event) => setMetadataTagsValue(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") commitMetadata();
									if (event.key === "Escape") setMetadataEntry(null);
								}}
							/>
						</div>
					</div>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={() => {
								setMetadataEntry(null);
								setMetadataCategoryValue("");
								setMetadataTagsValue("");
							}}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn btn-primary"
							aria-label="Confirm metadata"
							onClick={commitMetadata}
						>
							Save
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={saveAsOpen}
				onCancel={(event) => {
					event.preventDefault();
					setSaveAsOpen(false);
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Save preset as</h3>
					<input
						type="text"
						className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
						placeholder="New preset name"
						value={saveAsName}
						onChange={(event) => setSaveAsName(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") commitSaveAs();
							if (event.key === "Escape") setSaveAsOpen(false);
						}}
					/>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={() => setSaveAsOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn bg-cz-gold text-white"
							aria-label="Confirm save as"
							disabled={!saveAsName.trim()}
							onClick={commitSaveAs}
						>
							Save As
						</Button>
					</div>
				</div>
			</dialog>
		</div>
	);
}
