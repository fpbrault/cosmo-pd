import {
	computeRendererFrameLayout,
	type PresetManagerController,
	PresetManagerProvider,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
	SynthRenderer,
	useSynthPresetManager,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPluginPresetManagerRepository } from "./hooks/createPluginPresetManagerRepository";
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";
import { usePluginSynthRuntime } from "./hooks/usePluginSynthRuntime";

type PluginPageProps = {
	appVersion: string;
	utilityExtra?: ReactNode;
};

const MIN_PLUGIN_KEYBOARD_HEIGHT = 64;
const MAX_PLUGIN_KEYBOARD_HEIGHT = 160;
const MAX_KEYBOARD_VIEWPORT_RATIO = 0.28;

export function clampPluginKeyboardHeight({
	keyboardHeight,
	viewportHeight,
	frameScale,
}: {
	keyboardHeight: number;
	viewportHeight: number;
	frameScale: number;
}) {
	const scaledViewportMax =
		frameScale > 0
			? Math.floor((viewportHeight * MAX_KEYBOARD_VIEWPORT_RATIO) / frameScale)
			: MAX_PLUGIN_KEYBOARD_HEIGHT;
	const maxHeight = Math.max(
		MIN_PLUGIN_KEYBOARD_HEIGHT,
		Math.min(MAX_PLUGIN_KEYBOARD_HEIGHT, scaledViewportMax),
	);
	return Math.round(
		Math.max(MIN_PLUGIN_KEYBOARD_HEIGHT, Math.min(maxHeight, keyboardHeight)),
	);
}

