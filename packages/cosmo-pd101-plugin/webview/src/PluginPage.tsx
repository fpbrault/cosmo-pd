import {
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

export default function PluginPage({
	appVersion,
	utilityExtra,
}: PluginPageProps) {
	const isIosHost = window.__czHostPlatform === "ios";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [rendererFrame, setRendererFrame] = useState(() => {
		const frameWidth =
			SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO;
		return {
			frameWidth,
			frameHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
			frameScale: 1,
			effectiveAspectRatio: SYNTH_RENDERER_MIN_ASPECT_RATIO,
		};
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
	}, [isIosHost, isLikelyIosDevice]);

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
