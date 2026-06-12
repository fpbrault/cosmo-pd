import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";

type PresetLibraryDialogsProps = {
	saveAsOpen: boolean;
	saveAsName: string;
	onSaveAsNameChange: (value: string) => void;
	onCommitSaveAs: () => void;
	onCancelSaveAs: () => void;
	recoveryConfirmation: "repair" | "rebuild" | null;
	onConfirmRecovery: () => void;
	onCancelRecovery: () => void;
};

export default memo(function PresetLibraryDialogs({
	saveAsOpen,
	saveAsName,
	onSaveAsNameChange,
	onCommitSaveAs,
	onCancelSaveAs,
	recoveryConfirmation,
	onConfirmRecovery,
	onCancelRecovery,
}: PresetLibraryDialogsProps) {
	const { t } = useTranslation("synth");
	return (
		<>
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

			<dialog
				className="modal"
				open={recoveryConfirmation !== null}
				onCancel={(event) => {
					event.preventDefault();
					onCancelRecovery();
				}}
			>
				<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
					<h3 className="font-bold font-mono text-lg">
						{t(
							recoveryConfirmation === "rebuild"
								? "presetLibrary.rebuildConfirmationTitle"
								: "presetLibrary.repairConfirmationTitle",
						)}
					</h3>
					<p className="mt-4">
						{t(
							recoveryConfirmation === "rebuild"
								? "presetLibrary.rebuildConfirmation"
								: "presetLibrary.repairConfirmation",
						)}
					</p>
					<div className="modal-action">
						<Button
							type="button"
							className="btn border-cz-border bg-cz-inset text-cz-cream"
							onClick={onCancelRecovery}
						>
							{t("presetDialogs.cancel")}
						</Button>
						<Button
							type="button"
							className={
								recoveryConfirmation === "rebuild"
									? "btn btn-error"
									: "btn btn-primary"
							}
							onClick={onConfirmRecovery}
						>
							{t(
								recoveryConfirmation === "rebuild"
									? "presetLibrary.confirmRebuild"
									: "presetLibrary.confirmRepair",
							)}
						</Button>
					</div>
				</div>
			</dialog>
		</>
	);
});
