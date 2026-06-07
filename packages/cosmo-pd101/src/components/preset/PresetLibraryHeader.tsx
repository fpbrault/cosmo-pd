import { memo } from "react";
import Button from "@/components/controls/Button";
import { getPresetTagCheckboxClassName } from "./presetTagTone";
import type { FilterOptions } from "./usePresetLibraryState";

type SortKey = "star" | "favorite" | "name" | "author" | "tags";

type PresetLibraryHeaderProps = {
	activePresetName: string;
	totalCount: number;
	search: string;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	onClose: () => void;
	bankOptions: FilterOptions;
	selectedBankFilter: string | null;
	onSelectBankFilter: (bank: string) => void;
	onClearBankFilter: () => void;
	authorOptions: FilterOptions;
	selectedAuthorFilter: string | null;
	onSelectAuthorFilter: (author: string) => void;
	onClearAuthorFilter: () => void;
	tagOptions: FilterOptions;
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
	bankOptions,
	selectedBankFilter,
	onSelectBankFilter,
	onClearBankFilter,
	authorOptions,
	selectedAuthorFilter,
	onSelectAuthorFilter,
	onClearAuthorFilter,
	tagOptions,
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
			<div className="flex flex-wrap place-content-end items-center gap-2">
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
			<div className="col-span-1">
				<div className="min-w-100">
					<div className="mb-1 flex items-center justify-between gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Filter bank
						</p>
					</div>
					<form
						className="filter"
						onSubmit={(event) => event.preventDefault()}
						onReset={(event) => {
							event.preventDefault();
							onClearBankFilter();
						}}
					>
						<div className="flex flex-wrap gap-2">
							{bankOptions.map((option) => {
								const active = option.value === selectedBankFilter;
								return (
									<input
										key={option.value}
										type="radio"
										name="bank-filter"
										className="btn btn-sm btn-primary"
										checked={active}
										aria-label={option.value}
										disabled={option.disabled}
										onClick={() => {
											onSelectBankFilter(option.value);
										}}
									/>
								);
							})}
							<button
								type="reset"
								className="btn btn-square btn-sm"
								aria-label="Clear bank filters"
								disabled={selectedBankFilter === null}
							>
								x
							</button>
						</div>
					</form>
				</div>
				<div className="col-span-1 min-w-80">
					<div className="mb-1 flex items-center justify-between gap-2">
						<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
							Filter author
						</p>
					</div>
					<form
						className="filter"
						onSubmit={(event) => event.preventDefault()}
						onReset={(event) => {
							event.preventDefault();
							onClearAuthorFilter();
						}}
					>
						<div className="flex flex-wrap gap-2">
							{authorOptions.map((option) => {
								const active = option.value === selectedAuthorFilter;
								return (
									<input
										key={option.value}
										type="radio"
										name="author-filter"
										className="btn btn-sm btn-primary"
										checked={active}
										aria-label={option.value}
										disabled={option.disabled}
										onClick={() => {
											onSelectAuthorFilter(option.value);
										}}
									/>
								);
							})}
							<button
								type="reset"
								className="btn btn-square btn-sm"
								aria-label="Clear author filters"
								disabled={selectedAuthorFilter === null}
							>
								x
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-center justify-between gap-2">
					<p className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Filter tags
					</p>
				</div>
				<form
					onSubmit={(event) => event.preventDefault()}
					onReset={(event) => {
						event.preventDefault();
						onClearTagFilters();
					}}
				>
					<div className="flex flex-wrap gap-2">
						{tagOptions.map((option) => {
							const checked = selectedTagFilters.includes(option.value);
							return (
								<label
									key={option.value}
									className={getPresetTagCheckboxClassName(
										option.value,
										checked,
										option.disabled,
									)}
								>
									<input
										type="checkbox"
										name="tag-filter"
										className="peer sr-only"
										checked={checked}
										disabled={option.disabled}
										onChange={() => {
											onToggleTagFilter(option.value);
										}}
									/>
									{option.value.toLowerCase()}
								</label>
							);
						})}
						<button
							type="reset"
							className="btn btn-square btn-sm"
							aria-label="Clear tag filters"
							disabled={selectedTagFilters.length === 0}
						>
							x
						</button>
					</div>
				</form>
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
