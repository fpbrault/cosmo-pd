import { memo, type ReactNode } from "react";
import AudioStartOverlay from "@/components/layout/AudioStartOverlay";
import MiniKeyboardOverlay from "@/components/layout/MiniKeyboardOverlay";
import SynthInfoBar from "@/components/layout/SynthInfoBar";
import {
	GlobalVoiceModal,
	KeyboardSettingsModal,
	MacroLabelEditorModal,
	PendingModifiedPresetModal,
	SynthBrandInfoModal,
} from "@/components/modals";
import { usePresetManager } from "@/context/PresetManagerContext";
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
	onKeyboardSettingsClick: () => void;
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
	onKeyboardSettingsClick,
}: SynthRendererOverlaysProps) {
	const brandInfoOpen = useSynthUiStore((s) => s.brandInfoOpen);
	const setBrandInfoOpen = useSynthUiStore((s) => s.setBrandInfoOpen);
	const globalPanelOpen = useSynthUiStore((s) => s.globalPanelOpen);
	const setGlobalPanelOpen = useSynthUiStore((s) => s.setGlobalPanelOpen);
	const macroLabelEditorOpen = useSynthUiStore((s) => s.macroLabelEditorOpen);
	const setMacroLabelEditorOpen = useSynthUiStore(
		(s) => s.setMacroLabelEditorOpen,
	);
	const keyboardSettingsOpen = useSynthUiStore((s) => s.keyboardSettingsOpen);
	const setKeyboardSettingsOpen = useSynthUiStore(
		(s) => s.setKeyboardSettingsOpen,
	);
	const {
		pendingPresetChange,
		handleSavePendingPresetChange,
		handleDiscardPendingPresetChange,
		handleCancelPendingPresetChange,
	} = usePresetManager();
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
			<MacroLabelEditorModal
				open={macroLabelEditorOpen}
				onClose={() => setMacroLabelEditorOpen(false)}
			/>
			<KeyboardSettingsModal
				open={keyboardSettingsOpen}
				onClose={() => setKeyboardSettingsOpen(false)}
			/>
			<PendingModifiedPresetModal
				pendingPresetChange={pendingPresetChange}
				onSave={handleSavePendingPresetChange}
				onDiscard={handleDiscardPendingPresetChange}
				onCancel={handleCancelPendingPresetChange}
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
				onKeyboardSettingsClick={onKeyboardSettingsClick}
			/>
		</>
	);
});
