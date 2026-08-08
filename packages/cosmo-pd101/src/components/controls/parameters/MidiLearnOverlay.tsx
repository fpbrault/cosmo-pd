import type { ReactNode } from "react";

type MidiLearnVisualState = "available" | "mapped" | "targeted" | null;

interface MidiLearnOverlayProps {
	midiLearnState: MidiLearnVisualState;
	children: ReactNode;
	className?: string;
	wrapperClassName?: string;
}

const MIDI_LEARN_BORDER_MAPPED = "rgba(192, 132, 252, 0.8)";
const MIDI_LEARN_BORDER_AVAILABLE = "rgba(56, 221, 255, 0.8)";
const MIDI_LEARN_BG_MAPPED = "rgba(192, 132, 252, 0.06)";
const MIDI_LEARN_BG_AVAILABLE = "rgba(56, 221, 255, 0.06)";
const MIDI_LEARN_SHADOW_MAPPED = "rgba(192, 132, 252, 0.12)";
const MIDI_LEARN_SHADOW_AVAILABLE = "rgba(56, 221, 255, 0.12)";

export function getMidiLearnOverlayStyle(
	midiLearnState: "available" | "mapped" | "targeted",
) {
	const isMapped = midiLearnState === "mapped";
	return {
		border: `2px solid ${isMapped ? MIDI_LEARN_BORDER_MAPPED : MIDI_LEARN_BORDER_AVAILABLE}`,
		backgroundColor: isMapped ? MIDI_LEARN_BG_MAPPED : MIDI_LEARN_BG_AVAILABLE,
		boxShadow: `inset 0 0 6px ${isMapped ? MIDI_LEARN_SHADOW_MAPPED : MIDI_LEARN_SHADOW_AVAILABLE}`,
	};
}

export default function MidiLearnOverlay({
	midiLearnState,
	children,
	className = "",
	wrapperClassName = "",
}: MidiLearnOverlayProps) {
	if (!midiLearnState) {
		return <>{children}</>;
	}

	return (
		<div className={`relative ${wrapperClassName}`}>
			{children}
			<div
				className={`pointer-events-none absolute inset-0 z-10 ${className}`}
				style={getMidiLearnOverlayStyle(midiLearnState)}
			/>
		</div>
	);
}
