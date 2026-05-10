import { memo } from "react";
import Button from "@/components/controls/Button";

type PresetLibrarySidebarProps = {
	activeLocalEntryLabel: string | null;
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
	saveName,
	onSaveNameChange,
	onSave,
	onOpenSaveAs,
	onExportCurrentState,
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
					</div>
					<div className="mt-3">
						<input
							type="text"
							className="input input-sm w-full border-cz-border bg-cz-inset text-cz-cream placeholder-cz-cream-dim/70"
							placeholder="Export file name"
							value={saveName}
							onChange={(event) => onSaveNameChange(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") onExportCurrentState();
							}}
						/>
					</div>
					<div className="mt-2 grid grid-cols-1 gap-2">
						<Button
							type="button"
							className="btn btn-sm border-cz-border bg-cz-inset text-cz-light-blue"
							aria-label="Export current state"
							disabled={!saveName.trim()}
							onClick={onExportCurrentState}
						>
							Export
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
						<Button
							type="button"
							className="btn btn-sm border-cz-border bg-cz-inset text-red-400"
							onClick={onInitPreset}
						>
							Init
						</Button>
					</div>
					{importError ? (
						<p className="mt-2 text-red-400 text-xs">{importError}</p>
					) : null}
				</section>
			</div>
		</aside>
	);
});
