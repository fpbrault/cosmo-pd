import { useTranslation } from "react-i18next";
import GlobalVoicePanel from "@/components/panels/voice/GlobalVoicePanel";
import { SynthOverlayModal } from "./SynthOverlayModal";

export function GlobalVoiceModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { t } = useTranslation("synth");
	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title={t("globalVoice.modalTitle")}
			ariaLabel={t("globalVoice.modalAria")}
			widthClassName="w-[min(48rem,96%)]"
		>
			<div className="max-h-[72vh] overflow-y-auto rounded-md bg-cz-bg/35 p-2">
				<GlobalVoicePanel />
			</div>
		</SynthOverlayModal>
	);
}
