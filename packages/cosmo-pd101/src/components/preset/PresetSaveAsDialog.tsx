import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import SynthTextInput from "@/components/controls/SynthTextInput";

type PresetSaveAsDialogProps = {
	open: boolean;
	name: string;
	onNameChange: (value: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
};

export default memo(function PresetSaveAsDialog({
	open,
	name,
	onNameChange,
	onConfirm,
	onCancel,
}: PresetSaveAsDialogProps) {
	const { t } = useTranslation("synth");

	return (
		<dialog
			className="modal"
			open={open}
			onCancel={(event) => {
				event.preventDefault();
				onCancel();
			}}
		>
			<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
				<h3 className="font-bold font-mono text-lg">
					{t("presetDialogs.saveAsTitle")}
				</h3>
				<SynthTextInput
					value={name}
					onChange={onNameChange}
					onCommit={onConfirm}
					onCancel={onCancel}
					placeholder={t("presetDialogs.saveAsPlaceholder")}
					className="mt-4"
				/>
				<div className="modal-action">
					<Button
						type="button"
						className="btn border-cz-border bg-cz-inset text-cz-cream"
						onClick={onCancel}
					>
						{t("presetDialogs.cancel")}
					</Button>
					<Button
						type="button"
						className="btn bg-cz-gold text-white"
						aria-label={t("presetDialogs.confirmSaveAria")}
						disabled={!name.trim()}
						onClick={onConfirm}
					>
						{t("presetDialogs.saveAsConfirm")}
					</Button>
				</div>
			</div>
		</dialog>
	);
});
