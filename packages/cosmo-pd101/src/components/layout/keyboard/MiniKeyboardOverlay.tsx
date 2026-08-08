import { useMemo } from "react";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { NOTE_TO_PC_KEY } from "@/lib/synth/pcKeyboardMapping";
import PerformanceWheels from "../performance/PerformanceWheels";
import MiniKeyboardKeybed from "./MiniKeyboardKeybed";
import MiniKeyboardShell from "./MiniKeyboardShell";
import {
	buildKeyboardLayout,
	getBlackKeyWidthPercent,
} from "./miniKeyboardLayout";
import { useMiniKeyboardInteraction } from "./useMiniKeyboardInteraction";

type MiniKeyboardOverlayProps = {
	activeNotes: number[];
	pitchBend: number;
	modWheel: number;
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPitchBend: (value: number) => void;
	onModWheel: (value: number) => void;
	onPolyAftertouch?: (note: number, value: number) => void;
};

export default function MiniKeyboardOverlay({
	activeNotes,
	pitchBend,
	modWheel,
	onNoteOn,
	onNoteOff,
	onPitchBend,
	onModWheel,
	onPolyAftertouch,
}: MiniKeyboardOverlayProps) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const pcKeyboardOverlayVisible = useSynthUiStore(
		(s) => s.pcKeyboardOverlayVisible,
	);
	const polyMode = useSynthStore((s) => s.polyMode);

	const startNote = 36 + keyboardRange * 12;
	const activeSet = useMemo(() => new Set(activeNotes), [activeNotes]);
	const blackKeyWidth = getBlackKeyWidthPercent(keyboardOctaves);
	const { whiteKeys, blackKeys } = useMemo(
		() => buildKeyboardLayout(startNote, keyboardOctaves),
		[startNote, keyboardOctaves],
	);
	const pcKeyLabels = useMemo(() => {
		if (!pcKeyboardOverlayVisible) return undefined;
		const labels: Record<number, string> = {};
		for (const key of whiteKeys) {
			const offset = key.note - startNote;
			const pcKey = NOTE_TO_PC_KEY[offset];
			if (pcKey)
				labels[key.note] =
					pcKey.length === 1 && /^[a-z]$/.test(pcKey)
						? pcKey.toUpperCase()
						: pcKey;
		}
		for (const key of blackKeys) {
			const offset = key.note - startNote;
			const pcKey = NOTE_TO_PC_KEY[offset];
			if (pcKey)
				labels[key.note] =
					pcKey.length === 1 && /^[a-z]$/.test(pcKey)
						? pcKey.toUpperCase()
						: pcKey;
		}
		return labels;
	}, [pcKeyboardOverlayVisible, whiteKeys, blackKeys, startNote]);

	const { handleKeyPointerDown } = useMiniKeyboardInteraction({
		visible: true,
		keyboardInputMode,
		polyMode,
		onNoteOn,
		onNoteOff,
		onPolyAftertouch,
		resizeActiveRef: null,
	});

	return (
		<MiniKeyboardShell>
			<div className="flex h-full min-h-0 w-full">
				<PerformanceWheels
					pitchBend={pitchBend}
					modWheel={modWheel}
					onPitchBend={onPitchBend}
					onModWheel={onModWheel}
				/>
				<MiniKeyboardKeybed
					whiteKeys={whiteKeys}
					blackKeys={blackKeys}
					blackKeyWidth={blackKeyWidth}
					activeNotes={activeSet}
					onKeyPointerDown={handleKeyPointerDown}
					pcKeyLabels={pcKeyLabels}
				/>
			</div>
		</MiniKeyboardShell>
	);
}
