import {
	type Auv3FitMode,
	type Auv3HostFitLayout,
	computeAuv3HostFitLayout,
	computeRendererFrameLayout,
	type PresetManagerController,
	PresetManagerProvider,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
	SynthRenderer,
	useGlobalSynthSettings,
	useSynthPresetManager,
	useSynthStore,
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
import { postPluginIpc } from "./lib/postPluginIpc";

type PluginPageProps = {
	appVersion: string;
	utilityExtra?: ReactNode;
};

type HostSize = {
	width: number;
	height: number;
	scale?: number;
	deviceLandscapeAspectRatio?: number;
	fitMode?: Auv3FitMode;
	reason?: string;
};

type PluginRendererLayout = {
	frameWidth: number;
	frameHeight: number;
	frameScale: number;
	scaledWidth: number;
	scaledHeight: number;
	offsetX: number;
	offsetY: number;
};

declare global {
	interface Window {
		__czHostSize?: HostSize;
	}
}

function toPluginRendererLayout({
	frameWidth,
	frameHeight,
	frameScale,
}: {
	frameWidth: number;
	frameHeight: number;
	frameScale: number;
}): PluginRendererLayout {
	return {
		frameWidth,
		frameHeight,
		frameScale,
		scaledWidth: frameWidth * frameScale,
		scaledHeight: frameHeight * frameScale,
		offsetX: 0,
		offsetY: 0,
	};
}

function toAuv3PluginRendererLayout(
	layout: Auv3HostFitLayout,
): PluginRendererLayout {
	return {
		frameWidth: layout.naturalWidth,
		frameHeight: layout.naturalHeight,
		frameScale: layout.scale,
		scaledWidth: layout.scaledWidth,
		scaledHeight: layout.scaledHeight,
		offsetX: layout.offsetX,
		offsetY: layout.offsetY,
	};
}

function getScreenLandscapeAspectRatio() {
	const width = Math.max(window.screen.width, window.screen.height);
	const height = Math.min(window.screen.width, window.screen.height);
	return height > 0 ? width / height : 4 / 3;
}

function isValidHostSize(value: HostSize | undefined): value is HostSize {
	return Boolean(value?.width && value.height);
}

function getAuv3HostBounds({
	bounds,
	nativeHostSize,
	preferNativeHostSize,
}: {
	bounds: DOMRect;
	nativeHostSize?: HostSize;
	preferNativeHostSize: boolean;
}): HostSize {
	if (preferNativeHostSize && isValidHostSize(nativeHostSize)) {
		return nativeHostSize;
	}
	if (bounds.width > 0 && bounds.height > 0) {
		return {
			width: bounds.width,
			height: bounds.height,
			deviceLandscapeAspectRatio: nativeHostSize?.deviceLandscapeAspectRatio,
			fitMode: nativeHostSize?.fitMode,
		};
	}
	const viewport = window.visualViewport;
	if (viewport?.width && viewport.height) {
		return {
			width: viewport.width,
			height: viewport.height,
			deviceLandscapeAspectRatio: nativeHostSize?.deviceLandscapeAspectRatio,
			fitMode: nativeHostSize?.fitMode,
		};
	}
	if (isValidHostSize(nativeHostSize)) {
		return nativeHostSize;
	}
	return { width: window.innerWidth, height: window.innerHeight };
}

function layoutsMatch(
	current: PluginRendererLayout | null,
	next: PluginRendererLayout,
) {
	return (
		current &&
		Math.abs(current.frameWidth - next.frameWidth) < 0.5 &&
		Math.abs(current.frameHeight - next.frameHeight) < 0.5 &&
		Math.abs(current.frameScale - next.frameScale) < 0.001 &&
		Math.abs(current.scaledWidth - next.scaledWidth) < 0.5 &&
		Math.abs(current.scaledHeight - next.scaledHeight) < 0.5 &&
		Math.abs(current.offsetX - next.offsetX) < 0.5 &&
		Math.abs(current.offsetY - next.offsetY) < 0.5
	);
}

export default function PluginPage({
	appVersion,
	utilityExtra,
}: PluginPageProps) {
	const isIosHost = window.__czHostPlatform === "ios";
	const isAuv3Platform =
		window.__czHostPlatform === "ios" || window.__czHostPlatform === "macos";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const isAuv3Hosted =
		window.__czRuntimeMode === "auv3-hosted" || isAuv3Platform;
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [rendererFrame, setRendererFrame] =
		useState<PluginRendererLayout | null>(() => {
			const initialLayout = computeRendererFrameLayout({
				availableWidth:
					SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO,
				availableHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
				targetAspectRatio: SYNTH_RENDERER_MIN_ASPECT_RATIO,
			});
			return initialLayout ? toPluginRendererLayout(initialLayout) : null;
		});
	const sendNativeEngineEvent = useCallback(
		(type: string, payload: Record<string, unknown>) => {
			const pm = window.ipc?.postMessage?.bind(window.ipc);
			if (!pm) {
				return;
			}
			switch (type) {
				case "noteOn":
					postPluginIpc(pm, "noteOn", {
						note: payload.note as number,
						velocity: payload.velocity as number,
					});
					break;
				case "noteOff":
					postPluginIpc(pm, "noteOff", {
						note: payload.note as number,
					});
					break;
				case "sustain":
					postPluginIpc(pm, "sustain", {
						on: payload.on as boolean,
					});
					break;
				case "pitchBend":
					postPluginIpc(pm, "pitchBend", {
						value: payload.value as number,
					});
					break;
				case "modWheel":
					postPluginIpc(pm, "modWheel", {
						value: payload.value as number,
					});
					break;
				case "aftertouch":
					postPluginIpc(pm, "aftertouch", {
						value: payload.value as number,
					});
					break;
				case "polyAftertouch":
					postPluginIpc(pm, "polyAftertouch", {
						note: payload.note as number,
						value: payload.value as number,
					});
					break;
				case "macroValue":
					postPluginIpc(pm, "macroValue", {
						index: payload.index as number,
						value: payload.value as number,
					});
					break;
				case "panic":
					postPluginIpc(pm, "panic");
					break;
			}
		},
		[],
	);
	const runtime = usePluginSynthRuntime({ eventSink: sendNativeEngineEvent });
	const presetManagerRef = useRef<PresetManagerController | null>(null);
	const handleExternalParamChange = useCallback(() => {
		presetManagerRef.current?.recomputeDirtyState();
	}, []);
	const {
		bridgeReady,
		getPresetSession,
		setPresetSession: persistPresetSession,
	} = usePluginParamBridge({
		onExternalParamChange: handleExternalParamChange,
	});
	const presetRepository = useMemo(
		() =>
			createPluginPresetManagerRepository({
				applyPreset,
				gatherPresetState,
				onBeforeApplyPreset: runtime.panic,
			}),
		[applyPreset, gatherPresetState, runtime.panic],
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

		const updateFrameSize = (event?: Event) => {
			const bounds = element.getBoundingClientRect();
			let nextLayout: PluginRendererLayout | null = null;

			if (isAuv3Hosted) {
				const nativeHostSize =
					event instanceof CustomEvent && isValidHostSize(event.detail)
						? event.detail
						: window.__czHostSize;
				const hostBounds = getAuv3HostBounds({
					bounds,
					nativeHostSize,
					preferNativeHostSize: !event || event.type === "cz-host-size-changed",
				});
				const fitLayout = computeAuv3HostFitLayout({
					hostWidth: hostBounds.width,
					hostHeight: hostBounds.height,
					deviceLandscapeAspectRatio:
						hostBounds.deviceLandscapeAspectRatio ??
						getScreenLandscapeAspectRatio(),
					fitMode: hostBounds.fitMode ?? "fit-bounds",
				});
				nextLayout = fitLayout ? toAuv3PluginRendererLayout(fitLayout) : null;
			} else {
				const availableWidth = bounds.width;
				const availableHeight = bounds.height;

				if (availableWidth <= 0 || availableHeight <= 0) {
					return;
				}

				const targetAspectRatio =
					isIosHost || isLikelyIosDevice
						? undefined
						: SYNTH_RENDERER_MIN_ASPECT_RATIO;
				const sharedLayout = computeRendererFrameLayout({
					availableWidth,
					availableHeight,
					targetAspectRatio,
				});
				nextLayout = sharedLayout ? toPluginRendererLayout(sharedLayout) : null;
			}
			if (!nextLayout) {
				return;
			}

			setRendererFrame((current) => {
				if (layoutsMatch(current, nextLayout)) {
					return current;
				}
				return nextLayout;
			});
		};

		updateFrameSize();
		window.addEventListener("resize", updateFrameSize);
		window.addEventListener("cz-host-size-changed", updateFrameSize);
		window.visualViewport?.addEventListener("resize", updateFrameSize);

		const resizeObserver = new ResizeObserver(() => {
			updateFrameSize(new Event("resizeobserver"));
		});
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateFrameSize);
			window.removeEventListener("cz-host-size-changed", updateFrameSize);
			window.visualViewport?.removeEventListener("resize", updateFrameSize);
		};
	}, [isAuv3Hosted, isIosHost, isLikelyIosDevice]);

	useEffect(() => {
		if (!bridgeReady) {
			return;
		}
		void presetManager.reloadLibrary();
	}, [bridgeReady, presetManager.reloadLibrary]);

	useEffect(() => {
		window.__czOnHostPresetSelected = (name: string) => {
			void window.__czSetPresetName?.(name);
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

	const pluginVoiceLimit = useGlobalSynthSettings((s) => s.voiceLimit);
	const setPluginVoiceLimit = useGlobalSynthSettings((s) => s.setVoiceLimit);

	const [voiceLimitHydrated, setVoiceLimitHydrated] = useState(false);

	useEffect(() => {
		let cancelled = false;
		window
			.__czGetVoiceLimit?.()
			.then((limit) => {
				if (cancelled) return;
				if (typeof limit === "number") {
					setPluginVoiceLimit(limit);
				}
			})
			.finally(() => {
				if (!cancelled) setVoiceLimitHydrated(true);
			});
		return () => {
			cancelled = true;
		};
	}, [setPluginVoiceLimit]);

	useEffect(() => {
		if (!voiceLimitHydrated) return;
		void window.__czSetVoiceLimit?.(pluginVoiceLimit);
	}, [voiceLimitHydrated, pluginVoiceLimit]);

	const combinedScale = rendererFrame?.frameScale ?? 1;
	const frameWidth =
		rendererFrame?.frameWidth ??
		SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO;
	const frameHeight =
		rendererFrame?.frameHeight ?? SYNTH_RENDERER_DESIGN_HEIGHT;

	const displayScale = rendererFrame ? combinedScale : 1;
	const scaledWidth = rendererFrame?.scaledWidth ?? frameWidth * displayScale;
	const scaledHeight =
		rendererFrame?.scaledHeight ?? frameHeight * displayScale;

	const zoomStyle: CSSProperties = {
		width: frameWidth,
		height: frameHeight,
		transform: `scale(${displayScale})`,
		transformOrigin: "center",
	};
	const auv3ZoomStyle: CSSProperties = {
		...zoomStyle,
		transformOrigin: "top left",
	};

	const auv3FitMode = window.__czHostSize?.fitMode ?? "fit-bounds";
	const isAuv3FitWidth = auv3FitMode === "fit-width";

	if (isAuv3Hosted) {
		return (
			<div
				ref={frameRef}
				className={
					isAuv3FitWidth
						? "relative h-full w-full overflow-y-auto overflow-x-hidden bg-black"
						: "relative h-full w-full overflow-hidden bg-black"
				}
			>
				<div
					className="absolute overflow-hidden"
					style={{
						left: rendererFrame?.offsetX ?? 0,
						top: rendererFrame?.offsetY ?? 0,
						width: scaledWidth,
						height: scaledHeight,
					}}
				>
					<div
						className="absolute top-0 left-0 origin-top-left"
						style={auv3ZoomStyle}
					>
						<PresetManagerProvider value={presetManager}>
							<SynthRenderer
								runtime={runtime}
								appVersion={appVersion}
								bottomBarExtra={utilityExtra}
								disableAudioGate
								miniKeyboard={{
									activeNotes: runtime.activeNotes,
									pitchBend: runtime.pitchBend,
									modWheel: runtime.modWheel,
									onNoteOn: runtime.sendNoteOn,
									onNoteOff: runtime.sendNoteOff,
									onPitchBend: runtime.sendPitchBend,
									onModWheel: runtime.sendModWheel,
									onPolyAftertouch: runtime.sendPolyAftertouch,
								}}
							/>
						</PresetManagerProvider>
					</div>
				</div>
			</div>
		);
	}

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
							miniKeyboard={{
								activeNotes: runtime.activeNotes,
								pitchBend: runtime.pitchBend,
								modWheel: runtime.modWheel,
								onNoteOn: runtime.sendNoteOn,
								onNoteOff: runtime.sendNoteOff,
								onPitchBend: runtime.sendPitchBend,
								onModWheel: runtime.sendModWheel,
								onPolyAftertouch: runtime.sendPolyAftertouch,
							}}
						/>
					</PresetManagerProvider>
				</div>
			</div>
		</div>
	);
}
