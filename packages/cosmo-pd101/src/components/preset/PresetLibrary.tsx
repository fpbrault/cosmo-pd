import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PresetLibraryStatus } from "@/features/synth/presetManagerRepository";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { PresetRef } from "@/features/synth/useSynthPresetManager";
import {
	PRESET_TAG_OPTIONS,
	type PresetTagOptions,
} from "@/lib/synth/presetTags";
import PresetLibraryDialogs from "./PresetLibraryDialogs";
import PresetLibraryHeader from "./PresetLibraryHeader";
import PresetLibraryRow from "./PresetLibraryRow";
import PresetLibrarySidebar from "./PresetLibrarySidebar";
import { usePresetLibraryImport } from "./usePresetLibraryImport";
import { usePresetLibraryNavigation } from "./usePresetLibraryNavigation";
import { usePresetLibraryState } from "./usePresetLibraryState";

type PresetLibraryProps = {
	allEntries: PresetEntry[];
	libraryStatus?: PresetLibraryStatus;
	activeEntryId: string | null;
	activePresetName: string;
	isPresetDirty: boolean;
	onActivatePreset: (ref: PresetRef) => void;
	onSavePreset: (name: string) => void;
	onSavePresetAs: (name: string) => void;
	onDeletePreset: (id: string) => void;
	onRenamePreset: (id: string, newName: string) => void;
	onSetPresetAuthor: (id: string, author: string) => void;
	onSetPresetDescription: (id: string, description: string) => void;
	onSetPresetFavorite: (id: string, favorite: boolean) => void;
	onSetPresetTags: (id: string, tags: PresetTagOptions[]) => void;
	onExportPreset: (id: string) => void;
	onExportCurrentState: (name: string) => void;
	onImportPreset: (json: string, filename: string) => void;
	onInitPreset: () => void;
	onRetryLibrary?: () => void;
	onRepairLibrary?: () => void;
	onRebuildLibrary?: () => void;
	onClose: () => void;
	onNavigationEntriesChange?: (entryIds: string[]) => void;
	isOpen?: boolean;
};

