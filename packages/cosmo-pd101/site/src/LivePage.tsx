import isMobile from "is-mobile";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import UpdateNotification from "../../src/components/layout/UpdateNotification";
import {
	computeRendererFrameLayout,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_DESIGN_WIDTH,
	SYNTH_RENDERER_MAX_ASPECT_RATIO,
} from "../../src/components/renderer/rendererFrameLayout";
import { SharedPhaseDistortionVisualizer } from "../../src/components/renderer/SynthRenderer";
import { useSynthStore } from "../../src/features/synth/synthStore";
import { FACTORY_CZ_PRESETS } from "../../src/lib/synth/factoryCzPresets";
import {
	loadCurrentPresetSession,
	loadCurrentState,
	saveCurrentPresetSession,
	saveCurrentState,
} from "../../src/lib/synth/presetStorage";
import { useWebSynthRuntime } from "./runtime/useWebSynthRuntime";

declare const __CZ_APP_VERSION__: string;

const FRAME_PADDING = 30;
const WEB_MAX_SCALE = 0.85;

export default function LivePage() {
	const runtime = useWebSynthRuntime();
	const frameRef = useRef<HTMLDivElement | null>(null);
	const [frameLayout, setFrameLayout] = useState(() =>
		computeRendererFrameLayout({
			availableWidth: SYNTH_RENDERER_DESIGN_WIDTH,
			availableHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
			targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
			maxScale: WEB_MAX_SCALE,
		}),
	);
	const isMobileViewport = typeof window !== "undefined" ? isMobile() : false;

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

	const synthPanelRef = useRef<HTMLDivElement | null>(null);
	const [isSynthFullscreen, setIsSynthFullscreen] = useState(false);

	useEffect(() => {
		const element = isSynthFullscreen
			? synthPanelRef.current
			: frameRef.current;
		if (!element) return;

		const updateFrameSize = () => {
			const bounds = element.getBoundingClientRect();

			const nextLayout = computeRendererFrameLayout({
				availableWidth: bounds.width,
				availableHeight: bounds.height,
				targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
				outerPadding: isSynthFullscreen || isMobileViewport ? 0 : FRAME_PADDING,
				maxScale:
					isSynthFullscreen || isMobileViewport ? undefined : WEB_MAX_SCALE,
			});

			if (!nextLayout) {
				return;
			}

			setFrameLayout((current) => {
				if (
					current &&
					Math.abs(current.frameWidth - nextLayout.frameWidth) < 0.5 &&
					Math.abs(current.frameHeight - nextLayout.frameHeight) < 0.5 &&
					Math.abs(current.frameScale - nextLayout.frameScale) < 0.001
				) {
					return current;
				}
				return nextLayout;
			});
		};

		updateFrameSize();
		const resizeObserver = new ResizeObserver(updateFrameSize);
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [isSynthFullscreen, isMobileViewport]);

	const frameScale = frameLayout?.frameScale ?? 1;
	const frameWidth = frameLayout?.frameWidth ?? SYNTH_RENDERER_DESIGN_WIDTH;
	const frameHeight = frameLayout?.frameHeight ?? SYNTH_RENDERER_DESIGN_HEIGHT;
	const sidebarMinWidthRem = frameLayout?.sidebarMinWidthRem ?? 21;
	const scaledWidth = frameWidth * frameScale;
	const scaledHeight = frameHeight * frameScale;

	const synthPanelInlineSize = isSynthFullscreen
		? {}
		: { width: scaledWidth, height: scaledHeight };

	const syncPresetSelectionRef = useRef<(name: string) => void>();

	const handlePresetSessionChange = useCallback(
		(session: { activePresetNameBase: string }) => {
			if (session.activePresetNameBase === "Current State") return;
			void saveCurrentPresetSession({
				activePresetId: null,
				activePresetNameBase: session.activePresetNameBase,
				loadedPresetFingerprint: null,
			});
		},
		[],
	);

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

	useEffect(() => {
		const init = async () => {
			const saved = await loadCurrentState();
			const session = await loadCurrentPresetSession();
			if (saved) {
				useSynthStore.getState().applyPreset(saved);
			}
			if (
				session?.activePresetNameBase &&
				session.activePresetNameBase !== "Current State"
			) {
				syncPresetSelectionRef.current?.(session.activePresetNameBase);
			} else {
				const firstPreset = FACTORY_CZ_PRESETS[0];
				if (firstPreset) {
					useSynthStore.getState().applyPreset(firstPreset.data);
					syncPresetSelectionRef.current?.(firstPreset.name);
				}
			}
		};
		init();
	}, []);

	useEffect(() => {
		const handleBeforeUnload = () => {
			const state = useSynthStore.getState().gatherState();
			void saveCurrentState(state);
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);

	return (
		<div
			ref={(node) => {
				frameRef.current = node;
			}}
			className={`relative flex h-full w-full items-center justify-center overflow-hidden ${isMobileViewport ? "" : "bg-black"}`}
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
					className={isSynthFullscreen ? "absolute" : "absolute top-0 left-0"}
					style={{
						width: frameWidth,
						height: frameHeight,
						transform: `scale(${frameScale})`,
						transformOrigin: isSynthFullscreen ? "center" : "top left",
					}}
				>
					<SharedPhaseDistortionVisualizer
						runtime={runtime}
						sidebarMinWidthRem={sidebarMinWidthRem}
						bottomBarExtra={
							<UpdateNotification currentVersion={__CZ_APP_VERSION__} />
						}
						onInitPresetSession={(fn) => {
							syncPresetSelectionRef.current = fn;
						}}
						onPresetSessionChange={handlePresetSessionChange}
					/>
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
