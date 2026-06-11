import {
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

const PITCH_RETURN_DURATION_MS = 100;
const KEYBOARD_STEP = 0.05;

type PerformanceWheelProps = {
	label: string;
	value: number;
	min: number;
	max: number;
	centered?: boolean;
	onChange: (value: number) => void;
	onRelease?: () => void;
	onInteractionChange?: (active: boolean) => void;
};

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function PerformanceWheel({
	label,
	value,
	min,
	max,
	centered = false,
	onChange,
	onRelease,
	onInteractionChange,
}: PerformanceWheelProps) {
	const activePointerRef = useRef<number | null>(null);
	const wheelRef = useRef<HTMLDivElement | null>(null);

	const updateFromClientY = useCallback(
		(clientY: number) => {
			const bounds = wheelRef.current?.getBoundingClientRect();
			if (!bounds || bounds.height <= 0) return;
			const ratio = clamp((bounds.bottom - clientY) / bounds.height, 0, 1);
			onChange(min + ratio * (max - min));
		},
		[max, min, onChange],
	);

	const finishPointer = useCallback(
		(pointerId: number) => {
			if (activePointerRef.current !== pointerId) return;
			activePointerRef.current = null;
			onInteractionChange?.(false);
			const wheel = wheelRef.current;
			if (wheel?.hasPointerCapture(pointerId)) {
				wheel.releasePointerCapture(pointerId);
			}
			onRelease?.();
		},
		[onInteractionChange, onRelease],
	);

	useEffect(() => {
		const onPointerMove = (event: globalThis.PointerEvent) => {
			if (activePointerRef.current !== event.pointerId) return;
			updateFromClientY(event.clientY);
		};
		const onPointerEnd = (event: globalThis.PointerEvent) => {
			finishPointer(event.pointerId);
		};
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerEnd);
		window.addEventListener("pointercancel", onPointerEnd);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerEnd);
			window.removeEventListener("pointercancel", onPointerEnd);
		};
	}, [finishPointer, updateFromClientY]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			let nextValue: number | null = null;
			if (event.key === "ArrowUp" || event.key === "ArrowRight") {
				nextValue = value + (max - min) * KEYBOARD_STEP;
			} else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
				nextValue = value - (max - min) * KEYBOARD_STEP;
			} else if (event.key === "Home") {
				nextValue = min;
			} else if (event.key === "End") {
				nextValue = max;
			}
			if (nextValue === null) return;
			event.preventDefault();
			onChange(clamp(nextValue, min, max));
		},
		[max, min, onChange, value],
	);

	const position = ((value - min) / (max - min)) * 100;

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center gap-1">
			<span className="font-medium text-[0.65rem] text-cz-cream-dim leading-none">
				{label}
			</span>
			<div
				ref={wheelRef}
				aria-label={`${label} wheel`}
				aria-orientation="vertical"
				aria-valuemax={max}
				aria-valuemin={min}
				aria-valuenow={value}
				className="relative min-h-0 w-full flex-1 touch-none overflow-hidden rounded-md border border-black/70 bg-black/80 shadow-inner outline-none ring-cz-light-blue focus-visible:ring-2"
				data-performance-wheel={label.toLowerCase()}
				onKeyDown={handleKeyDown}
				onKeyUp={(event) => {
					if (
						centered &&
						(event.key.startsWith("Arrow") ||
							event.key === "Home" ||
							event.key === "End")
					) {
						onRelease?.();
					}
				}}
				onPointerDown={(event) => {
					event.preventDefault();
					activePointerRef.current = event.pointerId;
					onInteractionChange?.(true);
					event.currentTarget.setPointerCapture(event.pointerId);
					updateFromClientY(event.clientY);
				}}
				role="slider"
				tabIndex={0}
			>
				{centered ? (
					<div className="pointer-events-none absolute top-1/2 right-1 left-1 h-px bg-cz-border/80" />
				) : null}
				<div
					className="pointer-events-none absolute right-1 left-1 h-0.5 -translate-y-1/2 rounded-full bg-cz-light-blue shadow-[0_0_5px_rgba(54,170,255,0.9)]"
					style={{ bottom: `${position}%` }}
				/>
			</div>
		</div>
	);
}

type PerformanceWheelsProps = {
	pitchBend: number;
	modWheel: number;
	onPitchBend: (value: number) => void;
	onModWheel: (value: number) => void;
};

const PerformanceWheels = memo(function PerformanceWheels({
	pitchBend,
	modWheel,
	onPitchBend,
	onModWheel,
}: PerformanceWheelsProps) {
	const [localPitchBend, setLocalPitchBend] = useState(pitchBend);
	const [localModWheel, setLocalModWheel] = useState(modWheel);
	const pitchInteractingRef = useRef(false);
	const modInteractingRef = useRef(false);
	const pitchBendRef = useRef(pitchBend);
	const releaseFrameRef = useRef<number | null>(null);

	const cancelPitchReturn = useCallback(() => {
		if (releaseFrameRef.current !== null) {
			cancelAnimationFrame(releaseFrameRef.current);
			releaseFrameRef.current = null;
		}
	}, []);

	const setPitch = useCallback(
		(value: number) => {
			cancelPitchReturn();
			const clamped = clamp(value, -1, 1);
			pitchBendRef.current = clamped;
			setLocalPitchBend(clamped);
			onPitchBend(clamped);
		},
		[cancelPitchReturn, onPitchBend],
	);

	const releasePitch = useCallback(() => {
		cancelPitchReturn();
		const startValue = pitchBendRef.current;
		const startTime = performance.now();

		const ramp = (now: number) => {
			const progress = Math.min(
				(now - startTime) / PITCH_RETURN_DURATION_MS,
				1,
			);
			const nextValue = startValue * (1 - progress);
			pitchBendRef.current = nextValue;
			setLocalPitchBend(nextValue);
			onPitchBend(nextValue);
			if (progress < 1) {
				releaseFrameRef.current = requestAnimationFrame(ramp);
			} else {
				releaseFrameRef.current = null;
			}
		};
		releaseFrameRef.current = requestAnimationFrame(ramp);
	}, [cancelPitchReturn, onPitchBend]);

	useEffect(() => {
		if (releaseFrameRef.current !== null || pitchInteractingRef.current) return;
		const clamped = clamp(pitchBend, -1, 1);
		pitchBendRef.current = clamped;
		setLocalPitchBend(clamped);
	}, [pitchBend]);

	useEffect(() => {
		if (modInteractingRef.current) return;
		setLocalModWheel(clamp(modWheel, 0, 1));
	}, [modWheel]);

	useEffect(() => cancelPitchReturn, [cancelPitchReturn]);

	return (
		<div className="flex h-full w-24 shrink-0 gap-2 border-cz-border/70 border-r bg-cz-body px-2 py-1.5">
			<PerformanceWheel
				label="Pitch"
				value={localPitchBend}
				min={-1}
				max={1}
				centered
				onChange={setPitch}
				onRelease={releasePitch}
				onInteractionChange={(active) => {
					pitchInteractingRef.current = active;
				}}
			/>
			<PerformanceWheel
				label="Mod"
				value={localModWheel}
				min={0}
				max={1}
				onChange={(value) => {
					const clamped = clamp(value, 0, 1);
					setLocalModWheel(clamped);
					onModWheel(clamped);
				}}
				onInteractionChange={(active) => {
					modInteractingRef.current = active;
				}}
			/>
		</div>
	);
});

export default PerformanceWheels;
