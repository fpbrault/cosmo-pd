import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { getNoteVelocity } from "./miniKeyboardLayout";

const AFTERTOUCH_MAX_DRAG = 80;

type UseMiniKeyboardInteractionOptions = {
	visible: boolean;
	keyboardInputMode: "velocity" | "aftertouch";
	polyMode: "poly8" | "mono";
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPolyAftertouch?: (note: number, value: number) => void;
	resizeActiveRef: React.RefObject<{
		startY: number;
		startHeight: number;
	} | null> | null;
};

export function useMiniKeyboardInteraction({
	visible,
	keyboardInputMode,
	polyMode,
	onNoteOn,
	onNoteOff,
	onPolyAftertouch,
	resizeActiveRef,
}: UseMiniKeyboardInteractionOptions) {
	const activePointersRef = useRef<Map<number, number>>(new Map());
	const aftertouchOriginsRef = useRef<Map<number, number>>(new Map());
	const aftertouchValuesRef = useRef<Map<number, number>>(new Map());
	const onPolyAftertouchRef = useRef(onPolyAftertouch);
	const activeReleasesRef = useRef<Set<number>>(new Set());
	const activeReleaseRafsRef = useRef<Map<number, number>>(new Map());

	onPolyAftertouchRef.current = onPolyAftertouch;

	const playNoteForPointer = useCallback(
		(pointerId: number, note: number, velocity = 100) => {
			const currentNote = activePointersRef.current.get(pointerId);
			if (currentNote === note) {
				return;
			}
			activePointersRef.current.set(pointerId, note);
			if (currentNote !== undefined && polyMode !== "mono") {
				onNoteOff(currentNote);
			}
			onNoteOn(note, velocity);
			if (currentNote !== undefined && polyMode === "mono") {
				onNoteOff(currentNote);
			}
		},
		[onNoteOn, onNoteOff, polyMode],
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
			const duration = 100;

			const ramp = (now: number) => {
				const elapsed = now - startTime;
				const t = Math.min(elapsed / duration, 1);
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

	useEffect(() => {
		const onWindowPointerMove = (event: PointerEvent) => {
			if (resizeActiveRef?.current) {
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
			if (resizeActiveRef?.current) {
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
		handleAftertouchMove,
		keyboardInputMode,
		playNoteForPointer,
		releasePointer,
		resizeActiveRef,
		smoothReleaseToZero,
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
				playNoteForPointer(event.pointerId, note, getNoteVelocity(event));
			} else {
				playNoteForPointer(event.pointerId, note, 100);
			}
		},
		[keyboardInputMode, playNoteForPointer],
	);

	return {
		handleKeyPointerDown,
		releaseAllPointers,
	};
}
