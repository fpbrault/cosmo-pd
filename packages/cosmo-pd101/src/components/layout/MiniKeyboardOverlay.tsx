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
	onPolyAftertouch?: (note: number, value: number) => void;
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
	"absolute top-0 z-10 h-5/7 -translate-x-1/2 rounded-b-xs border border-cz-border/80 bg-cz-inset shadow-md transition-all";

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
	onPolyAftertouch,
}: MiniKeyboardOverlayProps) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const setKeyboardHeight = useSynthUiStore((s) => s.setKeyboardHeight);

	const startNote = 36 + keyboardRange * 12;

	const activePointersRef = useRef<Map<number, number>>(new Map());
	const aftertouchOriginsRef = useRef<Map<number, number>>(new Map());
	const aftertouchValuesRef = useRef<Map<number, number>>(new Map());
	const onPolyAftertouchRef = useRef(onPolyAftertouch);
	const activeReleasesRef = useRef<Set<number>>(new Set());
	const activeReleaseRafsRef = useRef<Map<number, number>>(new Map());

	const resizeRef = useRef<{ startY: number; startHeight: number } | null>(
		null,
	);
	const activeSet = new Set(activeNotes);

	onPolyAftertouchRef.current = onPolyAftertouch;

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
				const existingHandle = activeReleaseRafsRef.current.get(note);
				if (existingHandle !== undefined) {
					cancelAnimationFrame(existingHandle);
					activeReleaseRafsRef.current.delete(note);
				}
				activeReleasesRef.current.delete(pointerId);
				onPolyAftertouchRef.current?.(note, 0);
				onNoteOff(note);
				activePointersRef.current.delete(pointerId);
			}
			aftertouchOriginsRef.current.delete(pointerId);
		},
		[onNoteOff],
	);

	const releaseAllPointers = useCallback(() => {
		for (const handle of activeReleaseRafsRef.current.values()) {
			cancelAnimationFrame(handle);
		}
		activeReleaseRafsRef.current.clear();
		activeReleasesRef.current.clear();

		for (const [, note] of activePointersRef.current.entries()) {
			onPolyAftertouchRef.current?.(note, 0);
			onNoteOff(note);
		}
		activePointersRef.current.clear();
		aftertouchOriginsRef.current.clear();
	}, [onNoteOff]);

	const handleAftertouchMove = useCallback(
		(pointerId: number, currentY: number) => {
			const initialY = aftertouchOriginsRef.current.get(pointerId);
			if (initialY === undefined) return;
			const note = activePointersRef.current.get(pointerId);
			if (note === undefined) return;
			const deltaY = initialY - currentY;
			const value = Math.max(0, Math.min(1, deltaY / AFTERTOUCH_MAX_DRAG));
			aftertouchValuesRef.current.set(note, value);
			onPolyAftertouchRef.current?.(note, value);
		},
		[],
	);

	const smoothReleaseToZero = useCallback(
		(pointerId: number, note: number, fromValue: number) => {
			if (activeReleasesRef.current.has(pointerId)) return;
			const existingHandle = activeReleaseRafsRef.current.get(note);
			if (existingHandle !== undefined) {
				cancelAnimationFrame(existingHandle);
			}

			activeReleasesRef.current.add(pointerId);
			const startTime = performance.now();
			const DURATION = 100;

			const ramp = (now: number) => {
				const elapsed = now - startTime;
				const t = Math.min(elapsed / DURATION, 1);
				const value = fromValue * Math.max(0, 1 - t);
				onPolyAftertouchRef.current?.(note, value);
				aftertouchValuesRef.current.set(note, value);
				if (t < 1) {
					const handle = requestAnimationFrame(ramp);
					activeReleaseRafsRef.current.set(note, handle);
				} else {
					activeReleaseRafsRef.current.delete(note);
					activeReleasesRef.current.delete(pointerId);
					releasePointer(pointerId);
				}
			};

			const handle = requestAnimationFrame(ramp);
			activeReleaseRafsRef.current.set(note, handle);
		},
		[releasePointer],
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
				const mouseNote = activePointersRef.current.get(event.pointerId);
				if (mouseNote !== undefined && keyboardInputMode === "aftertouch") {
					const mouseValue = aftertouchValuesRef.current.get(mouseNote) ?? 0;
					smoothReleaseToZero(event.pointerId, mouseNote, mouseValue);
				} else {
					releasePointer(event.pointerId);
				}
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

			const note = activePointersRef.current.get(event.pointerId);
			if (note === undefined) return;

			if (keyboardInputMode === "aftertouch") {
				const currentValue = aftertouchValuesRef.current.get(note) ?? 0;
				smoothReleaseToZero(event.pointerId, note, currentValue);
			} else {
				onPolyAftertouchRef.current?.(note, 0);
				releasePointer(event.pointerId);
			}
		};

		const onWindowPointerCancel = (event: PointerEvent) => {
			resizeRef.current = null;
			const note = activePointersRef.current.get(event.pointerId);
			if (note === undefined) return;

			if (keyboardInputMode === "aftertouch") {
				const currentValue = aftertouchValuesRef.current.get(note) ?? 0;
				smoothReleaseToZero(event.pointerId, note, currentValue);
			} else {
				onPolyAftertouchRef.current?.(note, 0);
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
		smoothReleaseToZero,
		handleAftertouchMove,
		keyboardInputMode,
		setKeyboardHeight,
	]);

	useEffect(() => {
		if (!visible) {
			releaseAllPointers();
		}
	}, [releaseAllPointers, visible]);

	useEffect(
		() => () => {
			for (const handle of activeReleaseRafsRef.current.values()) {
				cancelAnimationFrame(handle);
			}
			activeReleaseRafsRef.current.clear();
			activeReleasesRef.current.clear();
			releaseAllPointers();
		},
		[releaseAllPointers],
	);

	const handleKeyPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>, note: number) => {
			event.preventDefault();
			const existingHandle = activeReleaseRafsRef.current.get(note);
			if (existingHandle !== undefined) {
				cancelAnimationFrame(existingHandle);
				activeReleaseRafsRef.current.delete(note);
			}
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
