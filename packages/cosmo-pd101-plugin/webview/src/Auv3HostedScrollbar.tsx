import {
	type PointerEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

type Auv3HostedScrollbarProps = {
	viewportRef: RefObject<HTMLDivElement | null>;
};

type ScrollMetrics = {
	clientHeight: number;
	scrollHeight: number;
	scrollTop: number;
};

const EMPTY_METRICS: ScrollMetrics = {
	clientHeight: 0,
	scrollHeight: 0,
	scrollTop: 0,
};

export default function Auv3HostedScrollbar({
	viewportRef,
}: Auv3HostedScrollbarProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		pointerId: number;
		startClientY: number;
		startScrollTop: number;
	} | null>(null);
	const [metrics, setMetrics] = useState<ScrollMetrics>(EMPTY_METRICS);

	const updateMetrics = useCallback(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		setMetrics({
			clientHeight: viewport.clientHeight,
			scrollHeight: viewport.scrollHeight,
			scrollTop: viewport.scrollTop,
		});
	}, [viewportRef]);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		updateMetrics();
		viewport.addEventListener("scroll", updateMetrics, { passive: true });
		const resizeObserver = new ResizeObserver(updateMetrics);
		resizeObserver.observe(viewport);
		if (viewport.firstElementChild) {
			resizeObserver.observe(viewport.firstElementChild);
		}
		return () => {
			viewport.removeEventListener("scroll", updateMetrics);
			resizeObserver.disconnect();
		};
	}, [updateMetrics, viewportRef]);

	const maxScroll = Math.max(metrics.scrollHeight - metrics.clientHeight, 0);
	const thumbSizePercent =
		metrics.scrollHeight > 0
			? Math.max((metrics.clientHeight / metrics.scrollHeight) * 100, 8)
			: 100;
	const thumbTravelPercent = Math.max(100 - thumbSizePercent, 0);
	const thumbTopPercent =
		maxScroll > 0 ? (metrics.scrollTop / maxScroll) * thumbTravelPercent : 0;

	const scrollToTrackPosition = useCallback(
		(clientY: number) => {
			const viewport = viewportRef.current;
			const track = trackRef.current;
			if (!viewport || !track || maxScroll <= 0) return;
			const rect = track.getBoundingClientRect();
			const ratio = Math.min(
				Math.max((clientY - rect.top) / rect.height, 0),
				1,
			);
			viewport.scrollTop = ratio * maxScroll;
		},
		[maxScroll, viewportRef],
	);

	const handleThumbPointerDown = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			const viewport = viewportRef.current;
			if (!viewport) return;
			event.preventDefault();
			event.stopPropagation();
			event.currentTarget.setPointerCapture(event.pointerId);
			dragRef.current = {
				pointerId: event.pointerId,
				startClientY: event.clientY,
				startScrollTop: viewport.scrollTop,
			};
		},
		[viewportRef],
	);

	const handleThumbPointerMove = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			const viewport = viewportRef.current;
			const track = trackRef.current;
			const drag = dragRef.current;
			if (!viewport || !track || !drag || drag.pointerId !== event.pointerId) {
				return;
			}
			event.preventDefault();
			const movableTrackHeight =
				track.clientHeight * (1 - thumbSizePercent / 100);
			if (movableTrackHeight <= 0) return;
			const scrollDelta =
				((event.clientY - drag.startClientY) / movableTrackHeight) * maxScroll;
			viewport.scrollTop = drag.startScrollTop + scrollDelta;
		},
		[maxScroll, thumbSizePercent, viewportRef],
	);

	const handleThumbPointerEnd = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			if (dragRef.current?.pointerId !== event.pointerId) return;
			dragRef.current = null;
			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}
		},
		[],
	);

	if (maxScroll <= 1) return null;

	return (
		<div className="pointer-events-auto absolute inset-y-0 right-0 z-50 flex w-8 border-cz-border/60 border-l bg-cz-panel/85">
			<div
				ref={trackRef}
				className="relative h-full w-full touch-none bg-black/45 shadow-inner"
				onPointerDown={(event) => {
					if (event.target !== event.currentTarget) return;
					event.preventDefault();
					scrollToTrackPosition(event.clientY);
				}}
			>
				<div
					role="scrollbar"
					tabIndex={0}
					aria-label="Scroll synth editor"
					aria-controls="auv3-hosted-scroll-viewport"
					aria-orientation="vertical"
					aria-valuemin={0}
					aria-valuemax={Math.round(maxScroll)}
					aria-valuenow={Math.round(metrics.scrollTop)}
					data-auv3-gesture-control
					className="absolute inset-x-0 min-h-12 touch-none rounded-full border border-cz-light-blue/70 bg-cz-light-blue shadow-black/50 shadow-md"
					style={{
						height: `${thumbSizePercent}%`,
						top: `${thumbTopPercent}%`,
					}}
					onPointerDown={handleThumbPointerDown}
					onPointerMove={handleThumbPointerMove}
					onPointerUp={handleThumbPointerEnd}
					onPointerCancel={handleThumbPointerEnd}
					onKeyDown={(event) => {
						const viewport = viewportRef.current;
						if (!viewport) return;
						const step =
							event.key === "PageUp" || event.key === "PageDown"
								? viewport.clientHeight * 0.8
								: 48;
						if (event.key === "ArrowUp" || event.key === "PageUp") {
							event.preventDefault();
							viewport.scrollTop -= step;
						}
						if (event.key === "ArrowDown" || event.key === "PageDown") {
							event.preventDefault();
							viewport.scrollTop += step;
						}
					}}
				/>
			</div>
		</div>
	);
}
