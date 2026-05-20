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
import type { SynthHeaderProps } from "@/components/preset/SynthHeader";

type AudioGate = {
	ready: boolean;
	onResume: () => void;
};

type SynthRendererOverlaysProps = {
	audioGate: AudioGate;
	brandInfoOpen: boolean;
	onCloseBrandInfo: () => void;
	globalPanelOpen: boolean;
	onCloseGlobalPanel: () => void;
	macroLabelEditorOpen: boolean;
	onCloseMacroLabelEditor: () => void;
	keyboardSettingsOpen: boolean;
	onCloseKeyboardSettings: () => void;
	pendingPresetChange: SynthHeaderProps["pendingPresetChange"];
	onSavePendingPresetChange: () => void;
	onDiscardPendingPresetChange: () => void;
	onCancelPendingPresetChange: () => void;
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
	brandInfoOpen,
	onCloseBrandInfo,
	globalPanelOpen,
	onCloseGlobalPanel,
	macroLabelEditorOpen,
	onCloseMacroLabelEditor,
	keyboardSettingsOpen,
	onCloseKeyboardSettings,
	pendingPresetChange,
	onSavePendingPresetChange,
	onDiscardPendingPresetChange,
	onCancelPendingPresetChange,
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
	const showKeyboard = !libraryModeOpen;

	return (
		<>
			<AudioStartOverlay audioGate={audioGate} />
			<SynthBrandInfoModal open={brandInfoOpen} onClose={onCloseBrandInfo} />
			<GlobalVoiceModal open={globalPanelOpen} onClose={onCloseGlobalPanel} />
			<MacroLabelEditorModal
				open={macroLabelEditorOpen}
				onClose={onCloseMacroLabelEditor}
			/>
			<KeyboardSettingsModal
				open={keyboardSettingsOpen}
				onClose={onCloseKeyboardSettings}
			/>
			<PendingModifiedPresetModal
				pendingPresetChange={pendingPresetChange}
				onSave={onSavePendingPresetChange}
				onDiscard={onDiscardPendingPresetChange}
				onCancel={onCancelPendingPresetChange}
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
