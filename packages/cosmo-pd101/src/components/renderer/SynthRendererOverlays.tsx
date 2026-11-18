import { memo } from "react";
import AudioStartOverlay from "@/components/layout/AudioStartOverlay";
import { SynthBrandInfoModal } from "@/components/modals";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

type AudioGate = {
	ready: boolean;
	onResume: () => void;
};

type SynthRendererOverlaysProps = {
	appVersion: string;
	audioGate: AudioGate;
};

export default memo(function SynthRendererOverlays({
	appVersion,
	audioGate,
}: SynthRendererOverlaysProps) {
	const brandInfoOpen = useSynthUiStore((s) => s.brandInfoOpen);
	const setBrandInfoOpen = useSynthUiStore((s) => s.setBrandInfoOpen);

	return (
		<>
			<AudioStartOverlay audioGate={audioGate} />
			<SynthBrandInfoModal
				open={brandInfoOpen}
				onClose={() => setBrandInfoOpen(false)}
				appVersion={appVersion}
			/>
		</>
	);
});
