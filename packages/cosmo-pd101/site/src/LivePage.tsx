import isMobile from "is-mobile";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import {
	type CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	computeRendererFrameLayout,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_DESIGN_WIDTH,
	SYNTH_RENDERER_MAX_ASPECT_RATIO,
} from "../../src/components/renderer/rendererFrameLayout";
import { SharedPhaseDistortionVisualizer } from "../../src/components/renderer/SynthRenderer";
import { PresetManagerProvider } from "../../src/context/PresetManagerContext";
import { createWebPresetManagerRepository } from "../../src/features/synth/createWebPresetManagerRepository";
import { useSynthStore } from "../../src/features/synth/synthStore";
import { useSynthPresetManager } from "../../src/features/synth/useSynthPresetManager";
import { FACTORY_PRESETS } from "../../src/lib/synth/factoryCzPresets";
import {
	loadCurrentPresetSession,
	loadCurrentState,
	saveCurrentPresetSession,
	saveCurrentState,
} from "../../src/lib/synth/presetStorage";
import { useWebSynthRuntime } from "./runtime/useWebSynthRuntime";
import WebPluginStoreNotice from "./WebPluginStoreNotice";

declare const __CZ_APP_VERSION__: string;

export default function LivePage() {
	const runtime = useWebSynthRuntime();
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const frameRef = useRef<HTMLDivElement | null>(null);
	const [frameLayout, setFrameLayout] = useState(() =>
		computeRendererFrameLayout({
			availableWidth: SYNTH_RENDERER_DESIGN_WIDTH,
			availableHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
			targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
		}),
	);
	const isMobileViewport =
		typeof window !== "undefined" ? isMobile({ tablet: true }) : false;

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
	const [visualViewportSize, setVisualViewportSize] = useState<{
		width: number;
		height: number;
	} | null>(null);

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
		const element = frameRef.current;
		if (!element) return;

		const updateFrameSize = () => {
			const bounds = element.getBoundingClientRect();

			const nextLayout = computeRendererFrameLayout({
				availableWidth: bounds.width,
				availableHeight: bounds.height,
				targetAspectRatio: SYNTH_RENDERER_MAX_ASPECT_RATIO,
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
	}, []);

	useEffect(() => {
		const viewport = window.visualViewport;
		if (!viewport) {
			return;
		}

		const updateVisualViewportSize = () => {
			setVisualViewportSize({
				width: viewport.width,
				height: viewport.height,
			});
		};

		updateVisualViewportSize();
		viewport.addEventListener("resize", updateVisualViewportSize);
		viewport.addEventListener("scroll", updateVisualViewportSize);
		window.addEventListener("orientationchange", updateVisualViewportSize);
		return () => {
			viewport.removeEventListener("resize", updateVisualViewportSize);
			viewport.removeEventListener("scroll", updateVisualViewportSize);
			window.removeEventListener("orientationchange", updateVisualViewportSize);
		};
	}, []);

	const frameScale = frameLayout?.frameScale ?? 1;
	const frameWidth = frameLayout?.frameWidth ?? SYNTH_RENDERER_DESIGN_WIDTH;
	const frameHeight = frameLayout?.frameHeight ?? SYNTH_RENDERER_DESIGN_HEIGHT;
	const scaledWidth = frameWidth * frameScale;
	const scaledHeight = frameHeight * frameScale;
	const viewportStyle: CSSProperties | undefined = visualViewportSize
		? {
				width: visualViewportSize.width,
				height: visualViewportSize.height,
			}
		: undefined;

	const presetRepository = useMemo(
		() =>
			createWebPresetManagerRepository({
				applyPreset,
				gatherPresetState,
				libraryPresets: FACTORY_PRESETS,
				onBeforeApplyPreset: runtime.panic,
			}),
		[applyPreset, gatherPresetState, runtime.panic],
	);
	const presetManager = useSynthPresetManager({
		repository: presetRepository,
	});
	const presetBootstrapDoneRef = useRef(false);

	useEffect(() => {
		void saveCurrentPresetSession({
			activePresetId: presetManager.activePresetId,
			activePresetNameBase: presetManager.activePresetNameBase,
			isDirty: presetManager.isPresetDirty,
		});
	}, [
		presetManager.activePresetId,
		presetManager.activePresetNameBase,
		presetManager.isPresetDirty,
	]);

	useEffect(() => {
		const init = async () => {
			if (presetBootstrapDoneRef.current) {
				return;
			}
			const saved = await loadCurrentState();
			const session = await loadCurrentPresetSession();
			if (saved) {
				useSynthStore.getState().applyPreset(saved);
			}
			if (
				session?.activePresetNameBase &&
				session.activePresetNameBase !== "Current State"
			) {
				presetBootstrapDoneRef.current = true;
				presetManager.syncExternalSelection({
					activePresetId: session.activePresetId,
					activePresetNameBase: session.activePresetNameBase,
					isDirty: session.isDirty,
				});
				return;
			}

			const firstPreset = FACTORY_PRESETS[0];
			if (!firstPreset) {
				presetBootstrapDoneRef.current = true;
				return;
			}
			if (
				!presetManager.allPresetEntries.some(
					(entry) => entry.id === firstPreset.id,
				)
			) {
				return;
			}
			presetBootstrapDoneRef.current = true;
			await presetManager.activatePreset({ entryId: firstPreset.id });
		};
		void init();
	}, [
		presetManager.activatePreset,
		presetManager.allPresetEntries,
		presetManager.syncExternalSelection,
	]);

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
			className={`relative flex h-dvh w-dvw items-center justify-center overflow-hidden ${isMobileViewport ? "" : "bg-black"}`}
			style={viewportStyle}
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
				className="relative shrink-0 overflow-hidden"
				style={{
					width: scaledWidth,
					height: scaledHeight,
				}}
			>
				<div
					className="absolute"
					style={{
						width: frameWidth,
						height: frameHeight,
						transform: `scale(${frameScale})`,
						transformOrigin: "center",
					}}
				>
					<PresetManagerProvider value={presetManager}>
						<SharedPhaseDistortionVisualizer
							runtime={runtime}
							appVersion={__CZ_APP_VERSION__}
							bottomBarExtra={<WebPluginStoreNotice />}
						/>
					</PresetManagerProvider>
				</div>
			</div>
			{!isMobileViewport && (
				<button
					type="button"
					onClick={toggleFullscreen}
					className="absolute right-4 bottom-4 z-50 flex h-9 w-9 items-center justify-center rounded-md bg-cz-panel/80 text-cz-cream-dim transition-colors hover:bg-cz-panel hover:text-cz-cream"
					aria-label={
						isSynthFullscreen ? "Exit fullscreen" : "Enter fullscreen"
					}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="h-4 w-4"
					>
						<title>
							{isSynthFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
						</title>
						<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
					</svg>
				</button>
			)}
		</div>
	);
}
