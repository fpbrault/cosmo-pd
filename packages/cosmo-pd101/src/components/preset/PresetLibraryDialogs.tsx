import { memo } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation("synth");
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
				<h3 className="font-bold font-mono text-lg">
					{t("presetDialogs.saveAsTitle")}
				</h3>
				<input
					type="text"
					className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
					placeholder={t("presetDialogs.saveAsPlaceholder")}
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
						{t("presetDialogs.cancel")}
					</Button>
					<Button
						type="button"
						className="btn bg-cz-gold text-white"
						aria-label={t("presetDialogs.confirmSaveAria")}
						disabled={!saveAsName.trim()}
						onClick={onCommitSaveAs}
					>
						{t("presetDialogs.saveAsConfirm")}
					</Button>
				</div>
			</div>
		</dialog>
	);
});
