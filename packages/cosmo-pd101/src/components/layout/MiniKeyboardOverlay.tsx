import { AnimatePresence, motion } from "motion/react";
import {
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import Button from "@/components/controls/Button";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

type MiniKeyboardOverlayProps = {
	activeNotes: number[];
	visible: boolean;
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onAftertouch?: (value: number) => void;
};

type KeyConfig = {
	note: number;
	label: string;
	black: boolean;
	left?: number;
};

type KeyboardDimensions = {
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

const MIN_KEYBOARD_HEIGHT = 64;
const MAX_KEYBOARD_HEIGHT = 256;
const AFTERTOUCH_MAX_DRAG = 80;

const WHITE_KEY_CLASS_NAME =
	"relative flex h-full flex-1 flex-col justify-end rounded-b-xs border border-cz-border/75 bg-white shadow-sm transition-all";
const BLACK_KEY_CLASS_NAME =
	"absolute top-0 z-10 h-3/5 -translate-x-1/2 rounded-b-xs border border-cz-border/80 bg-cz-inset shadow-md transition-all";

function buildKeyboardLayout(
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

function getNoteVelocity(
	event: ReactPointerEvent<HTMLButtonElement> | PointerEvent,
): number {
	const target = event.target as HTMLElement;
	const keyElement = target.closest<HTMLElement>("[data-mini-note]");
	if (!keyElement) return 100;
	const rect = keyElement.getBoundingClientRect();
	const relativeY = (event.clientY - rect.top) / rect.height;
	return Math.max(1, Math.min(127, Math.round((1 - relativeY) * 127)));
}

function PianoKey({
	note,
	label,
	active,
	black,
	left,
	widthPercent,
	onPointerDown,
}: {
	note: number;
	label: string;
	active: boolean;
	black?: boolean;
	left?: number;
	widthPercent?: number;
	onPointerDown: (
		event: ReactPointerEvent<HTMLButtonElement>,
		note: number,
	) => void;
}) {
	const keyClassName = black ? BLACK_KEY_CLASS_NAME : WHITE_KEY_CLASS_NAME;
	const activeClassName = black
		? "!border-cz-light-blue !bg-cz-light-blue"
		: "translate-y-px !border-cz-light-blue !bg-cz-light-blue";

	const octave = Math.floor(note / 12) - 1;
	const noteName = `${label}${octave}`;

	return (
		<Button
			type="button"
			aria-label={`Play ${label}`}
			className={`${keyClassName} ${active ? activeClassName : ""} touch-none`}
			data-mini-note={note}
			style={
				black && left !== undefined
					? { left: `${left}%`, width: `${widthPercent}%` }
					: undefined
			}
			onPointerDown={(event) => onPointerDown(event, note)}
		>
			{!black && label === "C" ? (
				<span className="mb-1 text-center font-semibold text-[0.55rem] text-gray-400 leading-none">
					{noteName}
				</span>
			) : null}
		</Button>
	);
}

export default function MiniKeyboardOverlay({
	activeNotes,
	visible,
	onNoteOn,
	onNoteOff,
	onAftertouch,
}: MiniKeyboardOverlayProps) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const setKeyboardHeight = useSynthUiStore((s) => s.setKeyboardHeight);

	const startNote = 36 + keyboardRange * 12;

	const activePointersRef = useRef<Map<number, number>>(new Map());
	const aftertouchOriginsRef = useRef<Map<number, number>>(new Map());
	const resizeRef = useRef<{ startY: number; startHeight: number } | null>(
		null,
	);
	const activeSet = new Set(activeNotes);

	const blackKeyWidth = 50 / (keyboardOctaves * 7);

	const { whiteKeys, blackKeys } = useMemo(
		() => buildKeyboardLayout(startNote, keyboardOctaves),
		[startNote, keyboardOctaves],
	);

	const playNoteForPointer = useCallback(
		(pointerId: number, note: number, velocity = 100) => {
			const currentNote = activePointersRef.current.get(pointerId);
			if (currentNote === note) {
				return;
			}
			if (currentNote !== undefined) {
				onNoteOff(currentNote);
			}
			activePointersRef.current.set(pointerId, note);
			onNoteOn(note, velocity);
		},
		[onNoteOn, onNoteOff],
	);

	const releasePointer = useCallback(
		(pointerId: number) => {
			const note = activePointersRef.current.get(pointerId);
			if (note !== undefined) {
				onNoteOff(note);
				activePointersRef.current.delete(pointerId);
			}
			aftertouchOriginsRef.current.delete(pointerId);
		},
		[onNoteOff],
	);

	const releaseAllPointers = useCallback(() => {
		if (onAftertouch) {
			onAftertouch(0);
		}
		for (const note of activePointersRef.current.values()) {
			onNoteOff(note);
		}
		activePointersRef.current.clear();
		aftertouchOriginsRef.current.clear();
	}, [onNoteOff, onAftertouch]);

	const handleAftertouchMove = useCallback(
		(pointerId: number, currentY: number) => {
			const initialY = aftertouchOriginsRef.current.get(pointerId);
			if (initialY === undefined) return;
			const deltaY = initialY - currentY;
			const value = Math.max(0, Math.min(1, deltaY / AFTERTOUCH_MAX_DRAG));
			onAftertouch?.(value);
		},
		[onAftertouch],
	);

	const handleResizePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.preventDefault();
			(event.target as HTMLElement).setPointerCapture(event.pointerId);
			resizeRef.current = {
				startY: event.clientY,
				startHeight: keyboardHeight,
			};
		},
		[keyboardHeight],
	);

	useEffect(() => {
		const onWindowPointerMove = (event: PointerEvent) => {
			if (resizeRef.current) {
				const delta = event.clientY - resizeRef.current.startY;
				const newHeight = Math.round(
					Math.max(
						MIN_KEYBOARD_HEIGHT,
						Math.min(
							MAX_KEYBOARD_HEIGHT,
							resizeRef.current.startHeight - delta,
						),
					),
				);
				setKeyboardHeight(newHeight);
				return;
			}

			if (!activePointersRef.current.has(event.pointerId)) {
				return;
			}

			if (event.pointerType === "mouse" && event.buttons === 0) {
				releasePointer(event.pointerId);
				return;
			}

			const elementUnderPointer = document.elementFromPoint(
				event.clientX,
				event.clientY,
			) as HTMLElement | null;
			const keyElement =
				elementUnderPointer?.closest<HTMLElement>("[data-mini-note]");
			if (!keyElement) {
				return;
			}

			const noteAttribute = keyElement.dataset.miniNote;
			if (!noteAttribute) {
				return;
			}

			const parsedNote = Number(noteAttribute);
			if (Number.isNaN(parsedNote)) {
				return;
			}

			if (keyboardInputMode === "aftertouch") {
				const currentNote = activePointersRef.current.get(event.pointerId);
				if (currentNote === parsedNote) {
					handleAftertouchMove(event.pointerId, event.clientY);
					return;
				}
				aftertouchOriginsRef.current.set(event.pointerId, event.clientY);
				onAftertouch?.(0);
				playNoteForPointer(event.pointerId, parsedNote, 100);
				return;
			}

			playNoteForPointer(event.pointerId, parsedNote);
		};

		const onWindowPointerUp = (event: PointerEvent) => {
			if (resizeRef.current) {
				resizeRef.current = null;
				return;
			}

			if (keyboardInputMode === "aftertouch") {
				onAftertouch?.(0);
			}

			if (activePointersRef.current.has(event.pointerId)) {
				releasePointer(event.pointerId);
			}
		};

		const onWindowPointerCancel = (event: PointerEvent) => {
			resizeRef.current = null;
			if (keyboardInputMode === "aftertouch") {
				onAftertouch?.(0);
			}
			if (activePointersRef.current.has(event.pointerId)) {
				releasePointer(event.pointerId);
			}
		};

		window.addEventListener("pointermove", onWindowPointerMove);
		window.addEventListener("pointerup", onWindowPointerUp);
		window.addEventListener("pointercancel", onWindowPointerCancel);

		return () => {
			window.removeEventListener("pointermove", onWindowPointerMove);
			window.removeEventListener("pointerup", onWindowPointerUp);
			window.removeEventListener("pointercancel", onWindowPointerCancel);
		};
	}, [
		playNoteForPointer,
		releasePointer,
		handleAftertouchMove,
		keyboardInputMode,
		onAftertouch,
		setKeyboardHeight,
	]);

	useEffect(() => {
		if (!visible) {
			releaseAllPointers();
		}
	}, [releaseAllPointers, visible]);

	useEffect(() => () => releaseAllPointers(), [releaseAllPointers]);

	const handleKeyPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>, note: number) => {
			event.preventDefault();
			aftertouchOriginsRef.current.set(event.pointerId, event.clientY);
			if (keyboardInputMode === "velocity") {
				const velocity = getNoteVelocity(event);
				playNoteForPointer(event.pointerId, note, velocity);
			} else {
				playNoteForPointer(event.pointerId, note, 100);
			}
		},
		[playNoteForPointer, keyboardInputMode],
	);

	return (
		<AnimatePresence initial={false}>
			{visible ? (
				<motion.div
					key="mini-keyboard"
					initial={{ opacity: 0, y: 28 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 22 }}
					transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
					className="pointer-events-none absolute inset-x-0 bottom-8 z-20"
				>
					<div
						data-testid="mini-keyboard-overlay"
						className="pointer-events-auto w-full overflow-hidden rounded-t-2xl rounded-b-none border border-cz-border border-b-0 bg-cz-body px-0 pt-0 pb-1 shadow-xl backdrop-blur-sm"
					>
						<div
							className="flex h-4 cursor-row-resize items-center justify-center gap-1 hover:bg-cz-light-blue/10 active:bg-cz-light-blue/20"
							onPointerDown={handleResizePointerDown}
						>
							<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
							<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
							<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
							<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
						</div>
						<div className="relative overflow-hidden rounded-none border border-cz-border/70 border-x-0 border-b-0 bg-cz-inset px-2">
							<div
								className="relative flex gap-0.5 overflow-hidden rounded-md border border-cz-border/65 bg-cz-surface p-1"
								style={{ height: keyboardHeight }}
							>
								{whiteKeys.map((key) => (
									<PianoKey
										key={key.note}
										note={key.note}
										label={key.label}
										active={activeSet.has(key.note)}
										onPointerDown={handleKeyPointerDown}
									/>
								))}
								{blackKeys.map((key) => (
									<PianoKey
										key={key.note}
										note={key.note}
										label={key.label}
										black
										left={key.left}
										widthPercent={blackKeyWidth}
										active={activeSet.has(key.note)}
										onPointerDown={handleKeyPointerDown}
									/>
								))}
							</div>
						</div>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
