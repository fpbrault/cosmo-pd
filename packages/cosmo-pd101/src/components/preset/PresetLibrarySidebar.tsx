import { memo } from "react";
import Button from "@/components/controls/Button";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";
import PresetMultiSelect from "./PresetMultiSelect";
import { getPresetTagBadgeClassName } from "./presetTagTone";

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
	onSelectedTagsChange: (tags: string[]) => void;
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
	onSelectedTagsChange,
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
						<Button
							type="button"
							className="btn btn-sm btn-secondary"
							onClick={onImportClick}
						>
							Import
						</Button>
						<Button
							type="button"
							className="btn btn-sm btn-error"
							onClick={onInitPreset}
						>
							Init Preset
						</Button>
						{importError ? (
							<p className="mt-2 text-red-400 text-xs">{importError}</p>
						) : null}
					</div>
					<div className="grid grid-cols-2 gap-2"></div>
				</section>

				<section className="border-cz-border/70 border-t pt-5">
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
											<span
												key={tag}
												className={getPresetTagBadgeClassName(tag)}
											>
												{tag}
											</span>
										))
									) : (
										<span className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
											No tags
										</span>
									)}
								</div>
								<PresetMultiSelect
									label="Preset tags"
									inputId="preset-tag-editor"
									options={PRESET_TAG_OPTIONS.map((tag) => ({
										value: tag,
										label: tag,
									}))}
									selectedValues={selectedLocalTags}
									onChange={onSelectedTagsChange}
									placeholder="Select tags"
									clearButtonLabel="Clear preset tags"
									noOptionsMessage="No tags"
									tagTone
								/>
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
			</div>
		</aside>
	);
});