export default function PresetLibrary({
	allEntries,
	libraryStatus = { state: "ready" },
	activeEntryId,
	activePresetName,
	isPresetDirty,
	onActivatePreset,
	onSavePreset,
	onSavePresetAs,
	onDeletePreset,
	onRenamePreset,
	onSetPresetAuthor,
	onSetPresetDescription,
	onSetPresetFavorite,
	onSetPresetTags,
	onExportPreset,
	onExportCurrentState,
	onImportPreset,
	onInitPreset,
	onRetryLibrary,
	onRepairLibrary,
	onRebuildLibrary,
	onClose,
	onNavigationEntriesChange,
	isOpen = true,
}: PresetLibraryProps) {
	const { t } = useTranslation("synth");
	const [recoveryConfirmation, setRecoveryConfirmation] = useState<
		"repair" | "rebuild" | null
	>(null);
	const persistenceDisabled = libraryStatus.state === "degraded";
	const isPluginRuntime = typeof window.__czSetParams === "function";

	const {
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
		descriptionValue,
		setDescriptionValue,
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
	} = usePresetLibraryState({
		allEntries,
		activeEntryId,
		activePresetName,
		isOpen,
		onNavigationEntriesChange,
	});

	const { importFileRef, handleImportFile, handleImportClick } =
		usePresetLibraryImport({
			onImportPreset,
			setImportError,
		});

	const handleLoad = useCallback(
		(entry: PresetEntry) => {
			onActivatePreset({ entryId: entry.id });
		},
		[onActivatePreset],
	);

	const { handleListKeyDownCapture, handleListKeyDown } =
		usePresetLibraryNavigation({
			isOpen,
			isPluginRuntime,
			focusedEntryId,
			setFocusedEntryId,
			focusedEntry,
			sortedEntries,
			virtualRows,
			virtualOffsets: virtualLayout.offsets,
			scrollContainerRef,
			handleLoad,
			onClose,
		});

	const handleSave = useCallback(() => {
		if (!activeLocalEntry) return;
		onSavePreset(activeLocalEntry.label);
	}, [activeLocalEntry, onSavePreset]);

	const toggleTagFilter = useCallback(
		(tag: string) => {
			setSelectedTagFilters((prev) =>
				prev.includes(tag)
					? prev.filter((value) => value !== tag)
					: [...prev, tag],
			);
		},
		[setSelectedTagFilters],
	);

	const selectAuthorFilter = useCallback(
		(author: string) => {
			setSelectedAuthorFilter(author === selectedAuthorFilter ? null : author);
		},
		[selectedAuthorFilter, setSelectedAuthorFilter],
	);

	const selectBankFilter = useCallback(
		(bank: string) => {
			setSelectedBankFilter(bank === selectedBankFilter ? null : bank);
		},
		[selectedBankFilter, setSelectedBankFilter],
	);

	const openSaveAsModal = useCallback(() => {
		setSaveAsName(
			activeLocalEntry?.label ?? activePresetName.replace(/\s+\*$/, ""),
		);
		setSaveAsOpen(true);
	}, [activeLocalEntry, activePresetName, setSaveAsName, setSaveAsOpen]);

	const commitSaveAs = useCallback(() => {
		const name = saveAsName.trim();
		if (!name) return;
		onSavePresetAs(name);
		setSaveAsOpen(false);
		setSaveAsName("");
	}, [onSavePresetAs, saveAsName, setSaveAsName, setSaveAsOpen]);

	const handleExportCurrentState = useCallback(() => {
		const name = saveName.trim();
		if (!name) return;
		onExportCurrentState(name);
	}, [onExportCurrentState, saveName]);

	const commitRename = useCallback(() => {
		if (!selectedLocalEntry) return;
		const nextName = renameValue.trim();
		if (nextName && nextName !== selectedLocalEntry.label) {
			onRenamePreset(selectedLocalEntry.id, nextName);
		}
	}, [onRenamePreset, renameValue, selectedLocalEntry]);

	const updateSelectedTags = useCallback(
		(nextTags: string[]) => {
			if (!selectedLocalEntry) return;
			onSetPresetTags(
				selectedLocalEntry.id,
				nextTags.filter((tag): tag is PresetTagOptions =>
					PRESET_TAG_OPTIONS.includes(tag as PresetTagOptions),
				),
			);
		},
		[onSetPresetTags, selectedLocalEntry],
	);

	const commitAuthor = useCallback(() => {
		if (!selectedLocalEntry) return;
		const nextAuthor = authorValue.trim();
		if (nextAuthor === selectedLocalEntry.author) {
			return;
		}
		onSetPresetAuthor(selectedLocalEntry.id, nextAuthor);
	}, [authorValue, onSetPresetAuthor, selectedLocalEntry]);

	const commitDescription = useCallback(() => {
		if (!selectedLocalEntry) return;
		const nextDescription = descriptionValue.trim();
		if (nextDescription === selectedLocalEntry.description) {
			return;
		}
		onSetPresetDescription(selectedLocalEntry.id, nextDescription);
	}, [descriptionValue, onSetPresetDescription, selectedLocalEntry]);

	const deleteSelectedPreset = useCallback(() => {
		if (!selectedLocalEntry) return;
		onDeletePreset(selectedLocalEntry.id);
	}, [onDeletePreset, selectedLocalEntry]);

	const exportSelectedPreset = useCallback(() => {
		if (!selectedLocalEntry) return;
		onExportPreset(selectedLocalEntry.id);
	}, [onExportPreset, selectedLocalEntry]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-cz-border bg-cz-panel">
				{libraryStatus.state === "degraded" && (
					<div
						className="alert alert-error rounded-none border-x-0 border-t-0"
						role="alert"
					>
						<div className="min-w-0 max-w-90 flex-1">
							<p className="font-semibold">
								{t("presetLibrary.databaseErrorTitle")}
							</p>
							<p className="text-sm">
								{t("presetLibrary.databaseErrorDescription")}
							</p>
							<details className="mt-1 text-xs">
								<summary>{t("presetLibrary.errorDetails")}</summary>
								<p className="mt-1 break-all font-mono">
									{libraryStatus.message}
								</p>
							</details>
						</div>
						<div className="flex shrink-0 gap-2">
							<button
								type="button"
								className="btn btn-sm"
								onClick={onRetryLibrary}
								disabled={!onRetryLibrary}
							>
								{t("presetLibrary.retry")}
							</button>
							<button
								type="button"
								className="btn btn-sm btn-primary"
								onClick={() => setRecoveryConfirmation("repair")}
								disabled={!onRepairLibrary}
							>
								{t("presetLibrary.repair")}
							</button>
							<button
								type="button"
								className="btn btn-sm btn-outline"
								onClick={() => setRecoveryConfirmation("rebuild")}
								disabled={!onRebuildLibrary}
							>
								{t("presetLibrary.rebuild")}
							</button>
						</div>
					</div>
				)}
				<PresetLibraryHeader
					activePresetName={activePresetName}
					totalCount={sortedEntries.length}
					search={search}
					onSearchChange={setSearch}
					onClearSearch={() => setSearch("")}
					onClose={onClose}
					bankOptions={bankOptions}
					selectedBankFilter={selectedBankFilter}
					onSelectBankFilter={selectBankFilter}
					onClearBankFilter={() => setSelectedBankFilter(null)}
					authorOptions={authorOptions}
					selectedAuthorFilter={selectedAuthorFilter}
					onSelectAuthorFilter={selectAuthorFilter}
					onClearAuthorFilter={() => setSelectedAuthorFilter(null)}
					tagOptions={tagOptions}
					selectedTagFilters={selectedTagFilters}
					onToggleTagFilter={toggleTagFilter}
					onClearTagFilters={() => setSelectedTagFilters([])}
					showOnlyUserPresets={showOnlyUserPresets}
					onToggleShowOnlyUserPresets={() =>
						setShowOnlyUserPresets((value) => !value)
					}
					onToggleSort={toggleSort}
					sortIndicator={sortIndicator}
				/>

				<div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_17rem]">
					<div
						ref={scrollContainerRef}
						className="min-h-0 overflow-y-auto [scrollbar-gutter:stable]"
						role="listbox"
						aria-label={t("presetLibrary.ariaLabel")}
						data-preset-library="true"
						tabIndex={isPluginRuntime ? 0 : -1}
						onScroll={(event) => {
							setVirtualScrollTop(event.currentTarget.scrollTop);
						}}
						onKeyDownCapture={handleListKeyDownCapture}
						onKeyDown={handleListKeyDown}
					>
						{libraryStatus.state === "loading" ? (
							<div className="px-5 py-10 text-cz-cream text-sm">
								{t("presetLibrary.loading")}
							</div>
						) : sortedEntries.length === 0 ? (
							<div className="px-5 py-10 text-cz-cream text-sm">
								{t("presetLibrary.emptyState")}
							</div>
						) : (
							<div
								className="relative"
								style={{ height: virtualLayout.totalHeight }}
							>
								{visibleVirtualRows.map(({ row, top }) => {
									const entry = row.entry;
									return (
										<PresetLibraryRow
											key={entry.id}
											entry={entry}
											top={top}
											active={entry.id === activeEntryId}
											focused={entry.id === focusedEntryId}
											onSelect={handleLoad}
											onSetFocus={setFocusedEntryId}
											onSetFavorite={
												persistenceDisabled
													? () => undefined
													: onSetPresetFavorite
											}
											onToggleTagFilter={toggleTagFilter}
											selectedTagFilters={selectedTagFilters}
										/>
									);
								})}
							</div>
						)}
					</div>

					<div
						className={`min-h-0 ${persistenceDisabled ? "pointer-events-none opacity-50" : ""}`}
						aria-disabled={persistenceDisabled}
					>
						<PresetLibrarySidebar
							canSave={Boolean(activeLocalEntry) && isPresetDirty}
							selectedEntry={selectedEntry ?? null}
							renameValue={renameValue}
							onRenameValueChange={setRenameValue}
							onCommitRename={commitRename}
							authorValue={authorValue}
							onAuthorValueChange={setAuthorValue}
							onCommitAuthor={commitAuthor}
							descriptionValue={descriptionValue}
							onDescriptionValueChange={setDescriptionValue}
							onCommitDescription={commitDescription}
							selectedTags={selectedEntry?.tags ?? []}
							onSelectedTagsChange={updateSelectedTags}
							onExportSelectedPreset={exportSelectedPreset}
							onDeleteSelectedPreset={deleteSelectedPreset}
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
			</div>

			<input
				ref={importFileRef}
				type="file"
				accept=".json,application/json"
				className="hidden"
				onChange={handleImportFile}
			/>

			<PresetLibraryDialogs
				saveAsOpen={saveAsOpen}
				saveAsName={saveAsName}
				onSaveAsNameChange={setSaveAsName}
				onCommitSaveAs={commitSaveAs}
				onCancelSaveAs={() => setSaveAsOpen(false)}
				recoveryConfirmation={recoveryConfirmation}
				onConfirmRecovery={() => {
					if (recoveryConfirmation === "repair") {
						onRepairLibrary?.();
					} else if (recoveryConfirmation === "rebuild") {
						onRebuildLibrary?.();
					}
					setRecoveryConfirmation(null);
				}}
				onCancelRecovery={() => setRecoveryConfirmation(null)}
			/>
		</div>
	);
}
