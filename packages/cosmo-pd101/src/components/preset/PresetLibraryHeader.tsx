import { memo } from "react";
import Button from "@/components/controls/Button";
import { getPresetTagBadgeClassName } from "./presetTagTone";

type SortKey = "star" | "favorite" | "name" | "author" | "tags";

type PresetLibraryHeaderProps = {
	activePresetName: string;
	totalCount: number;
	search: string;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	onClose: () => void;
	availableAuthors: readonly string[];
	selectedAuthorFilters: string[];
	onToggleAuthorFilter: (author: string) => void;
	onClearAuthorFilters: () => void;
	availableTags: readonly string[];
	selectedTagFilters: string[];
	onToggleTagFilter: (tag: string) => void;
	onClearTagFilters: () => void;
	showOnlyUserPresets: boolean;
	onToggleShowOnlyUserPresets: () => void;
	onToggleSort: (key: SortKey) => void;
	sortIndicator: (key: SortKey) => string;
};

export default memo(function PresetLibraryHeader({
	activePresetName,
	totalCount,
	search,
	onSearchChange,
	onClearSearch,
	onClose,
	availableAuthors,
	selectedAuthorFilters,
	onToggleAuthorFilter,
	onClearAuthorFilters,
	availableTags,
	selectedTagFilters,
	onToggleTagFilter,
	onClearTagFilters,
	showOnlyUserPresets,
	onToggleShowOnlyUserPresets,
	onToggleSort,
	sortIndicator: getSortIndicator,
}: PresetLibraryHeaderProps) {
	return (
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
					{totalCount} {totalCount === 1 ? "Preset" : "Presets"} found
				</p>
				<div className="flex min-w-64 items-center overflow-hidden rounded-md border border-cz-border bg-cz-inset">
					<input
						type="text"
						className="h-10 min-w-0 flex-1 bg-transparent px-3 text-cz-cream text-sm placeholder-cz-cream-dim/70 outline-none"
						placeholder="Search presets"
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
					/>
					<button
						type="button"
						className="btn btn-ghost btn-xs mr-2 h-6 min-h-0 rounded-sm border border-cz-border/70 px-1.5 text-cz-cream-dim hover:border-cz-light-blue/60 hover:bg-cz-body hover:text-cz-cream disabled:border-cz-border/30 disabled:text-cz-cream-dim/40"
						aria-label="Clear preset search"
						disabled={search.length === 0}
						onClick={onClearSearch}
					>
						x
					</button>
				</div>
				<Button
					type="button"
					className={`btn btn-sm ${showOnlyUserPresets ? "btn-secondary" : "border-cz-border bg-cz-inset text-cz-cream hover:bg-cz-body"}`}
					onClick={onToggleShowOnlyUserPresets}
				>
					User Only
				</Button>
				<Button
					type="button"
					className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream hover:bg-cz-body"
					onClick={onClose}
				>
					Return
				</Button>
			</div>
			<div className="col-span-2 flex flex-wrap items-start gap-3">
				<div className="min-w-100">
					<div className="mb-1 flex items-center justify-between gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Filter author
						</p>
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 rounded-sm border border-cz-border/70 px-1.5 text-cz-cream-dim hover:border-cz-light-blue/60 hover:bg-cz-inset hover:text-cz-cream disabled:border-cz-border/30 disabled:text-cz-cream-dim/40"
							aria-label="Clear author filters"
							disabled={selectedAuthorFilters.length === 0}
							onClick={onClearAuthorFilters}
						>
							x
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							className={`badge badge-md capitalize ${selectedAuthorFilters.length === 0 ? "badge-primary" : "badge-neutral"}`}
							onClick={onClearAuthorFilters}
						>
							all
						</button>
						{availableAuthors.map((author) => {
							const active = selectedAuthorFilters.includes(author);
							return (
								<button
									key={author}
									type="button"
									className={`badge badge-md ${active ? "badge-primary" : "badge-neutral"}`}
									onClick={() => onToggleAuthorFilter(author)}
								>
									{author}
								</button>
							);
						})}
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex items-center justify-between gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Filter tags
						</p>
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 rounded-sm border border-cz-border/70 px-1.5 text-cz-cream-dim hover:border-cz-light-blue/60 hover:bg-cz-inset hover:text-cz-cream disabled:border-cz-border/30 disabled:text-cz-cream-dim/40"
							aria-label="Clear tag filters"
							disabled={selectedTagFilters.length === 0}
							onClick={onClearTagFilters}
						>
							x
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							className={`badge badge-md capitalize ${selectedTagFilters.length === 0 ? "badge-primary" : "badge-neutral"}`}
							onClick={onClearTagFilters}
						>
							all
						</button>
						{availableTags.map((tag) => (
							<button
								key={tag}
								type="button"
								className={getPresetTagBadgeClassName(
									tag,
									selectedTagFilters.includes(tag),
								)}
								onClick={() => onToggleTagFilter(tag)}
							>
								{tag.toLowerCase()}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="col-span-2 mr-68 grid grid-cols-[2.5rem_2.5rem_minmax(14rem,1fr)_9rem_minmax(10rem,1fr)] border-cz-border border-b bg-cz-body px-4 py-2 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.22em]">
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("star")}
				>
					★{getSortIndicator("star")}
				</button>
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("favorite")}
				>
					♥{getSortIndicator("favorite")}
				</button>
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("name")}
				>
					Name{getSortIndicator("name")}
				</button>
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("author")}
				>
					Author{getSortIndicator("author")}
				</button>
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("tags")}
				>
					Tags{getSortIndicator("tags")}
				</button>
			</div>
		</div>
	);
});
