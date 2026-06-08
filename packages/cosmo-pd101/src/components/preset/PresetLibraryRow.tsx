import { memo } from "react";
import Button from "@/components/controls/Button";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { getPresetTagBadgeClassName } from "./presetTagTone";

const ENTRY_ROW_HEIGHT = 52;

type PresetLibraryRowProps = {
	entry: PresetEntry;
	top: number;
	active: boolean;
	focused: boolean;
	onSelect: (entry: PresetEntry) => void;
	onSetFocus: (id: string) => void;
	onSetFavorite: (id: string, favorite: boolean) => void;
	onToggleTagFilter: (tag: string) => void;
	selectedTagFilters: readonly string[];
};

export default memo(function PresetLibraryRow({
	entry,
	top,
	active,
	focused,
	onSelect,
	onSetFocus,
	onSetFavorite,
	onToggleTagFilter,
	selectedTagFilters,
}: PresetLibraryRowProps) {
	return (
		<div
			className={`absolute inset-x-0 grid grid-cols-[2.5rem_2.5rem_minmax(14rem,1fr)_9rem_minmax(10rem,1fr)] items-center border-cz-border border-b px-4 py-1 text-sm transition ${
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
					target.closest("button, input, textarea, select, a, [role='button']")
				) {
					return;
				}
				onSetFocus(entry.id);
				onSelect(entry);
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
					target.closest("button, input, textarea, select, a, [role='button']")
				) {
					return;
				}
				event.preventDefault();
				onSetFocus(entry.id);
				onSelect(entry);
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
				className={`btn btn-ghost px-2 text-xl leading-none ${entry.favorite ? "text-cz-gold" : "text-cz-cream-dim"}`}
				aria-label={`${entry.favorite ? "Unfavorite" : "Favorite"} ${entry.label}`}
				onClick={() => onSetFavorite(entry.id, !entry.favorite)}
			>
				{entry.favorite ? "♥" : "♡"}
			</Button>
			<div className="min-w-0">
				<button
					type="button"
					className="h-auto min-h-0 w-full min-w-0 truncate bg-transparent px-0 py-0.5 text-left font-medium text-cz-cream text-xs outline-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
					onFocus={() => onSetFocus(entry.id)}
					onClick={() => onSelect(entry)}
				>
					{entry.label}
				</button>
				<p className="truncate font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
					{entry.bankName ?? entry.sourceLabel}
				</p>
				{entry.bankName && entry.bankName !== entry.sourceLabel ? (
					<p className="truncate font-mono text-4xs text-cz-cream-dim/70 uppercase tracking-[0.12em]">
						{entry.sourceLabel}
					</p>
				) : null}
			</div>
			<span className="truncate font-mono text-3xs text-cz-cream-dim">
				{entry.author || "-"}
			</span>
			<div className="flex flex-wrap gap-2">
				{entry.tags.length > 0 ? (
					entry.tags.map((tag) => (
						<button
							key={`${entry.id}-${tag}`}
							type="button"
							className={getPresetTagBadgeClassName(
								tag,
								selectedTagFilters.includes(tag),
							)}
							onClick={() => onToggleTagFilter(tag)}
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
		</div>
	);
});
