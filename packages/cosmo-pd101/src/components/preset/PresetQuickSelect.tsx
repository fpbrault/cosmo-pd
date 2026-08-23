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
import { getEntrySearchText } from "./presetLibraryShared";

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
	const [search, setSearch] = useState("");
	const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null);
	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const filteredEntries = useMemo(() => {
		const query = search.trim().toLowerCase();
		return entries
			.filter((entry) => !query || getEntrySearchText(entry).includes(query))
			.sort((left, right) => {
				if (left.starred !== right.starred) {
					return Number(right.starred) - Number(left.starred);
				}
				return left.label.localeCompare(right.label, undefined, {
					numeric: true,
					sensitivity: "base",
				});
			});
	}, [entries, search]);

	useEffect(() => {
		if (!open) {
			setSearch("");
			setLoadingEntryId(null);
			return;
		}

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

	const handleOptionKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			focusOption(index + 1);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			if (index === 0) {
				const input = document.getElementById(
					`${listboxId}-search`,
				) as HTMLInputElement | null;
				input?.focus();
			} else {
				focusOption(index - 1);
			}
		} else if (event.key === "Home") {
			event.preventDefault();
			focusOption(0);
		} else if (event.key === "End") {
			event.preventDefault();
			focusOption(filteredEntries.length - 1);
		}
	};

	const activateEntry = async (entry: PresetEntry) => {
		if (loadingEntryId) return;
		setLoadingEntryId(entry.id);
		onNavigationEntriesChange(filteredEntries.map((candidate) => candidate.id));
		try {
			await onActivatePreset(entry.id);
			onClose();
		} finally {
			setLoadingEntryId(null);
		}
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
			<div className="w-[min(34rem,calc(100vw-1.5rem))] bg-cz-panel p-2">
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
									onKeyDown={(event) => handleOptionKeyDown(event, index)}
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
		</Popover>
	);
}
