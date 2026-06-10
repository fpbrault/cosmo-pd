import { memo, useCallback, useRef, useState } from "react";

type MiniKeyboardWheelsProps = {
	onPitchBendChange?: (value: number) => void;
	onModWheelChange?: (value: number) => void;
};

function getNormalizedY(clientY: number, el: HTMLElement): number {
	const rect = el.getBoundingClientRect();
	const y = (clientY - rect.top) / rect.height;
	return Math.max(0, Math.min(1, 1 - y));
}

function springToCenter(
	fromValue: number,
	onFrame: (v: number) => void,
	onDone: () => void,
): () => void {
	const duration = 120;
	const startTime = performance.now();
	let cancelled = false;
	const animate = (now: number) => {
		if (cancelled) return;
		const t = Math.min((now - startTime) / duration, 1);
		const eased = 1 - (1 - t) * (1 - t);
		const value = fromValue * (1 - eased);
		onFrame(value);
		if (t < 1) {
			requestAnimationFrame(animate);
		} else {
			onFrame(0);
			onDone();
		}
	};
	requestAnimationFrame(animate);
	return () => {
		cancelled = true;
	};
}

type WheelProps = {
	label: string;
	value: number;
	showCenterMarker?: boolean;
	onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
	onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
	onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
	onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

const WheelTrack = memo(function WheelTrack({
	label,
	value,
	showCenterMarker,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onPointerCancel,
}: WheelProps) {
	return (
		<div className="flex flex-col items-center" style={{ width: 30 }}>
			<span className="mb-0.5 select-none font-mono font-semibold text-[0.6rem] text-cz-cream-dim/80 leading-none">
				{label}
			</span>
			<div
				className="relative w-full flex-1 cursor-pointer rounded-sm border border-cz-border/60 bg-cz-inset active:bg-cz-mid"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
			>
				{showCenterMarker && (
					<div className="pointer-events-none absolute top-1/2 right-1 left-1 h-px -translate-y-1/2 bg-cz-cream-dim/30" />
				)}
				<div
					className="pointer-events-none absolute right-0 left-0 h-0.5 -translate-y-1/2 bg-cz-cream/80 shadow-sm transition-[top] duration-75"
					style={{ top: `${(1 - value) * 100}%` }}
				/>
			</div>
		</div>
	);
});

function MiniKeyboardWheels({
	onPitchBendChange,
	onModWheelChange,
}: MiniKeyboardWheelsProps) {
	const pitchValueRef = useRef(0);
	const modValueRef = useRef(0);
	const [pitchPos, setPitchPos] = useState(0.5);
	const [modPos, setModPos] = useState(0);
	const springCancelRef = useRef<(() => void) | null>(null);

	// Pitch handlers
	const handlePitchPointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			el.setPointerCapture(e.pointerId);
			if (springCancelRef.current) {
				springCancelRef.current();
				springCancelRef.current = null;
			}
			const y = getNormalizedY(e.clientY, el);
			const value = y * 2 - 1;
			pitchValueRef.current = value;
			setPitchPos(y);
			onPitchBendChange?.(value);
		},
		[onPitchBendChange],
	);

	const handlePitchPointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			if (!el.hasPointerCapture(e.pointerId)) return;
			const y = getNormalizedY(e.clientY, el);
			const value = y * 2 - 1;
			pitchValueRef.current = value;
			setPitchPos(y);
			onPitchBendChange?.(value);
		},
		[onPitchBendChange],
	);

	const handlePitchPointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
			const fromValue = pitchValueRef.current;
			if (Math.abs(fromValue) < 0.001) {
				setPitchPos(0.5);
				onPitchBendChange?.(0);
				return;
			}
			springCancelRef.current = springToCenter(
				fromValue,
				(v) => {
					pitchValueRef.current = v;
					setPitchPos((v + 1) / 2);
					onPitchBendChange?.(v);
				},
				() => {
					pitchValueRef.current = 0;
					setPitchPos(0.5);
					onPitchBendChange?.(0);
					springCancelRef.current = null;
				},
			);
		},
		[onPitchBendChange],
	);

	const handlePitchPointerCancel = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
			const fromValue = pitchValueRef.current;
			if (Math.abs(fromValue) < 0.001) {
				setPitchPos(0.5);
				onPitchBendChange?.(0);
				return;
			}
			springCancelRef.current = springToCenter(
				fromValue,
				(v) => {
					pitchValueRef.current = v;
					setPitchPos((v + 1) / 2);
					onPitchBendChange?.(v);
				},
				() => {
					pitchValueRef.current = 0;
					setPitchPos(0.5);
					onPitchBendChange?.(0);
					springCancelRef.current = null;
				},
			);
		},
		[onPitchBendChange],
	);

	// Mod handlers
	const handleModPointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			el.setPointerCapture(e.pointerId);
			const y = getNormalizedY(e.clientY, el);
			modValueRef.current = y;
			setModPos(y);
			onModWheelChange?.(y);
		},
		[onModWheelChange],
	);

	const handleModPointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			if (!el.hasPointerCapture(e.pointerId)) return;
			const y = getNormalizedY(e.clientY, el);
			modValueRef.current = y;
			setModPos(y);
			onModWheelChange?.(y);
		},
		[onModWheelChange],
	);

	const handleModPointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
		},
		[],
	);

	const handleModPointerCancel = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
		},
		[],
	);

	return (
		<div className="flex h-full items-stretch gap-1 py-1">
			<WheelTrack
				label="Pitch"
				value={pitchPos}
				showCenterMarker
				onPointerDown={handlePitchPointerDown}
				onPointerMove={handlePitchPointerMove}
				onPointerUp={handlePitchPointerUp}
				onPointerCancel={handlePitchPointerCancel}
			/>
			<WheelTrack
				label="Mod"
				value={modPos}
				onPointerDown={handleModPointerDown}
				onPointerMove={handleModPointerMove}
				onPointerUp={handleModPointerUp}
				onPointerCancel={handleModPointerCancel}
			/>
		</div>
	);
}

export default memo(MiniKeyboardWheels);
