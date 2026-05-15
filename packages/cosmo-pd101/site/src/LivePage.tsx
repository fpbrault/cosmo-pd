import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SharedPhaseDistortionVisualizer } from "../../src/components/SharedPhaseDistortionVisualizer";

const SYNTH_RENDERER_MAX_WIDTH = 1152;
const SYNTH_RENDERER_MAX_HEIGHT = 864;
const VISUALIZER_FRAME_PADDING = 30;

export default function LivePage() {
	const frameRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [frameScale, setFrameScale] = useState(1);
	const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
		if (typeof window === "undefined") {
			return false;
		}
		return window.matchMedia("(max-width: 1000px)").matches;
	});

	const cursorTargetX = useMotionValue(50);
	const cursorTargetY = useMotionValue(50);
	const cursorX = useSpring(cursorTargetX, {
		stiffness: 74,
		damping: 24,
		mass: 0.7,
	});
	const cursorY = useSpring(cursorTargetY, {
		stiffness: 74,
		damping: 24,
		mass: 0.7,
	});
	const cursorXPercent = useTransform(cursorX, (value: number) => `${value}%`);
	const cursorYPercent = useTransform(cursorY, (value: number) => `${value}%`);
	const inverseCursorXPercent = useTransform(
		cursorX,
		(value: number) => `${100 - value}%`,
	);
	const inverseCursorYPercent = useTransform(
		cursorY,
		(value: number) => `${100 - value}%`,
	);

	const reactiveBackground = useMotionTemplate`radial-gradient(58rem 58rem at ${cursorXPercent} ${cursorYPercent}, rgba(141, 173, 248, 0.26) 0%, rgba(141, 173, 248, 0.16) 30%, rgba(141, 173, 248, 0) 74%), radial-gradient(48rem 48rem at ${inverseCursorXPercent} ${inverseCursorYPercent}, rgba(214, 204, 75, 0.22) 0%, rgba(214, 204, 75, 0.12) 32%, rgba(214, 204, 75, 0) 75%), radial-gradient(42rem 42rem at 50% 8%, rgba(102, 255, 130, 0.12) 0%, rgba(102, 255, 130, 0) 76%), radial-gradient(34rem 34rem at 50% ${inverseCursorYPercent}, rgba(255, 92, 214, 0.1) 0%, rgba(255, 92, 214, 0.06) 34%, rgba(255, 92, 214, 0) 78%)`;

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			const bounds = event.currentTarget.getBoundingClientRect();
			if (bounds.width <= 0 || bounds.height <= 0) {
				return;
			}
			const x = ((event.clientX - bounds.left) / bounds.width) * 100;
			const y = ((event.clientY - bounds.top) / bounds.height) * 100;
			cursorTargetX.set(Math.min(100, Math.max(0, x)));
			cursorTargetY.set(Math.min(100, Math.max(0, y)));
		},
		[cursorTargetX, cursorTargetY],
	);

	const handlePointerLeave = useCallback(() => {
		cursorTargetX.set(50);
		cursorTargetY.set(50);
	}, [cursorTargetX, cursorTargetY]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 1000px)");
		const updateViewportMode = (event: MediaQueryListEvent) => {
			setIsMobileViewport(event.matches);
		};
		setIsMobileViewport(mediaQuery.matches);
		mediaQuery.addEventListener("change", updateViewportMode);
		return () => {
			mediaQuery.removeEventListener("change", updateViewportMode);
		};
	}, []);

	const synthPanelRef = useRef<HTMLDivElement | null>(null);
	const [isSynthFullscreen, setIsSynthFullscreen] = useState(false);

	useEffect(() => {
		const element = isSynthFullscreen
			? synthPanelRef.current
			: frameRef.current;
		if (!element) return;

		const updateFrameSize = () => {
			const framePadding = isSynthFullscreen ? 0 : VISUALIZER_FRAME_PADDING;
			const bounds = element.getBoundingClientRect();
			const availableWidth = Math.max(bounds.width - framePadding * 2, 0);
			const availableHeight = Math.max(bounds.height - framePadding * 2, 0);
			if (availableWidth <= 0 || availableHeight <= 0) return;

			const nextScale = Math.min(
				availableWidth / SYNTH_RENDERER_MAX_WIDTH,
				availableHeight / SYNTH_RENDERER_MAX_HEIGHT,
				isSynthFullscreen ? Infinity : 1,
			);
			setFrameScale((current) => {
				if (Math.abs(current - nextScale) < 0.001) return current;
				return nextScale;
			});
		};

		updateFrameSize();
		const resizeObserver = new ResizeObserver(updateFrameSize);
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [isSynthFullscreen]);

	const scaledWidth = SYNTH_RENDERER_MAX_WIDTH * frameScale;
	const scaledHeight = SYNTH_RENDERER_MAX_HEIGHT * frameScale;

	const synthPanelInlineSize = isSynthFullscreen
		? {}
		: { width: scaledWidth, height: scaledHeight };

	const toggleFullscreen = useCallback(async () => {
		if (!document.fullscreenElement) {
			try {
				await synthPanelRef.current?.requestFullscreen();
			} catch {
				// Fullscreen may be denied or unavailable
			}
		} else {
			await document.exitFullscreen();
		}
	}, []);

	useEffect(() => {
		const onChange = () => {
			setIsSynthFullscreen(
				document.fullscreenElement === synthPanelRef.current,
			);
		};
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, []);

	return (
		<div
			ref={(node) => {
				frameRef.current = node;
				containerRef.current = node;
			}}
			className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
			onPointerMove={isMobileViewport ? undefined : handlePointerMove}
			onPointerLeave={isMobileViewport ? undefined : handlePointerLeave}
		>
			{!isMobileViewport && (
				<>
					<motion.div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
						style={{ background: reactiveBackground }}
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
					/>
				</>
			)}
			<div
				ref={synthPanelRef}
				id="synth-fullscreen-target"
				className={`relative shrink-0 ${isSynthFullscreen ? "flex items-center justify-center" : "overflow-visible"}`}
				style={synthPanelInlineSize}
			>
				<div
					className={isSynthFullscreen ? "" : "absolute top-0 left-0"}
					style={{
						width: SYNTH_RENDERER_MAX_WIDTH,
						height: SYNTH_RENDERER_MAX_HEIGHT,
						transform: `scale(${frameScale})`,
						transformOrigin: isSynthFullscreen ? "center center" : "top left",
					}}
				>
					<SharedPhaseDistortionVisualizer />
				</div>
			</div>
			<button
				type="button"
				onClick={toggleFullscreen}
				className="absolute right-4 bottom-4 z-50 flex h-9 w-9 items-center justify-center rounded-md bg-cz-panel/80 text-cz-cream-dim transition-colors hover:bg-cz-panel hover:text-cz-cream"
				aria-label="Toggle fullscreen"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="h-4 w-4"
				>
					<title>Toggle fullscreen</title>
					<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
				</svg>
			</button>
		</div>
	);
}
