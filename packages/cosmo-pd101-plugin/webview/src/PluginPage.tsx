import {
	DEFAULT_SYNTH_PRESETS,
	noteToFreq,
	SynthRenderer,
	useLcdControlReadout,
	useNoteHandling,
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
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";

const SYNTH_RENDERER_DESIGN_WIDTH = 1368;
const SYNTH_RENDERER_DESIGN_HEIGHT = 912;
const SYNTH_RENDERER_BASE_HEIGHT_IOS = 912;
const SYNTH_RENDERER_MIN_ASPECT_RATIO_IOS = 4 / 3;
const SYNTH_RENDERER_MAX_ASPECT_RATIO_IOS = 3 / 2;

function clampRendererAspectRatioIOS(aspectRatio: number): number {
	return Math.min(
		SYNTH_RENDERER_MAX_ASPECT_RATIO_IOS,
		Math.max(SYNTH_RENDERER_MIN_ASPECT_RATIO_IOS, aspectRatio),
	);
}

type PluginPageProps = {
	utilityExtra?: ReactNode;
};

export default function PluginPage({ utilityExtra }: PluginPageProps = {}) {
	const isMacHost = window.__czHostPlatform === "macos";
	const isIosHost = window.__czHostPlatform === "ios";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [rendererFrame, setRendererFrame] = useState({
		width: SYNTH_RENDERER_DESIGN_WIDTH,
		height: SYNTH_RENDERER_DESIGN_HEIGHT,
		scale: 1,
	});
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const activeAsidePanel = useSynthUiStore((s) => s.activeAsidePanel);
	const setActiveAsidePanel = useSynthUiStore((s) => s.setActiveAsidePanel);
	const { lcdControlReadout, pushLcdControlReadout } = useLcdControlReadout();
	const sendNativeEngineEvent = useCallback(
		(type: string, payload: Record<string, unknown>) => {
			window.ipc?.postMessage(
				JSON.stringify({ id: 0, method: type, args: [payload] }),
			);
		},
		[],
	);
	const { activeNotes, sendNoteOn, sendNoteOff } = useNoteHandling({
		eventSink: sendNativeEngineEvent,
		velocityCurve,
	});

	usePluginParamBridge();

	const subscribeScopeFrames = useCallback(
		(
			onFrame: (frame: {
				samples: Float32Array;
				sampleRate: number;
				hz: number;
			}) => void,
		) => {
			window.__czOnScope = (
				samples: number[],
				sampleRate: number,
				hz: number,
			) => {
				onFrame({
					samples: new Float32Array(samples),
					sampleRate,
					hz,
				});
				setScopeActiveHz(Math.round(hz * 10) / 10);
			};

			return () => {
				window.__czOnScope = undefined;
			};
		},
		[],
	);

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

			const shouldFillViewport = isMacHost || isIosHost || isLikelyIosDevice;

			const nextWidth = shouldFillViewport
				? bounds.width
				: SYNTH_RENDERER_BASE_HEIGHT_IOS *
					clampRendererAspectRatioIOS(bounds.width / bounds.height);
			const nextHeight = shouldFillViewport
				? bounds.height
				: SYNTH_RENDERER_BASE_HEIGHT_IOS;
			const scaleToFillWidth = bounds.width / nextWidth;
			const scaleToFitHeight = bounds.height / nextHeight;
			const nextScale = shouldFillViewport
				? 1
				: bounds.width / bounds.height > SYNTH_RENDERER_MAX_ASPECT_RATIO_IOS
					? scaleToFillWidth
					: Math.min(scaleToFillWidth, scaleToFitHeight);

			setRendererFrame((current) => {
				if (
					Math.abs(current.width - nextWidth) < 0.5 &&
					Math.abs(current.height - nextHeight) < 0.5 &&
					Math.abs(current.scale - nextScale) < 0.001
				) {
					return current;
				}
				return {
					width: nextWidth,
					height: nextHeight,
					scale: nextScale,
				};
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
	}, [isIosHost, isLikelyIosDevice, isMacHost]);

	const shouldLoadCurrentState = useCallback(() => !window.ipc, []);

	const {
		allPresetEntries,
		showLibraryPresets,
		activePresetId,
		activePresetNameBase,
		activePresetName,
		loadedPresetFingerprint,
		pendingPresetChange,
		handleSyncBuiltinSelection,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleStepPreset,
		handleToggleLibraryPresets,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetFavorite,
		handleSetPresetCategory,
		handleSetPresetTags,
		handleInitPreset,
		handleExportPreset,
		handleImportPreset,
		handleExportCurrentState,
		handleSavePendingPresetChange,
		handleDiscardPendingPresetChange,
		handleCancelPendingPresetChange,
	} = useSynthPresetManager({
		builtinPresets: DEFAULT_SYNTH_PRESETS,
		gatherState,
		applyPreset,
		shouldLoadCurrentState,
		presetStateKey,
	});

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

	const heldNote =
		activeNotes.length > 0 ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq =
		heldNote != null
			? noteToFreq(heldNote)
			: scopeActiveHz > 0
				? scopeActiveHz
				: 220;
	const lastFreqRef = useRef(currentFreq);
	if (currentFreq > 0) {
		lastFreqRef.current = currentFreq;
	}
	const effectivePitchHz = lastFreqRef.current;

	const lcdPrimaryText = useMemo(() => {
		if (heldNote != null) {
			return `NOTE ${heldNote} ${effectivePitchHz.toFixed(1)}HZ`;
		}
		return `PRESET ${activePresetName.toUpperCase()}`;
	}, [heldNote, effectivePitchHz, activePresetName]);

	const combinedScale = rendererFrame.scale;
	const scaledWidth = rendererFrame.width * combinedScale;
	const scaledHeight = rendererFrame.height * combinedScale;

	const zoomStyle: CSSProperties = {
		width: rendererFrame.width,
		height: rendererFrame.height,
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
						headerProps={{
							allEntries: allPresetEntries,
							showLibraryPresets,
							onToggleLibraryPresets: handleToggleLibraryPresets,
							activeEntryId: activePresetId,
							activePresetName,
							pendingPresetChange,
							onLoadLocal: handleLoadLocal,
							onLoadLibrary: handleLoadLibrary,
							onLoadBuiltin: handleLoadBuiltin,
							onStepPreset: handleStepPreset,
							onSavePreset: handleSavePreset,
							onDeletePreset: handleDeletePreset,
							onRenamePreset: handleRenamePreset,
							onSetPresetFavorite: handleSetPresetFavorite,
							onSetPresetCategory: handleSetPresetCategory,
							onSetPresetTags: handleSetPresetTags,
							onInitPreset: handleInitPreset,
							onExportPreset: handleExportPreset,
							onExportCurrentState: handleExportCurrentState,
							onImportPreset: handleImportPreset,
							onSavePendingPresetChange: handleSavePendingPresetChange,
							onDiscardPendingPresetChange: handleDiscardPendingPresetChange,
							onCancelPendingPresetChange: handleCancelPendingPresetChange,
						}}
						frameClassName="h-full min-h-0 min-w-0 w-full bg-cz-panel flex flex-col overflow-hidden"
						bottomBarExtra={utilityExtra}
						lcdPrimaryText={lcdPrimaryText}
						lcdSecondaryText={""}
						lcdTransientReadout={lcdControlReadout}
						effectivePitchHz={effectivePitchHz}
						analyserNodeRef={analyserNodeRef}
						audioCtxRef={audioCtxRef}
						subscribeScopeFrames={subscribeScopeFrames}
						activeAsidePanel={activeAsidePanel}
						onAsidePanelChange={setActiveAsidePanel}
						onControlReadout={pushLcdControlReadout}
						miniKeyboard={{
							activeNotes,
							onNoteOn: sendNoteOn,
							onNoteOff: sendNoteOff,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
