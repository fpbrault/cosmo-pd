import { memo } from "react";
import Button from "@/components/controls/Button";

type PresetLibraryDialogsProps = {
	saveAsOpen: boolean;
	saveAsName: string;
	onSaveAsNameChange: (value: string) => void;
	onCommitSaveAs: () => void;
	onCancelSaveAs: () => void;
};

export default memo(function PresetLibraryDialogs({
	saveAsOpen,
	saveAsName,
	onSaveAsNameChange,
	onCommitSaveAs,
	onCancelSaveAs,
}: PresetLibraryDialogsProps) {
	return (
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
	);
});
