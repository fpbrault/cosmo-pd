import { memo, type ReactNode } from "react";
import AudioStartOverlay from "@/components/layout/AudioStartOverlay";
import MiniKeyboardOverlay from "@/components/layout/MiniKeyboardOverlay";
import SynthInfoBar from "@/components/layout/SynthInfoBar";
import { GlobalVoiceModal, SynthBrandInfoModal } from "@/components/modals";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

type AudioGate = {
	ready: boolean;
	onResume: () => void;
};

type SynthRendererOverlaysProps = {
	audioGate: AudioGate;
	activeNotes: number[];
	libraryModeOpen: boolean;
	keyboardVisible: boolean;
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPolyAftertouch: (note: number, pressure: number) => void;
	infoText: string;
	bottomBarExtra?: ReactNode;
	onKeyboardToggle: () => void;
};

export default memo(function SynthRendererOverlays({
	audioGate,
	activeNotes,
	libraryModeOpen,
	keyboardVisible,
	onNoteOn,
	onNoteOff,
	onPolyAftertouch,
	infoText,
	bottomBarExtra,
	onKeyboardToggle,
}: SynthRendererOverlaysProps) {
	const brandInfoOpen = useSynthUiStore((s) => s.brandInfoOpen);
	const setBrandInfoOpen = useSynthUiStore((s) => s.setBrandInfoOpen);
	const globalPanelOpen = useSynthUiStore((s) => s.globalPanelOpen);
	const setGlobalPanelOpen = useSynthUiStore((s) => s.setGlobalPanelOpen);
	const showKeyboard = !libraryModeOpen;

	return (
		<>
			<AudioStartOverlay audioGate={audioGate} />
			<SynthBrandInfoModal
				open={brandInfoOpen}
				onClose={() => setBrandInfoOpen(false)}
			/>
			<GlobalVoiceModal
				open={globalPanelOpen}
				onClose={() => setGlobalPanelOpen(false)}
			/>
			{showKeyboard ? (
				<MiniKeyboardOverlay
					activeNotes={activeNotes}
					visible={keyboardVisible}
					onNoteOn={onNoteOn}
					onNoteOff={onNoteOff}
					onPolyAftertouch={onPolyAftertouch}
				/>
			) : null}
			<SynthInfoBar
				infoText={infoText}
				bottomBarExtra={bottomBarExtra}
				showKeyboardToggle={showKeyboard}
				keyboardVisible={keyboardVisible}
				onKeyboardToggle={onKeyboardToggle}
			/>
		</>
	);
});
