import {
	type KeyboardEvent,
	type RefObject,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import Popover from "@/components/primitives/Popover";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { usePresetLibraryFilters } from "./PresetLibraryFiltersContext";
import {
	applyPresetLibraryFilters,
	countActivePresetFilters,
	getPresetFilterOptions,
} from "./presetLibraryFilters";
import { sortPresetLibraryEntries } from "./presetLibrarySort";
import { getPresetTagCheckboxClassName } from "./presetTagTone";

type PresetQuickSelectProps = {
	open: boolean;
	openedWithTouch: boolean;
	triggerRef: RefObject<HTMLButtonElement | null>;
	entries: PresetEntry[];
	activeEntryId: string | null;
	onActivatePreset: (entryId: string) => Promise<void>;
	onNavigationEntriesChange: (entryIds: string[]) => void;
	onClose: () => void;
};

export default function PresetQuickSelect({
	open,
	openedWithTouch,
	triggerRef,
	entries,
	activeEntryId,
	onActivatePreset,
	onNavigationEntriesChange,
	onClose,
}: PresetQuickSelectProps) {
	const { t } = useTranslation("synth");
	const listboxId = useId();
	const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null);
	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const {
		search,
		setSearch,
		authorFilter,
		setAuthorFilter,
		bankFilter,
		setBankFilter,
		tagFilters,
		setTagFilters,
		clearFilters,
		sortState,
	} = usePresetLibraryFilters();
	const filters = useMemo(
		() => ({ search, authorFilter, bankFilter, tagFilters }),
		[authorFilter, bankFilter, search, tagFilters],
	);
	const { bankOptions, authorOptions, tagOptions } = useMemo(
		() => getPresetFilterOptions(entries, filters),
		[entries, filters],
	);
	const activeFilterCount = countActivePresetFilters(filters);

	const filteredEntries = useMemo(() => {
		return sortPresetLibraryEntries(
			applyPresetLibraryFilters(entries, filters),
			sortState,
		);
	}, [entries, filters, sortState]);

	useEffect(() => {
		if (!open) {
			setLoadingEntryId(null);
			return;
		}
		onNavigationEntriesChange(filteredEntries.map((entry) => entry.id));
	}, [filteredEntries, onNavigationEntriesChange, open]);

	useEffect(() => {
		if (!open) return;
		const activeIndex = filteredEntries.findIndex(
			(entry) => entry.id === activeEntryId,
		);
		if (activeIndex >= 0) {
			requestAnimationFrame(() => {
				optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
			});
		}
	}, [activeEntryId, filteredEntries, open]);

	const focusOption = (index: number) => {
		const clampedIndex = Math.max(
			0,
			Math.min(index, filteredEntries.length - 1),
		);
		optionRefs.current[clampedIndex]?.focus();
	};

	const activateEntry = async (entry: PresetEntry) => {
		if (loadingEntryId) return;
		setLoadingEntryId(entry.id);
		try {
			await onActivatePreset(entry.id);
		} finally {
			setLoadingEntryId(null);
		}
	};

	const handleOptionKeyDown = async (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			const nextIndex = (index + 1) % filteredEntries.length;
			focusOption(nextIndex);
			await activateEntry(filteredEntries[nextIndex]);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			const previousIndex =
				(index - 1 + filteredEntries.length) % filteredEntries.length;
			focusOption(previousIndex);
			await activateEntry(filteredEntries[previousIndex]);
		} else if (event.key === "Home") {
			event.preventDefault();
			focusOption(0);
		} else if (event.key === "End") {
			event.preventDefault();
			focusOption(filteredEntries.length - 1);
		}
	};

	const toggleTag = (tag: string) => {
		setTagFilters((current) =>
			current.includes(tag)
				? current.filter((value) => value !== tag)
				: [...current, tag],
		);
	};

	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			ariaLabel={t("presetNavigator.quickSelectAria")}
			placement="bottom"
			initialFocus={openedWithTouch ? -1 : 0}
		>
			<div className="grid w-[min(44rem,calc(100vw-1.5rem))] grid-cols-[10.5rem_minmax(0,1fr)] overflow-hidden bg-cz-panel">
				<aside className="min-h-0 border-cz-border border-r bg-cz-body/70 p-2">
					<div className="flex items-center justify-between border-cz-border border-b pb-2">
						<div className="flex items-center gap-1.5">
							<span className="font-mono text-[0.62rem] text-cz-cream uppercase tracking-[0.18em]">
								{t("presetNavigator.filters")}
							</span>
							{activeFilterCount > 0 ? (
								<span
									className="flex h-5 min-w-5 items-center justify-center rounded-sm border border-cz-gold/70 bg-cz-gold/10 px-1 font-mono text-[0.58rem] text-cz-gold"
									role="status"
									aria-label={t("presetNavigator.activeFilterCount", {
										count: activeFilterCount,
									})}
								>
									{activeFilterCount}
								</span>
							) : null}
						</div>
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 rounded-sm px-1.5 font-mono text-[0.58rem] text-cz-cream-dim uppercase hover:text-cz-cream disabled:text-cz-cream-dim/30"
							disabled={activeFilterCount === 0}
							onClick={clearFilters}
						>
							{t("presetNavigator.clearFilters")}
						</button>
					</div>

					<label className="mt-2 block font-mono text-[0.55rem] text-cz-cream-dim uppercase tracking-[0.14em]">
						{t("presetLibrary.filterBank")}
						<select
							value={bankFilter ?? ""}
							onChange={(event) => setBankFilter(event.target.value || null)}
							className="select select-xs mt-1 w-full rounded-sm border-cz-border bg-cz-inset font-mono text-[0.65rem] text-cz-cream"
						>
							<option value="">{t("presetNavigator.allBanks")}</option>
							{bankOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
									disabled={option.disabled}
								>
									{option.value}
								</option>
							))}
						</select>
					</label>

					<label className="mt-2 block font-mono text-[0.55rem] text-cz-cream-dim uppercase tracking-[0.14em]">
						{t("presetLibrary.filterAuthor")}
						<select
							value={authorFilter ?? ""}
							onChange={(event) => setAuthorFilter(event.target.value || null)}
							className="select select-xs mt-1 w-full rounded-sm border-cz-border bg-cz-inset font-mono text-[0.65rem] text-cz-cream"
						>
							<option value="">{t("presetNavigator.allAuthors")}</option>
							{authorOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
									disabled={option.disabled}
								>
									{option.value}
								</option>
							))}
						</select>
					</label>

					<fieldset className="mt-3">
						<legend className="font-mono text-[0.55rem] text-cz-cream-dim uppercase tracking-[0.14em]">
							{t("presetLibrary.filterTags")}
						</legend>
						<div className="mt-1 grid grid-cols-2 gap-1">
							{tagOptions.map((option) => {
								const checked = tagFilters.includes(option.value);
								return (
									<label
										key={option.value}
										className={`${getPresetTagCheckboxClassName(option.value, checked, option.disabled)} !h-7 !min-h-7 !px-1 !text-[0.55rem]`}
									>
										<input
											type="checkbox"
											className="peer sr-only"
											checked={checked}
											disabled={option.disabled}
											onChange={() => toggleTag(option.value)}
										/>
										{option.value}
									</label>
								);
							})}
						</div>
					</fieldset>
				</aside>

				<div className="min-w-0 p-2">
					<label className="flex min-h-11 items-center gap-2 rounded-md border border-cz-border bg-cz-inset px-3 focus-within:border-cz-light-blue/70">
						<svg
							viewBox="0 0 24 24"
							className="h-4 w-4 shrink-0 fill-none stroke-cz-cream-dim"
							strokeWidth="2"
							aria-hidden="true"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="m20 20-4-4" />
						</svg>
						<input
							id={`${listboxId}-search`}
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "ArrowDown" && filteredEntries.length > 0) {
									event.preventDefault();
									focusOption(0);
								}
							}}
							placeholder={t("presetNavigator.searchPlaceholder")}
							aria-controls={listboxId}
							className="h-9 min-w-0 flex-1 bg-transparent font-mono text-cz-cream text-sm outline-none placeholder:text-cz-cream-dim/70"
						/>
						<span className="shrink-0 font-mono text-[0.58rem] text-cz-cream-dim uppercase tracking-[0.08em]">
							{t("presetNavigator.resultCount", {
								count: filteredEntries.length,
							})}
						</span>
					</label>

					<div
						id={listboxId}
						role="listbox"
						aria-label={t("presetNavigator.quickSelectListAria")}
						className="mt-2 max-h-[min(28rem,calc(100vh-8rem))] overflow-y-auto overscroll-contain rounded-md border border-cz-border bg-cz-inset p-1 [scrollbar-gutter:stable]"
					>
						{filteredEntries.length === 0 ? (
							<p className="px-3 py-8 text-center font-mono text-cz-cream-dim text-xs uppercase tracking-[0.16em]">
								{t("presetNavigator.noResults")}
							</p>
						) : (
							filteredEntries.map((entry, index) => {
								const active = entry.id === activeEntryId;
								const metadata = `${entry.bankName ?? entry.sourceLabel} · ${entry.author || t("synthHeader.unknownAuthor")}`;
								return (
									<button
										key={entry.id}
										ref={(node) => {
											optionRefs.current[index] = node;
										}}
										type="button"
										role="option"
										aria-selected={active}
										aria-label={`${entry.label}, ${metadata}`}
										disabled={loadingEntryId !== null}
										onClick={() => void activateEntry(entry)}
										onKeyDown={(event) =>
											void handleOptionKeyDown(event, index)
										}
										className={`grid min-h-13 w-full touch-manipulation grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center rounded-sm px-1 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cz-light-blue/70 ${
											active
												? "bg-cz-surface text-cz-cream"
												: "text-cz-cream hover:bg-cz-surface/60 active:bg-cz-surface"
										}`}
									>
										<span
											className={`text-center text-xl ${entry.favorite ? "text-cz-gold" : "text-cz-cream-dim/70"}`}
											aria-hidden="true"
										>
											{entry.favorite ? "♥" : "♡"}
										</span>
										<span className="min-w-0 px-1">
											<span className="block truncate font-semibold text-sm">
												{entry.label}
											</span>
											<span className="mt-0.5 block truncate font-mono text-[0.58rem] text-cz-cream-dim uppercase tracking-[0.08em]">
												{metadata}
											</span>
										</span>
										<span
											className={`text-center text-lg ${entry.starred ? "text-cz-gold" : "text-cz-cream-dim/35"}`}
											aria-hidden="true"
										>
											{entry.starred ? "★" : "☆"}
										</span>
									</button>
								);
							})
						)}
					</div>
				</div>
			</div>
		</Popover>
	);
}
