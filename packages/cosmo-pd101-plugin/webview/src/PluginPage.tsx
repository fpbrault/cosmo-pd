import {
	computeRendererFrameLayout,
	DEFAULT_SYNTH_PRESETS,
	FACTORY_CZ_PRESETS,
	installBenchmarkApi,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
	SynthRenderer,
	useNoteHandling,
	useSynthPresetManager,
	useSynthStore,
} from "@cosmo/cosmo-pd101";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";

function normalizeBenchmarkMetrics(value: unknown) {
	if (!value || typeof value !== "object") {
		return null;
	}

	const candidate = value as Record<string, unknown>;
	const readNumber = (key: string) => {
		const next = candidate[key];
		return typeof next === "number" && Number.isFinite(next) ? next : 0;
	};

	return {
		enabled: candidate.enabled === true,
		blockCount: readNumber("blockCount"),
		lastMs: readNumber("lastMs"),
		avgMs: readNumber("avgMs"),
		maxMs: readNumber("maxMs"),
		blockBudgetMs: readNumber("blockBudgetMs"),
		lastRtPercent: readNumber("lastRtPercent"),
		avgRtPercent: readNumber("avgRtPercent"),
		maxRtPercent: readNumber("maxRtPercent"),
		blockSamples: readNumber("blockSamples"),
		sampleRate: readNumber("sampleRate"),
		activeVoices: readNumber("activeVoices"),
		uiQueueDepth: readNumber("uiQueueDepth"),
		paramsApplyCount: readNumber("paramsApplyCount"),
	};
}

type PluginPageProps = {
	utilityExtra?: ReactNode;
};

export default function PluginPage({ utilityExtra }: PluginPageProps = {}) {
	const isIosHost = window.__czHostPlatform === "ios";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);

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
	const { activeNotes, sendNoteOn, sendNoteOff, panic, sendPolyAftertouch } =
		useNoteHandling({
			eventSink: sendNativeEngineEvent,
			velocityCurve,
		});

	usePluginParamBridge();
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const subscribeScopeFrames = useCallback(
		(
			onFrame: (frame: {
				samples: Float32Array;
				sampleRate: number;
				hz: number;
			}) => void,
		) => {
			window.__czOnScope = (samples, sampleRate, hz) => {
				setScopeActiveHz(Number.isFinite(hz) && hz > 0 ? hz : 220);
				onFrame({
					samples: Float32Array.from(samples),
					sampleRate,
					hz,
				});
			};
			return () => {
				window.__czOnScope = undefined;
			};
		},
		[],
	);

	usePluginParamBridge();

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

	const shouldLoadCurrentState = useCallback(() => !window.ipc, []);

	const {
		activePresetId,
		activePresetNameBase,
		loadedPresetFingerprint,
		handleSyncBuiltinSelection,
		handleLoadBuiltin,
	} = useSynthPresetManager({
		builtinPresets: DEFAULT_SYNTH_PRESETS,
		gatherPresetState: gatherState,
		applyPreset,
		libraryPresets: FACTORY_CZ_PRESETS,
		shouldLoadCurrentState,
	});

	useEffect(() => {
		return installBenchmarkApi({
			mode: "plugin",
			listBuiltinPresets: () => Object.keys(DEFAULT_SYNTH_PRESETS),
			loadBuiltinPreset: (name: string) => {
				handleLoadBuiltin(name);
			},
			setPerformanceMonitorEnabled: async (enabled: boolean) => {
				await window.__czSetPerformanceMonitorEnabled?.(enabled);
			},
			getPerformanceMetrics: async () => {
				const value = await window.__czGetPerformanceMetrics?.();
				return normalizeBenchmarkMetrics(value);
			},
			noteOn: (note: number, velocity?: number) => sendNoteOn(note, velocity),
			noteOff: (note: number) => sendNoteOff(note),
			panic,
			ensureReady: async () => {
				if (
					!window.__czGetPerformanceMetrics ||
					!window.__czSetPerformanceMonitorEnabled
				) {
					throw new Error("Plugin benchmark bridge is unavailable");
				}
			},
		});
	}, [handleLoadBuiltin, panic, sendNoteOff, sendNoteOn]);

	useEffect(() => {
		window.__czOnHostPresetSelected = (name: string) => {
			handleSyncBuiltinSelection(name);
		};
		return () => {
			window.__czOnHostPresetSelected = undefined;
		};
	}, [handleSyncBuiltinSelection]);

	useEffect(() => {
		if (!window.ipc || loadedPresetFingerprint == null) {
			return;
		}
		window.ipc.postMessage(
			JSON.stringify({
				preset_session: {
					activePresetId,
					activePresetNameBase,
					loadedPresetFingerprint,
				},
			}),
		);
	}, [activePresetId, activePresetNameBase, loadedPresetFingerprint]);

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
					<SynthRenderer
						bottomBarExtra={utilityExtra}
						disableAudioGate
						engineEventSink={sendNativeEngineEvent}
						effectivePitchHz={scopeActiveHz}
						analyserNodeRef={analyserNodeRef}
						audioCtxRef={audioCtxRef}
						sidebarMinWidthRem={sidebarMinWidthRem}
						subscribeScopeFrames={subscribeScopeFrames}
						miniKeyboard={{
							activeNotes,
							onNoteOn: sendNoteOn,
							onNoteOff: sendNoteOff,
							onPolyAftertouch: sendPolyAftertouch,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
