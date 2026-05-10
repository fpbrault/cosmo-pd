import { memo } from "react";
import Button from "@/components/controls/Button";
import type { PresetEntry } from "@/features/synth/types/presetEntry";

type PresetLibraryDialogsProps = {
	renameEntry: PresetEntry | null;
	renameValue: string;
	onRenameValueChange: (value: string) => void;
	onCommitRename: () => void;
	onCancelRename: () => void;
	deleteEntry: PresetEntry | null;
	onCommitDelete: () => void;
	onCancelDelete: () => void;
	metadataEntry: PresetEntry | null;
	metadataCategoryValue: string;
	onMetadataCategoryValueChange: (value: string) => void;
	metadataTagsValue: string;
	onMetadataTagsValueChange: (value: string) => void;
	onCommitMetadata: () => void;
	onCancelMetadata: () => void;
	saveAsOpen: boolean;
	saveAsName: string;
	onSaveAsNameChange: (value: string) => void;
	onCommitSaveAs: () => void;
	onCancelSaveAs: () => void;
};

export default memo(function PresetLibraryDialogs({
	renameEntry,
	renameValue,
	onRenameValueChange,
	onCommitRename,
	onCancelRename,
	deleteEntry,
	onCommitDelete,
	onCancelDelete,
	metadataEntry,
	metadataCategoryValue,
	onMetadataCategoryValueChange,
	metadataTagsValue,
	onMetadataTagsValueChange,
	onCommitMetadata,
	onCancelMetadata,
	saveAsOpen,
	saveAsName,
	onSaveAsNameChange,
	onCommitSaveAs,
	onCancelSaveAs,
}: PresetLibraryDialogsProps) {
	return (
		<>
			<dialog
				className="modal"
				open={renameEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					onCancelRename();
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Rename preset</h3>
					<input
						type="text"
						className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
						value={renameValue}
						onChange={(event) => onRenameValueChange(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") onCommitRename();
							if (event.key === "Escape") onCancelRename();
						}}
					/>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={onCancelRename}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn btn-primary"
							aria-label="Confirm rename"
							onClick={onCommitRename}
						>
							Rename
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={deleteEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					onCancelDelete();
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Delete preset?</h3>
					<p className="mt-3 text-cz-cream-dim text-sm">
						{deleteEntry?.label} will be removed from your local presets.
					</p>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={onCancelDelete}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn bg-red-700 text-white"
							aria-label="Confirm delete"
							onClick={onCommitDelete}
						>
							Delete
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={metadataEntry !== null}
				onCancel={(event) => {
					event.preventDefault();
					onCancelMetadata();
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Preset metadata</h3>
					<p className="mt-2 text-cz-cream-dim text-xs">
						{metadataEntry?.label}
					</p>
					<div className="mt-4 space-y-3">
						<div>
							<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
								Category
							</p>
							<input
								type="text"
								className="input w-full border-cz-border bg-cz-inset text-cz-cream"
								placeholder="Lead, Bass, Pad"
								value={metadataCategoryValue}
								onChange={(event) =>
									onMetadataCategoryValueChange(event.target.value)
								}
							/>
						</div>
						<div>
							<p className="mb-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.2em]">
								Tags
							</p>
							<input
								type="text"
								className="input w-full border-cz-border bg-cz-inset text-cz-cream"
								placeholder="warm, analog, bright"
								value={metadataTagsValue}
								onChange={(event) =>
									onMetadataTagsValueChange(event.target.value)
								}
								onKeyDown={(event) => {
									if (event.key === "Enter") onCommitMetadata();
									if (event.key === "Escape") onCancelMetadata();
								}}
							/>
						</div>
					</div>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={onCancelMetadata}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn btn-primary"
							aria-label="Confirm metadata"
							onClick={onCommitMetadata}
						>
							Save
						</Button>
					</div>
				</div>
			</dialog>

			<dialog
				className="modal"
				open={saveAsOpen}
				onCancel={(event) => {
					event.preventDefault();
					onCancelSaveAs();
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">Save preset as</h3>
					<input
						type="text"
						className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
						placeholder="New preset name"
						value={saveAsName}
						onChange={(event) => onSaveAsNameChange(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") onCommitSaveAs();
							if (event.key === "Escape") onCancelSaveAs();
						}}
					/>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={onCancelSaveAs}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="btn bg-cz-gold text-white"
							aria-label="Confirm save as"
							disabled={!saveAsName.trim()}
							onClick={onCommitSaveAs}
						>
							Save As
						</Button>
					</div>
				</div>
			</dialog>
		</>
	);
});
