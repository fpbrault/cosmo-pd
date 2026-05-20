import GlobalVoicePanel from "@/components/panels/voice/GlobalVoicePanel";
import { SynthOverlayModal } from "./SynthOverlayModal";

export function GlobalVoiceModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Global Settings"
			ariaLabel="Global settings"
			widthClassName="w-[min(48rem,96%)]"
		>
			<div className="max-h-[72vh] overflow-y-auto rounded-md bg-cz-bg/35 p-2">
				<GlobalVoicePanel />
			</div>
		</SynthOverlayModal>
	);
}
