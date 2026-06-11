import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";
import PresetMultiSelect from "./PresetMultiSelect";
import { getPresetTagBadgeClassName } from "./presetTagTone";

type PresetLibrarySidebarProps = {
	activeLocalEntryLabel: string | null;
	selectedEntry: PresetEntry | null;
	renameValue: string;
	onRenameValueChange: (name: string) => void;
	onCommitRename: () => void;
	authorValue: string;
	onAuthorValueChange: (author: string) => void;
	onCommitAuthor: () => void;
	descriptionValue: string;
	onDescriptionValueChange: (description: string) => void;
	onCommitDescription: () => void;
	selectedTags: string[];
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
	selectedEntry,
	renameValue,
	onRenameValueChange,
	onCommitRename,
	authorValue,
	onAuthorValueChange,
	onCommitAuthor,
	descriptionValue,
	onDescriptionValueChange,
	onCommitDescription,
	selectedTags,
	onSelectedTagsChange,
	onExportSelectedPreset,
	onDeleteSelectedPreset,
	onSave,
	onOpenSaveAs,
	onImportClick,
	onInitPreset,
	importError,
}: PresetLibrarySidebarProps) {
	const { t } = useTranslation("synth");
	return (
		<aside className="border-cz-border border-t-0 border-l bg-cz-surface p-4">
			<div className="space-y-5">
				<section>
					<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
						{t("presetLibrary.currentState")}
					</h3>
					<div className="mt-2 grid grid-cols-2 gap-2">
						<Button
							type="button"
							className="btn btn-sm btn-warning"
							disabled={!activeLocalEntryLabel}
							onClick={onSave}
						>
							{t("presetLibrary.save")}
						</Button>
						<Button
							type="button"
							className="btn btn-sm btn-success"
							onClick={onOpenSaveAs}
						>
							{t("presetLibrary.saveAs")}
						</Button>
						<Button
							type="button"
							className="btn btn-sm btn-secondary"
							onClick={onImportClick}
						>
							{t("presetLibrary.import")}
						</Button>
						<Button
							type="button"
							className="btn btn-sm btn-error"
							onClick={onInitPreset}
						>
							{t("presetLibrary.initPreset")}
						</Button>
						{importError ? (
							<p className="mt-2 text-red-400 text-xs">{importError}</p>
						) : null}
					</div>
					<div className="grid grid-cols-2 gap-2"></div>
				</section>

				<section className="border-cz-border/70 border-t pt-5">
					<h3 className="mb-2 font-mono text-4xs text-cz-gold uppercase tracking-[0.28em]">
						{t("presetLibrary.selectedPreset")}
					</h3>
					{selectedEntry ? (
						<div className="space-y-3">
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									{t("presetLibrary.nameLabel")}
								</p>
								{selectedEntry.type === "local" ? (
									<input
										type="text"
										className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream"
										placeholder="Preset name"
										value={renameValue}
										onChange={(event) =>
											onRenameValueChange(event.target.value)
										}
										onBlur={onCommitRename}
										onKeyDown={(event) => {
											if (event.key === "Enter") onCommitRename();
										}}
									/>
								) : (
									<p className="text-cz-cream text-sm">{selectedEntry.label}</p>
								)}
							</div>
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									{t("presetLibrary.authorLabel")}
								</p>
								{selectedEntry.type === "local" ? (
									<input
										type="text"
										className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream"
										placeholder="Preset author"
										value={authorValue}
										onChange={(event) =>
											onAuthorValueChange(event.target.value)
										}
										onBlur={onCommitAuthor}
										onKeyDown={(event) => {
											if (event.key === "Enter") onCommitAuthor();
										}}
									/>
								) : (
									<p className="text-cz-cream text-sm">
										{selectedEntry.author || t("presetLibrary.noAuthor")}
									</p>
								)}
								{selectedEntry.type === "local" && !selectedEntry.author ? (
									<p className="mt-1 text-cz-cream-dim text-xs">
										{t("presetLibrary.noAuthor")}
									</p>
								) : null}
							</div>
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									{t("presetLibrary.descriptionLabel")}
								</p>
								{selectedEntry.type === "local" ? (
									<textarea
										className="textarea textarea-sm min-h-24 w-full resize-y border-cz-border bg-cz-inset text-cz-cream"
										placeholder={t("presetLibrary.descriptionPlaceholder")}
										value={descriptionValue}
										onChange={(event) =>
											onDescriptionValueChange(event.target.value)
										}
										onBlur={onCommitDescription}
										onKeyDown={(event) => {
											if (
												event.key === "Enter" &&
												(event.metaKey || event.ctrlKey)
											) {
												onCommitDescription();
											}
										}}
									/>
								) : (
									<p className="whitespace-pre-wrap text-cz-cream text-sm">
										{selectedEntry.description ||
											t("presetLibrary.noDescription")}
									</p>
								)}
							</div>
							<div>
								<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
									{t("presetLibrary.tagsLabel")}
								</p>
								<div className="mb-2 flex flex-wrap gap-2">
									{selectedTags.length > 0 ? (
										selectedTags.map((tag) => (
											<span
												key={tag}
												className={getPresetTagBadgeClassName(tag)}
											>
												{tag}
											</span>
										))
									) : (
										<span className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.16em]">
											{t("presetLibrary.noTags")}
										</span>
									)}
								</div>
								{selectedEntry.type === "local" ? (
									<PresetMultiSelect
										label={t("presetLibrary.presetTagsLabel")}
										inputId="preset-tag-editor"
										options={PRESET_TAG_OPTIONS.map((tag) => ({
											value: tag,
											label: tag,
										}))}
										selectedValues={selectedTags}
										onChange={onSelectedTagsChange}
										placeholder="Select tags"
										clearButtonLabel="Clear preset tags"
										noOptionsMessage="No tags"
										tagTone
									/>
								) : null}
							</div>
							{selectedEntry.type === "local" ? (
								<div className="grid grid-cols-2 gap-2">
									<Button
										type="button"
										className="btn btn-sm border-cz-border bg-cz-inset text-cz-light-blue"
										onClick={onExportSelectedPreset}
									>
										{t("presetLibrary.export")}
									</Button>
									<Button
										type="button"
										className="btn btn-sm border-cz-border bg-cz-inset text-red-400"
										onClick={onDeleteSelectedPreset}
									>
										{t("presetLibrary.delete")}
									</Button>
								</div>
							) : null}
						</div>
					) : (
						<p className="text-cz-cream-dim text-xs">
							{t("presetLibrary.sidebarEmptyState")}
						</p>
					)}
				</section>
			</div>
		</aside>
	);
});
