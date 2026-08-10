import { useRef } from "react";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import type { ModMatrixCellState } from "@/lib/synth/modMatrixModel";
import { getModDestinationStyle } from "@/lib/synth/modTargets";

const DRAG_PIXELS_FOR_FULL_SCALE = 84;
const DOUBLE_TAP_WINDOW_MS = 320;
const DOUBLE_TAP_DISTANCE = 22;

function clampAmount(amount: number): number {
	return Math.max(-1, Math.min(1, amount));
}

function formatAmount(amount: number): string {
	return `${amount >= 0 ? "+" : ""}${Math.round(amount * 100)}%`;
}

export default function ModMatrixAmountCell({
	route,
	cell,
	source,
	destination,
	selected,
	ariaLabel,
	clearHint,
	onActivate,
	onChange,
	onClear,
}: {
	route: ModRoute | undefined;
	cell: ModMatrixCellState | null;
	source: ModSource | null;
	destination: ModDestination | null;
	selected: boolean;
	ariaLabel: string;
	clearHint: string;
	onActivate: () => void;
	onChange: (amount: number) => void;
	onClear: () => void;
}) {
	const pointerRef = useRef<{
		pointerId: number;
		startY: number;
		startAmount: number;
		moved: boolean;
		lastTapAt: number;
		lastTapX: number;
		lastTapY: number;
	}>({
		pointerId: -1,
		startY: 0,
		startAmount: 0,
		moved: false,
		lastTapAt: 0,
		lastTapX: 0,
		lastTapY: 0,
	});

	const amount = cell?.amount ?? route?.amount ?? 0;
	const routeFillOpacity = 0.05 + Math.abs(amount) * 0.43;
	const hasValue = Boolean(cell || route);
	const isEnabled = cell?.enabled ?? route?.enabled ?? false;
	const hasAssignedPair = Boolean(source && destination);
	const destinationStyle = destination
		? getModDestinationStyle(destination)
		: undefined;
	const routeBorderClass =
		destinationStyle?.borderClass ?? "border-cz-border/45";
	const routeTextClass = destinationStyle?.textClass ?? "text-cz-cream";
	const isActiveRoute = hasValue && hasAssignedPair && isEnabled;
	const hasDestinationFill = Boolean(
		hasValue && destinationStyle && (isActiveRoute || !hasAssignedPair),
	);
	const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}
		if (event.currentTarget.setPointerCapture) {
			event.currentTarget.setPointerCapture(event.pointerId);
		}
		pointerRef.current = {
			pointerId: event.pointerId,
			startY: event.clientY,
			startAmount: amount,
			moved: false,
			lastTapAt: pointerRef.current.lastTapAt,
			lastTapX: pointerRef.current.lastTapX,
			lastTapY: pointerRef.current.lastTapY,
		};
		onActivate();
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
		const pointer = pointerRef.current;
		if (pointer.pointerId !== event.pointerId) {
			return;
		}
		const delta = pointer.startY - event.clientY;
		if (Math.abs(delta) > 3) {
			pointer.moved = true;
		}
		if (pointer.moved) {
			onChange(
				clampAmount(pointer.startAmount + delta / DRAG_PIXELS_FOR_FULL_SCALE),
			);
		}
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
		const pointer = pointerRef.current;
		if (pointer.pointerId !== event.pointerId) {
			return;
		}
		if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		if (!pointer.moved && event.pointerType === "touch") {
			const now = Date.now();
			const isDoubleTap =
				now - pointer.lastTapAt <= DOUBLE_TAP_WINDOW_MS &&
				Math.abs(event.clientX - pointer.lastTapX) <= DOUBLE_TAP_DISTANCE &&
				Math.abs(event.clientY - pointer.lastTapY) <= DOUBLE_TAP_DISTANCE;
			if (isDoubleTap) {
				onClear();
				pointer.lastTapAt = 0;
			} else {
				pointer.lastTapAt = now;
				pointer.lastTapX = event.clientX;
				pointer.lastTapY = event.clientY;
			}
		}
		pointer.pointerId = -1;
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		const step = event.shiftKey ? 0.1 : 0.01;
		if (event.key === "ArrowUp" || event.key === "ArrowRight") {
			event.preventDefault();
			onChange(clampAmount(amount + step));
		} else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
			event.preventDefault();
			onChange(clampAmount(amount - step));
		} else if (event.key === "Home") {
			event.preventDefault();
			onChange(-1);
		} else if (event.key === "End") {
			event.preventDefault();
			onChange(1);
		}
	};

	return (
		<button
			type="button"
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			onDoubleClick={onClear}
			onKeyDown={handleKeyDown}
			title={hasValue ? `${formatAmount(amount)} · ${clearHint}` : undefined}
			aria-label={ariaLabel}
			className={`group/cell relative flex aspect-square min-h-0 min-w-0 touch-none select-none items-center justify-center overflow-hidden rounded-[0.3rem] border p-1 font-mono text-[0.56rem] transition-colors ${
				selected
					? `${routeBorderClass} bg-cz-panel/80 text-cz-cream shadow-[0_0_0_1px_rgba(255,255,255,0.22)]`
					: isActiveRoute
						? `${routeBorderClass} bg-cz-panel/80 ${routeTextClass} hover:brightness-125`
						: hasDestinationFill
							? `${routeBorderClass} bg-cz-panel/80 ${routeTextClass} hover:brightness-125`
							: hasValue
								? "border-cz-border/55 bg-cz-border/20 text-cz-cream-dim/55"
								: `${routeBorderClass} bg-cz-panel/80 text-cz-cream-dim/30 hover:brightness-125`
			}`}
		>
			{hasDestinationFill ? (
				<span
					className={`mod-matrix-route-fill pointer-events-none absolute inset-0 ${destinationStyle?.fillColorClass ?? ""}`}
					data-mod-depth={Math.abs(amount)}
					style={{ opacity: routeFillOpacity }}
					aria-hidden="true"
				/>
			) : null}
			<span className="pointer-events-none relative z-10 whitespace-nowrap font-bold text-cz-cream">
				{hasValue ? formatAmount(amount) : "·"}
			</span>
		</button>
	);
}
