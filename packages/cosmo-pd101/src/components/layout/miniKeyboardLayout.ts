import type { PointerEvent as ReactPointerEvent } from "react";

export type KeyConfig = {
	note: number;
	label: string;
	black: boolean;
	left?: number;
};

export type KeyboardDimensions = {
	whiteKeys: KeyConfig[];
	blackKeys: KeyConfig[];
};

const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11] as const;
const WHITE_LABELS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const BLACK_CONFIG = [
	{ offset: 1, label: "C#", boundary: 1 },
	{ offset: 3, label: "D#", boundary: 2 },
	{ offset: 6, label: "F#", boundary: 4 },
	{ offset: 8, label: "G#", boundary: 5 },
	{ offset: 10, label: "A#", boundary: 6 },
] as const;

export function buildKeyboardLayout(
	startNote: number,
	octaves: number,
): KeyboardDimensions {
	const whiteKeys: KeyConfig[] = [];
	const blackKeys: KeyConfig[] = [];
	const totalWhiteKeys = octaves * WHITE_OFFSETS.length;

	for (let octave = 0; octave < octaves; octave += 1) {
		const octaveBaseNote = startNote + octave * 12;
		const whiteBaseIndex = octave * WHITE_OFFSETS.length;

		for (let i = 0; i < WHITE_OFFSETS.length; i += 1) {
			whiteKeys.push({
				note: octaveBaseNote + WHITE_OFFSETS[i],
				label: WHITE_LABELS[i],
				black: false,
			});
		}

		for (const blackKey of BLACK_CONFIG) {
			const boundary = whiteBaseIndex + blackKey.boundary;
			blackKeys.push({
				note: octaveBaseNote + blackKey.offset,
				label: blackKey.label,
				black: true,
				left: (boundary / totalWhiteKeys) * 100,
			});
		}
	}

	return { whiteKeys, blackKeys };
}

export function getBlackKeyWidthPercent(keyboardOctaves: number) {
	return 50 / (keyboardOctaves * 7);
}

export function getNoteVelocity(
	event: ReactPointerEvent<HTMLButtonElement> | PointerEvent,
): number {
	const target = event.target as HTMLElement;
	const keyElement = target.closest<HTMLElement>("[data-mini-note]");
	if (!keyElement) return 100;
	const rect = keyElement.getBoundingClientRect();
	const relativeY = (event.clientY - rect.top) / rect.height;
	return Math.max(1, Math.min(127, Math.round((1 - relativeY) * 127)));
}
