import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";

const MIN_KEYBOARD_HEIGHT = 64;
const MAX_KEYBOARD_HEIGHT = 160;

export function useMiniKeyboardResize({
	keyboardHeight,
	setKeyboardHeight,
}: {
	keyboardHeight: number;
	setKeyboardHeight: (height: number) => void;
}) {
	const resizeRef = useRef<{ startY: number; startHeight: number } | null>(
		null,
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
			if (!resizeRef.current) return;
			const delta = event.clientY - resizeRef.current.startY;
			const nextHeight = Math.round(
				Math.max(
					MIN_KEYBOARD_HEIGHT,
					Math.min(MAX_KEYBOARD_HEIGHT, resizeRef.current.startHeight - delta),
				),
			);
			setKeyboardHeight(nextHeight);
		};

		const clearResize = () => {
			resizeRef.current = null;
		};

		window.addEventListener("pointermove", onWindowPointerMove);
		window.addEventListener("pointerup", clearResize);
		window.addEventListener("pointercancel", clearResize);

		return () => {
			window.removeEventListener("pointermove", onWindowPointerMove);
			window.removeEventListener("pointerup", clearResize);
			window.removeEventListener("pointercancel", clearResize);
		};
	}, [setKeyboardHeight]);

	return {
		resizeRef,
		handleResizePointerDown,
	};
}
