import { memo } from "react";
import Button from "@/components/controls/Button";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";

type PresetLibrarySidebarProps = {
	activeLocalEntryLabel: string | null;
	selectedLocalEntryLabel: string | null;
	selectedLocalEntryAuthor: string | null;
	renameValue: string;
	onRenameValueChange: (name: string) => void;
	onCommitRename: () => void;
	authorValue: string;
	onAuthorValueChange: (author: string) => void;
	onCommitAuthor: () => void;
	selectedLocalTags: string[];
	tagDraft: string;
	tagSuggestions: readonly string[];
	onTagDraftChange: (value: string) => void;
	onAddTag: () => void;
	onRemoveTag: (tag: string) => void;
	onExportSelectedPreset: () => void;
	onDeleteSelectedPreset: () => void;
	saveName: string;
	onSaveNameChange: (name: string) => void;
	onSave: () => void;
	onOpenSaveAs: () => void;
	onExportCurrentState: () => void;
	onImportClick: () => void;
	onInitPreset: () => void;
	importError: string | null;
};

export default memo(function PresetLibrarySidebar({
	activeLocalEntryLabel,
	selectedLocalEntryLabel,
	selectedLocalEntryAuthor,
	renameValue,
	onRenameValueChange,
	onCommitRename,
	authorValue,
	onAuthorValueChange,
	onCommitAuthor,
	selectedLocalTags,
	tagDraft,
	tagSuggestions,
	onTagDraftChange,
	onAddTag,
	onRemoveTag,
	onExportSelectedPreset,
	onDeleteSelectedPreset,
	onSave,
	onOpenSaveAs,
	onImportClick,
	onInitPreset,
	importError,
}: PresetLibrarySidebarProps) {
	return (
		<aside className="border-cz-border border-t-0 border-l bg-cz-surface p-4">
			<div className="space-y-5">
				<section>
					<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
						Selected Preset
					</h3>
					{selectedLocalEntryLabel ? (
						<div className="space-y-3">
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									Name
								</p>
								<input
									type="text"
									className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream"
									placeholder="Preset name"
									value={renameValue}
									onChange={(event) => onRenameValueChange(event.target.value)}
									onBlur={onCommitRename}
									onKeyDown={(event) => {
										if (event.key === "Enter") onCommitRename();
									}}
								/>
							</div>
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									Author
								</p>
								<input
									type="text"
									className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream"
									placeholder="Preset author"
									value={authorValue}
									onChange={(event) => onAuthorValueChange(event.target.value)}
									onBlur={onCommitAuthor}
									onKeyDown={(event) => {
										if (event.key === "Enter") onCommitAuthor();
									}}
								/>
								{selectedLocalEntryAuthor ? null : (
									<p className="mt-1 text-cz-cream-dim text-xs">
										No author set.
									</p>
								)}
							</div>
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									Tags
								</p>
								<div className="mb-2 flex flex-wrap gap-2">
									{selectedLocalTags.length > 0 ? (
										selectedLocalTags.map((tag) => (
											<button
												key={tag}
												type="button"
												className="badge badge-primary gap-1 capitalize"
												onClick={() => onRemoveTag(tag)}
											>
												{tag}
												<span aria-hidden="true">×</span>
											</button>
										))
									) : (
										<span className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
											No tags
										</span>
									)}
								</div>
								<div className="flex gap-2">
									<input
										type="text"
										list="preset-tag-options"
										className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream"
										placeholder="Add tag"
										value={tagDraft}
										onChange={(event) => onTagDraftChange(event.target.value)}
										onKeyDown={(event) => {
											if (event.key === "Enter") {
												event.preventDefault();
												onAddTag();
											}
										}}
									/>
									<Button
										type="button"
										className="btn btn-sm btn-secondary"
										disabled={!tagDraft.trim() || tagSuggestions.length === 0}
										onClick={onAddTag}
									>
										Add
									</Button>
								</div>
								<datalist id="preset-tag-options">
									{PRESET_TAG_OPTIONS.map((tag) => (
										<option key={tag} value={tag} />
									))}
								</datalist>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button
									type="button"
									className="btn btn-sm border-cz-border bg-cz-inset text-cz-light-blue"
									onClick={onExportSelectedPreset}
								>
									Export
								</Button>
								<Button
									type="button"
									className="btn btn-sm border-cz-border bg-cz-inset text-red-400"
									onClick={onDeleteSelectedPreset}
								>
									Delete
								</Button>
							</div>
						</div>
					) : (
						<p className="text-cz-cream-dim text-xs">
							Select a user preset to rename it, manage its tags, export it, or
							delete it.
						</p>
					)}
				</section>

				<section>
					<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
						Current State
					</h3>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<Button
							type="button"
							className="btn btn-sm btn-warning"
							disabled={!activeLocalEntryLabel}
							onClick={onSave}
						>
							Save
						</Button>
						<Button
							type="button"
							className="btn btn-sm btn-success"
							onClick={onOpenSaveAs}
						>
							Save As
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
							onClick={onImportClick}
						>
							Import
						</Button>
					</div>
					{importError ? (
						<p className="mt-2 text-red-400 text-xs">{importError}</p>
					) : null}
				</section>
				<section>
					<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
						Reset
					</h3>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-red-400"
						onClick={onInitPreset}
					>
						Create Default Preset
					</Button>
				</section>
			</div>
		</aside>
	);
});
