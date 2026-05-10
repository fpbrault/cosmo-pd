import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetLibraryDialogs from "./PresetLibraryDialogs";
import PresetLibraryHeader from "./PresetLibraryHeader";
import PresetLibraryRow from "./PresetLibraryRow";
import PresetLibrarySidebar from "./PresetLibrarySidebar";

type PresetLibraryProps = {
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

function getVirtualRowHeight() {
	return ENTRY_ROW_HEIGHT;
}

function getEntrySearchText(entry: PresetEntry) {
	return `${entry.label} ${entry.sourceLabel} ${entry.category} ${entry.tags.join(" ")}`.toLowerCase();
}

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable || target.closest("[contenteditable='true']"))
		return true;
	if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") return true;
	if (target.tagName !== "INPUT") return false;
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
}: PresetLibraryProps) {
	const isPluginRuntime =
		typeof (
			window as Window & {
				__czSetParams?: (json: string) => void;
			}
		).__czSetParams === "function";
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

		return [...byTags].sort((a, b) => {
			if (tagSortMode === "tag") {
				const aTag = a.tags[0] ?? "";
				const bTag = b.tags[0] ?? "";
				const tagCompare = aTag.localeCompare(bTag);
				if (tagCompare !== 0) return tagCompare;
			}
			return a.label.localeCompare(b.label, undefined, {
				numeric: true,
				sensitivity: "base",
			});
		});
	}, [allEntries, search, selectedTagFilters, tagSortMode]);

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

			if (sortState.key === "source") {
				const sourceCompare = a.sourceLabel.localeCompare(
					b.sourceLabel,
					undefined,
					{ sensitivity: "base" },
				);
				if (sourceCompare !== 0)
					return sortState.direction === "asc" ? sourceCompare : -sourceCompare;
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
				if (tagCompare !== 0)
					return sortState.direction === "asc" ? tagCompare : -tagCompare;
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
		if (document.activeElement === searchInputRef.current) return;

		const rowIndex = virtualRows.findIndex(
			(row) => row.kind === "entry" && row.entry.id === focusedEntryId,
		);
		const scrollContainer = scrollContainerRef.current;
		if (rowIndex < 0 || !scrollContainer) return;

		const top = virtualLayout.offsets[rowIndex] + TABLE_HEADER_HEIGHT;
		const bottom = top + getVirtualRowHeight();
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
		if (!isOpen) return;
		const handleWindowKeyDown = (event: KeyboardEvent) => {
			if (!document.hasFocus()) return;
			if (event.defaultPrevented) return;
			if (isEditableTarget(event.target)) return;
			if (
				event.key !== "ArrowDown" &&
				event.key !== "ArrowUp" &&
				event.key !== "Home" &&
				event.key !== "End"
			)
				return;
			handleKeyboardNavigation(event);
		};

		window.addEventListener("keydown", handleWindowKeyDown);
		return () => window.removeEventListener("keydown", handleWindowKeyDown);
	}, [handleKeyboardNavigation, isOpen]);

	const handleSave = useCallback(() => {
		if (!activeLocalEntry) return;
		onSavePreset(activeLocalEntry.label);
	}, [activeLocalEntry, onSavePreset]);

	const toggleTagFilter = useCallback((tag: string) => {
		setSelectedTagFilters((prev) =>
			prev.includes(tag)
				? prev.filter((value) => value !== tag)
				: [...prev, tag],
		);
	}, []);

	const openSaveAsModal = useCallback(() => {
		setSaveAsName(
			activeLocalEntry?.label ?? activePresetName.replace(/\s+\*$/, ""),
		);
		setSaveAsOpen(true);
	}, [activeLocalEntry, activePresetName]);

	const commitSaveAs = useCallback(() => {
		const name = saveAsName.trim();
		if (!name) return;
		onSavePreset(name);
		setSaveAsOpen(false);
		setSaveAsName("");
	}, [saveAsName, onSavePreset]);

	const handleExportCurrentState = useCallback(() => {
		const name = saveName.trim();
		if (!name) return;
		onExportCurrentState(name);
	}, [saveName, onExportCurrentState]);

	const handleImportFile = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
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
		},
		[onImportPreset],
	);

	const commitRename = useCallback(() => {
		if (!renameEntry) return;
		const nextName = renameValue.trim();
		if (nextName && nextName !== renameEntry.label) {
			onRenamePreset(renameEntry.label, nextName);
		}
		setRenameEntry(null);
		setRenameValue("");
	}, [renameEntry, renameValue, onRenamePreset]);

	const commitMetadata = useCallback(() => {
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
	}, [
		metadataEntry,
		metadataCategoryValue,
		metadataTagsValue,
		onSetPresetCategory,
		onSetPresetTags,
	]);

	const commitDelete = useCallback(() => {
		if (!deleteEntry) return;
		onDeletePreset(deleteEntry.label);
		setDeleteEntry(null);
	}, [deleteEntry, onDeletePreset]);

	const handleImportClick = useCallback(() => {
		importFileRef.current?.click();
	}, []);

	return (
		<div className="relative z-10 flex min-h-0 flex-1 flex-col">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-cz-border bg-cz-panel">
				<PresetLibraryHeader
					activePresetName={activePresetName}
					totalCount={sortedEntries.length}
					search={search}
					onSearchChange={setSearch}
					showLibraryPresets={showLibraryPresets}
					onToggleLibraryPresets={onToggleLibraryPresets}
					onClose={onClose}
					availableTags={availableTags}
					selectedTagFilters={selectedTagFilters}
					onToggleTagFilter={toggleTagFilter}
					onClearTagFilters={() => setSelectedTagFilters([])}
					tagSortMode={tagSortMode}
					onTagSortModeChange={setTagSortMode}
					sortState={sortState}
					onToggleSort={toggleSort}
					sortIndicator={sortIndicator}
					searchInputRef={searchInputRef}
				/>

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
							if (!isPluginRuntime) return;
							if (event.key !== " ") return;
							if (isEditableTarget(event.target)) return;
							if (event.target instanceof HTMLElement) event.target.blur();
						}}
						onKeyDown={(event) => {
							if (isEditableTarget(event.target)) return;
							handleKeyboardNavigation(event);
						}}
					>
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
										<PresetLibraryRow
											key={entry.id}
											entry={entry}
											top={top}
											active={active}
											focused={focused}
											canToggleFavorite={canToggleFavorite}
											onSelect={handleLoad}
											onSetFocus={setFocusedEntryId}
											onSetFavorite={onSetPresetFavorite}
											onOpenRename={(e) => {
												setRenameEntry(e);
												setRenameValue(e.label);
											}}
											onOpenMetadata={(e) => {
												setMetadataEntry(e);
												setMetadataCategoryValue(e.category);
												setMetadataTagsValue(e.tags.join(", "));
											}}
											onExportPreset={onExportPreset}
											onDeleteEntry={setDeleteEntry}
											onToggleTagFilter={toggleTagFilter}
										/>
									);
								})}
							</div>
						)}
					</div>

					<PresetLibrarySidebar
						activeLocalEntryLabel={activeLocalEntry?.label ?? null}
						saveName={saveName}
						onSaveNameChange={setSaveName}
						onSave={handleSave}
						onOpenSaveAs={openSaveAsModal}
						onExportCurrentState={handleExportCurrentState}
						onImportClick={handleImportClick}
						onInitPreset={onInitPreset}
						importError={importError}
					/>
				</div>
			</div>

			<input
				ref={importFileRef}
				type="file"
				accept=".json,application/json"
				className="hidden"
				onChange={handleImportFile}
			/>

			<PresetLibraryDialogs
				renameEntry={renameEntry}
				renameValue={renameValue}
				onRenameValueChange={setRenameValue}
				onCommitRename={commitRename}
				onCancelRename={() => {
					setRenameEntry(null);
					setRenameValue("");
				}}
				deleteEntry={deleteEntry}
				onCommitDelete={commitDelete}
				onCancelDelete={() => setDeleteEntry(null)}
				metadataEntry={metadataEntry}
				metadataCategoryValue={metadataCategoryValue}
				onMetadataCategoryValueChange={setMetadataCategoryValue}
				metadataTagsValue={metadataTagsValue}
				onMetadataTagsValueChange={setMetadataTagsValue}
				onCommitMetadata={commitMetadata}
				onCancelMetadata={() => {
					setMetadataEntry(null);
					setMetadataCategoryValue("");
					setMetadataTagsValue("");
				}}
				saveAsOpen={saveAsOpen}
				saveAsName={saveAsName}
				onSaveAsNameChange={setSaveAsName}
				onCommitSaveAs={commitSaveAs}
				onCancelSaveAs={() => setSaveAsOpen(false)}
			/>
		</div>
	);
}
