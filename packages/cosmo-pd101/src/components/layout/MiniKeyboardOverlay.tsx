import { useMemo } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import MiniKeyboardKeybed from "./MiniKeyboardKeybed";
import MiniKeyboardResizeHandle from "./MiniKeyboardResizeHandle";
import MiniKeyboardShell from "./MiniKeyboardShell";
import {
	buildKeyboardLayout,
	getBlackKeyWidthPercent,
} from "./miniKeyboardLayout";
import { useMiniKeyboardInteraction } from "./useMiniKeyboardInteraction";
import { useMiniKeyboardResize } from "./useMiniKeyboardResize";

type MiniKeyboardOverlayProps = {
	activeNotes: number[];
	visible: boolean;
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPolyAftertouch?: (note: number, value: number) => void;
};

export default function MiniKeyboardOverlay({
	activeNotes,
	visible,
	onNoteOn,
	onNoteOff,
	onPolyAftertouch,
}: MiniKeyboardOverlayProps) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const setKeyboardHeight = useSynthUiStore((s) => s.setKeyboardHeight);
	const polyMode = useSynthStore((s) => s.polyMode);

	const startNote = 36 + keyboardRange * 12;
	const activeSet = useMemo(() => new Set(activeNotes), [activeNotes]);
	const blackKeyWidth = getBlackKeyWidthPercent(keyboardOctaves);
	const { whiteKeys, blackKeys } = useMemo(
		() => buildKeyboardLayout(startNote, keyboardOctaves),
		[startNote, keyboardOctaves],
	);

	const { resizeRef, handleResizePointerDown } = useMiniKeyboardResize({
		keyboardHeight,
		setKeyboardHeight,
	});
	const { handleKeyPointerDown } = useMiniKeyboardInteraction({
		visible,
		keyboardInputMode,
		polyMode,
		onNoteOn,
		onNoteOff,
		onPolyAftertouch,
		resizeActiveRef: resizeRef,
	});

	return (
		<MiniKeyboardShell visible={visible}>
			<MiniKeyboardResizeHandle onPointerDown={handleResizePointerDown} />
			<MiniKeyboardKeybed
				keyboardHeight={keyboardHeight}
				whiteKeys={whiteKeys}
				blackKeys={blackKeys}
				blackKeyWidth={blackKeyWidth}
				activeNotes={activeSet}
				onKeyPointerDown={handleKeyPointerDown}
			/>
		</MiniKeyboardShell>
	);
}