export default function PluginPage({
	appVersion,
	utilityExtra,
}: PluginPageProps) {
	const isIosHost = window.__czHostPlatform === "ios";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const setKeyboardHeight = useSynthUiStore((s) => s.setKeyboardHeight);

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [rendererFrame, setRendererFrame] = useState(() =>
		computeRendererFrameLayout({
			availableWidth:
				SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO,
			availableHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
			targetAspectRatio: SYNTH_RENDERER_MIN_ASPECT_RATIO,
		}),
	);
	const sendNativeEngineEvent = useCallback(
		(type: string, payload: Record<string, unknown>) => {
			window.ipc?.postMessage(
				JSON.stringify({ id: 0, method: type, args: [payload] }),
			);
		},
		[],
	);
	const runtime = usePluginSynthRuntime({ eventSink: sendNativeEngineEvent });
	const presetManagerRef = useRef<PresetManagerController | null>(null);
	const {
		bridgeReady,
		getPresetSession,
		setPresetSession: persistPresetSession,
	} = usePluginParamBridge({
		onExternalParamChange: () => {
			presetManagerRef.current?.recomputeDirtyState();
		},
	});
	const presetRepository = useMemo(
		() =>
			createPluginPresetManagerRepository({
				gatherPresetState,
			}),
		[gatherPresetState],
	);
	const presetManager = useSynthPresetManager({
		repository: presetRepository,
	});
	const restoreDoneRef = useRef(false);

	useEffect(() => {
		presetManagerRef.current = presetManager;
	}, [presetManager]);

	useEffect(() => {
		const element = frameRef.current;
		if (!element) {
			return;
		}

		const updateFrameSize = () => {
			const bounds = element.getBoundingClientRect();
			if (bounds.width <= 0 || bounds.height <= 0) {
				return;
			}

			const targetAspectRatio =
				isIosHost || isLikelyIosDevice
					? undefined
					: SYNTH_RENDERER_MIN_ASPECT_RATIO;
			const nextLayout = computeRendererFrameLayout({
				availableWidth: bounds.width,
				availableHeight: bounds.height,
				targetAspectRatio,
			});
			if (!nextLayout) {
				return;
			}

			const clampedKeyboardHeight = clampPluginKeyboardHeight({
				keyboardHeight,
				viewportHeight: bounds.height,
				frameScale: nextLayout.frameScale,
			});
			if (clampedKeyboardHeight !== keyboardHeight) {
				setKeyboardHeight(clampedKeyboardHeight);
			}

			setRendererFrame((current) => {
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
		window.addEventListener("resize", updateFrameSize);

		const resizeObserver = new ResizeObserver(updateFrameSize);
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateFrameSize);
		};
	}, [isIosHost, isLikelyIosDevice, keyboardHeight, setKeyboardHeight]);

	useEffect(() => {
		if (!bridgeReady) {
			return;
		}
		void presetManager.reloadLibrary();
	}, [bridgeReady, presetManager.reloadLibrary]);

	useEffect(() => {
		window.__czOnHostPresetSelected = (name: string) => {
			window.__czSetPresetName?.(name);
			const matchingEntry =
				presetManager.allPresetEntries.find((entry) => entry.label === name) ??
				null;
			presetManager.syncExternalSelection(
				{
					activePresetId: matchingEntry?.id ?? null,
					activePresetNameBase: name,
					isDirty: false,
				},
				{ stateSync: "deferred" },
			);
		};
		return () => {
			window.__czOnHostPresetSelected = undefined;
		};
	}, [presetManager.allPresetEntries, presetManager.syncExternalSelection]);

	useEffect(() => {
		const restore = async () => {
			const session = await getPresetSession();
			if (restoreDoneRef.current) {
				return;
			}
			if (!session?.activePresetNameBase) {
				return;
			}

			restoreDoneRef.current = true;
			presetManager.syncExternalSelection(
				{
					activePresetId: session.activePresetId,
					activePresetNameBase: session.activePresetNameBase,
					isDirty: session.isDirty,
				},
				{
					stateSync: session.isDirty ? "immediate" : "deferred",
				},
			);
			await persistPresetSession(session);
		};
		void restore();
	}, [
		getPresetSession,
		persistPresetSession,
		presetManager.syncExternalSelection,
	]);

	useEffect(() => {
		void persistPresetSession({
			activePresetId: presetManager.activePresetId,
			activePresetNameBase: presetManager.activePresetNameBase,
			isDirty: presetManager.isPresetDirty,
		});
	}, [
		persistPresetSession,
		presetManager.activePresetId,
		presetManager.activePresetNameBase,
		presetManager.isPresetDirty,
	]);

	const combinedScale = rendererFrame?.frameScale ?? 1;
	const frameWidth =
		rendererFrame?.frameWidth ??
		SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO;
	const frameHeight =
		rendererFrame?.frameHeight ?? SYNTH_RENDERER_DESIGN_HEIGHT;
	const sidebarMinWidthRem = rendererFrame?.sidebarMinWidthRem ?? 18;
	const scaledWidth = frameWidth * combinedScale;
	const scaledHeight = frameHeight * combinedScale;

	const zoomStyle: CSSProperties = {
		width: frameWidth,
		height: frameHeight,
		transform: `scale(${combinedScale})`,
		transformOrigin: "top left",
	};

	return (
		<div
			ref={frameRef}
			className="relative flex h-full w-full items-center justify-center overflow-hidden bg-cz-panel"
		>
			<div
				className="relative shrink-0 overflow-hidden"
				style={{
					width: scaledWidth,
					height: scaledHeight,
				}}
			>
				<div className="absolute top-0 left-0" style={zoomStyle}>
					<PresetManagerProvider value={presetManager}>
						<SynthRenderer
							runtime={runtime}
							appVersion={appVersion}
							bottomBarExtra={utilityExtra}
							disableAudioGate
							sidebarMinWidthRem={sidebarMinWidthRem}
							miniKeyboard={{
								activeNotes: runtime.activeNotes,
								onNoteOn: runtime.sendNoteOn,
								onNoteOff: runtime.sendNoteOff,
								onPolyAftertouch: runtime.sendPolyAftertouch,
							}}
						/>
					</PresetManagerProvider>
				</div>
			</div>
		</div>
	);
}
