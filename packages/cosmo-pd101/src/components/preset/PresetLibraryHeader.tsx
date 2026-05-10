import { memo } from "react";
import Button from "@/components/controls/Button";

type SortKey = "star" | "favorite" | "name" | "source" | "tags";

type PresetLibraryHeaderProps = {
	activePresetName: string;
	totalCount: number;
	search: string;
	onSearchChange: (value: string) => void;
	showLibraryPresets: boolean;
	onToggleLibraryPresets: () => void;
	onClose: () => void;
	availableTags: string[];
	selectedTagFilters: string[];
	onToggleTagFilter: (tag: string) => void;
	onClearTagFilters: () => void;
	tagSortMode: "name" | "tag";
	onTagSortModeChange: (mode: "name" | "tag") => void;
	onToggleSort: (key: SortKey) => void;
	sortIndicator: (key: SortKey) => string;
};

export default memo(function PresetLibraryHeader({
	activePresetName,
	totalCount,
	search,
	onSearchChange,
	showLibraryPresets,
	onToggleLibraryPresets,
	onClose,
	availableTags,
	selectedTagFilters,
	onToggleTagFilter,
	onClearTagFilters,
	tagSortMode,
	onTagSortModeChange,
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
				<input
					type="text"
					className="h-10 min-w-48 rounded-md border border-cz-border bg-cz-inset px-3 text-cz-cream text-sm placeholder-cz-cream-dim/70 outline-none focus:border-cz-light-blue"
					placeholder="Search presets"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
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
					onClick={onClearTagFilters}
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
							onClick={() => onToggleTagFilter(tag)}
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
					onClick={() => onTagSortModeChange("name")}
				>
					Name
				</Button>
				<Button
					type="button"
					className={`btn btn-xs ${tagSortMode === "tag" ? "btn-secondary" : "border-cz-border bg-cz-inset text-cz-cream"}`}
					onClick={() => onTagSortModeChange("tag")}
				>
					Tag
				</Button>
			</div>
			<div className="col-span-2 grid grid-cols-[2.5rem_2.5rem_minmax(12rem,1fr)_8rem_minmax(10rem,1fr)_9rem] border-cz-border border-b bg-cz-body px-4 py-2 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.22em]">
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
					onClick={() => onToggleSort("source")}
				>
					Source{getSortIndicator("source")}
				</button>
				<button
					type="button"
					className="text-left hover:text-cz-cream"
					onClick={() => onToggleSort("tags")}
				>
					Tags{getSortIndicator("tags")}
				</button>
				<span className="text-right">Actions</span>
			</div>
		</div>
	);
});
