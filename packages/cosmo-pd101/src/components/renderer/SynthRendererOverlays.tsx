import { memo } from "react";
import AudioStartOverlay from "@/components/layout/AudioStartOverlay";
import { GlobalVoiceModal, SynthBrandInfoModal } from "@/components/modals";
import PerformanceDiagnosticsOverlay from "@/components/performance/PerformanceDiagnosticsOverlay";
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
	const globalPanelOpen = useSynthUiStore((s) => s.globalPanelOpen);
	const setGlobalPanelOpen = useSynthUiStore((s) => s.setGlobalPanelOpen);

	return (
		<>
			<PerformanceDiagnosticsOverlay />
			<AudioStartOverlay audioGate={audioGate} />
			<SynthBrandInfoModal
				open={brandInfoOpen}
				onClose={() => setBrandInfoOpen(false)}
				appVersion={appVersion}
			/>
			<GlobalVoiceModal
				open={globalPanelOpen}
				onClose={() => setGlobalPanelOpen(false)}
			/>
		</>
	);
});
