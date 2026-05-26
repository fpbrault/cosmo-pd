import {
	type CSSProperties,
	memo,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useState,
} from "react";
import SynthSidebar from "@/components/layout/SynthSidebar";
import SynthHeader from "@/components/preset/SynthHeader";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { PresetManagerProvider } from "@/context/PresetManagerContext";
import { ScopeProvider } from "@/context/ScopeContext";
import { useAudioEngine } from "@/features/synth/hooks/useAudioEngine";
import { useMidiLearnBindings } from "@/features/synth/hooks/useMidiLearnBindings";
import { useNoteHandling } from "@/features/synth/hooks/useNoteHandling";
import { useSynthParamsToWorklet } from "@/features/synth/hooks/useSynthParamsToWorklet";
import { SynthParamControllerProvider } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { useSynthPresetManager } from "@/features/synth/useSynthPresetManager";
import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";
import { installBenchmarkApi } from "@/lib/performance/benchmarkHarness";
import {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "@/lib/synth/cosmoWorkletUrl";
import { convertDecodedPatchToSynthPreset } from "@/lib/synth/czPresetConverter";
import { DEFAULT_SYNTH_PRESETS } from "@/lib/synth/defaultPresets";
import { FACTORY_CZ_PRESETS } from "@/lib/synth/factoryCzPresets";
import { noteToFreq } from "@/lib/synth/pdAlgorithms";
import { HoverInfoProvider, useHoverInfo } from "../layout/HoverInfo";
import { useAudioLevelMonitor } from "./hooks/useAudioLevelMonitor";
import { usePerformanceMetrics } from "./hooks/usePerformanceMetrics";
import SynthRendererLibraryOverlay from "./SynthRendererLibraryOverlay";
import SynthRendererMainPanel from "./SynthRendererMainPanel";
import SynthRendererOverlays from "./SynthRendererOverlays";

type MiniKeyboardProps = {
	activeNotes: number[];
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPolyAftertouch: (note: number, pressure: number) => void;
};

export type SynthRendererProps = {
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	sidebarMinWidthRem?: number;
	libraryPresets?: LibraryPreset[];
	onAudioLevelChange?: (level: number) => void;
	disableAudioGate?: boolean;
	engineEventSink?: (type: string, payload: Record<string, unknown>) => void;
	effectivePitchHz?: number;
	analyserNodeRef?: RefObject<AnalyserNode | null>;
	audioCtxRef?: RefObject<AudioContext | null>;
	subscribeScopeFrames?: (
		onFrame: (frame: {
			samples: Float32Array;
			sampleRate: number;
			hz: number;
		}) => void,
	) => () => void;
	miniKeyboard?: MiniKeyboardProps;
};

const FRAME_CLASS =
	"h-full min-h-0 min-w-0 bg-cz-panel flex flex-col overflow-hidden w-full";

type HoverAwareSynthRendererOverlaysProps = Omit<
	React.ComponentProps<typeof SynthRendererOverlays>,
	"infoText"
>;

function HoverAwareSynthRendererOverlays(
	props: HoverAwareSynthRendererOverlaysProps,
) {
	const { infoText } = useHoverInfo();
	return <SynthRendererOverlays {...props} infoText={infoText} />;
}

const SynthRenderer = memo(function SynthRenderer({
	frameStyle,
	headerExtra,
	bottomBarExtra,
	libraryPresets = FACTORY_CZ_PRESETS,
	onAudioLevelChange,
	disableAudioGate = false,
	engineEventSink,
	effectivePitchHz: effectivePitchHzOverride,
	analyserNodeRef: analyserNodeRefOverride,
	audioCtxRef: audioCtxRefOverride,
	sidebarMinWidthRem = 18,
	subscribeScopeFrames,
	miniKeyboard,
}: SynthRendererProps = {}) {
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const gatherState = useSynthStore((s) => s.gatherState);
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const presetStateKey = useSynthStore((s) =>
		JSON.stringify(s.gatherPresetState()),
	);
	const modMatrix = useSynthStore((s) => s.modMatrix);
	const setModMatrix = useSynthStore((s) => s.setModMatrix);

	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const setMainPanelMode = useSynthUiStore((s) => s.setMainPanelMode);
	const keyboardVisible = useSynthUiStore((s) => s.keyboardVisible);
	const setKeyboardVisible = useSynthUiStore((s) => s.setKeyboardVisible);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const libraryModeOpen = useSynthUiStore((s) => s.libraryModeOpen);
	const setLibraryModeOpen = useSynthUiStore((s) => s.setLibraryModeOpen);
	const setBrandInfoOpen = useSynthUiStore((s) => s.setBrandInfoOpen);

	const {
		audioCtxRef,
		analyserNodeRef,
		workletNodeRef,
		paramsRef,
		audioContextState,
		resumeAudio,
	} = useAudioEngine({
		synthWasmUrl,
		synthBindingsUrl,
		cosmoWorkletUrl,
	});

	const { setEnabled: setPerfEnabled, metricsRef } =
		usePerformanceMetrics(workletNodeRef);

	const internalNoteHandling = useNoteHandling({
		workletNodeRef,
		eventSink: engineEventSink,
		velocityCurve,
	});
	const activeNotes =
		miniKeyboard?.activeNotes ?? internalNoteHandling.activeNotes;
	const sendNoteOn = miniKeyboard?.onNoteOn ?? internalNoteHandling.sendNoteOn;
	const sendNoteOff =
		miniKeyboard?.onNoteOff ?? internalNoteHandling.sendNoteOff;
	const sendPolyAftertouch =
		miniKeyboard?.onPolyAftertouch ?? internalNoteHandling.sendPolyAftertouch;
	const panic = internalNoteHandling.panic;
	const hasActiveNotes = activeNotes.length > 0;

	useAudioLevelMonitor(analyserNodeRef, onAudioLevelChange);

	const heldNote = hasActiveNotes ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq = heldNote != null ? noteToFreq(heldNote) : 220;
	const effectivePitchHz =
		effectivePitchHzOverride != null ? effectivePitchHzOverride : currentFreq;
	const resolvedAnalyserNodeRef = analyserNodeRefOverride ?? analyserNodeRef;
	const resolvedAudioCtxRef = audioCtxRefOverride ?? audioCtxRef;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz,
		gatherState,
	});

	const handleLoadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (preset.data) {
				applyPreset(preset.data);
				return;
			}
			if (preset.sysexData) {
				const decoded = decodeCzPatch(preset.sysexData);
				if (decoded) {
					const synthPreset = convertDecodedPatchToSynthPreset(decoded);
					applyPreset(synthPreset);
				}
			}
		},
		[applyPreset],
	);

	const {
		visiblePresetEntries,
		activePresetId,
		activePresetName,
		pendingPresetChange,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetAuthor,
		handleSetPresetFavorite,
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
		gatherPresetState,
		applyPreset,
		onBeforeApplyPreset: panic,
		libraryPresets,
		onLoadLibraryPreset: handleLoadLibraryPreset,
		presetStateKey,
	});

	useEffect(() => {
		return installBenchmarkApi({
			mode: "web",
			listBuiltinPresets: () => Object.keys(DEFAULT_SYNTH_PRESETS),
			loadBuiltinPreset: (name: string) => {
				handleLoadBuiltin(name);
			},
			setPerformanceMonitorEnabled: (enabled: boolean) => {
				setPerfEnabled(enabled);
				if (enabled) {
					workletNodeRef.current?.port.postMessage({
						type: "setPerformanceMonitorEnabled",
						enabled: true,
					});
				}
			},
			getPerformanceMetrics: () => metricsRef.current,
			noteOn: (note: number, velocity?: number) => sendNoteOn(note, velocity),
			noteOff: (note: number) => sendNoteOff(note),
			panic,
			ensureReady: async () => {
				resumeAudio();
				const deadline = performance.now() + 5000;
				while (
					performance.now() < deadline &&
					audioCtxRef.current?.state !== "running"
				) {
					await new Promise((resolve) => window.setTimeout(resolve, 50));
				}
				if (audioCtxRef.current?.state !== "running") {
					throw new Error("Audio context failed to enter running state");
				}
			},
		});
	}, [
		audioCtxRef,
		handleLoadBuiltin,
		panic,
		resumeAudio,
		sendNoteOff,
		sendNoteOn,
		workletNodeRef,
		setPerfEnabled,
		metricsRef,
	]);

	useMidiLearnBindings();
	const [libraryVisibleEntries, setLibraryVisibleEntries] =
		useState<PresetEntry[]>(visiblePresetEntries);

	const keyboardInsetPx = keyboardHeight + 16;
	const mainPanelBottomInset =
		keyboardVisible && !libraryModeOpen ? `${keyboardInsetPx / 16}rem` : "0rem";
	const mainPanelPaddingBottom =
		keyboardVisible && !libraryModeOpen ? `${keyboardInsetPx}px` : "0px";
	const sidebarAvailableHeight =
		keyboardVisible && !libraryModeOpen
			? `calc(100% - ${mainPanelPaddingBottom})`
			: "100%";
	const frameStyleWithPanelInset = {
		...frameStyle,
		"--main-panel-bottom-inset": mainPanelBottomInset,
	} as CSSProperties;

	const handleCloseLibrary = useCallback(() => {
		setLibraryModeOpen(false);
	}, [setLibraryModeOpen]);

	useEffect(() => {
		setLibraryVisibleEntries(visiblePresetEntries);
	}, [visiblePresetEntries]);

	const handleStepPresetInVisibleOrder = useCallback(
		(direction: -1 | 1) => {
			const entries =
				libraryVisibleEntries.length > 0
					? libraryVisibleEntries
					: visiblePresetEntries;
			if (entries.length === 0) {
				return;
			}

			const currentIndex = entries.findIndex(
				(entry) => entry.id === activePresetId,
			);
			const nextIndex =
				currentIndex < 0
					? direction === 1
						? 0
						: entries.length - 1
					: (currentIndex + direction + entries.length) % entries.length;
			const entry = entries[nextIndex];
			if (!entry) {
				return;
			}

			if (entry.type === "local") {
				handleLoadLocal(entry.id);
				return;
			}
			if (entry.type === "builtin") {
				handleLoadBuiltin(entry.label);
				return;
			}
			if (entry.preset) {
				handleLoadLibrary(entry.preset);
			}
		},
		[
			libraryVisibleEntries,
			visiblePresetEntries,
			activePresetId,
			handleLoadLocal,
			handleLoadBuiltin,
			handleLoadLibrary,
		],
	);

	const audioGate = {
		ready: disableAudioGate || audioContextState === "running",
		onResume: resumeAudio,
	};

	return (
		<HoverInfoProvider>
			<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
				<SynthParamControllerProvider>
					<ScopeProvider
						analyserNodeRef={resolvedAnalyserNodeRef}
						audioCtxRef={resolvedAudioCtxRef}
						effectivePitchHz={effectivePitchHz}
						subscribeScopeFrames={subscribeScopeFrames}
					>
						<PresetManagerProvider
							value={{
								visiblePresetEntries,
								activePresetId,
								activePresetName,
								pendingPresetChange,
								handleLoadLocal,
								handleLoadBuiltin,
								handleLoadLibrary,
								handleSavePreset,
								handleDeletePreset,
								handleRenamePreset,
								handleSetPresetAuthor,
								handleSetPresetFavorite,
								handleSetPresetTags,
								handleInitPreset,
								handleExportPreset,
								handleImportPreset,
								handleExportCurrentState,
								handleSavePendingPresetChange,
								handleDiscardPendingPresetChange,
								handleCancelPendingPresetChange,
							}}
						>
							<div
								data-theme="cosmo"
								className={`${FRAME_CLASS} relative select-none`}
								style={frameStyleWithPanelInset}
							>
								<div className="relative z-30">
									<SynthHeader
										onStepPreset={handleStepPresetInVisibleOrder}
										onBrandInfoClick={() => setBrandInfoOpen(true)}
										isLibraryModeOpen={libraryModeOpen}
										onLibraryModeChange={setLibraryModeOpen}
									/>
									{headerExtra}
								</div>
								<div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 gap-2 overflow-hidden bg-cz-surface px-1">
									<div
										className="flex min-h-0 items-stretch overflow-hidden"
										style={{ height: sidebarAvailableHeight }}
									>
										<SynthSidebar
											sidebarMinWidthRem={sidebarMinWidthRem}
											fillAvailableHeight
											libraryModeOpen={libraryModeOpen}
										/>
									</div>
									<div
										className="flex min-h-0 flex-1 items-stretch justify-center overflow-hidden"
										style={{ paddingBottom: mainPanelPaddingBottom }}
									>
										<SynthRendererMainPanel
											mainPanelMode={mainPanelMode}
											setMainPanelMode={setMainPanelMode}
										/>
									</div>
								</div>
								<SynthRendererLibraryOverlay
									isOpen={libraryModeOpen}
									onVisibleEntriesChange={setLibraryVisibleEntries}
									onClose={handleCloseLibrary}
								/>
								<HoverAwareSynthRendererOverlays
									audioGate={audioGate}
									activeNotes={activeNotes}
									libraryModeOpen={libraryModeOpen}
									keyboardVisible={keyboardVisible}
									onNoteOn={sendNoteOn}
									onNoteOff={sendNoteOff}
									onPolyAftertouch={sendPolyAftertouch}
									bottomBarExtra={bottomBarExtra}
									onKeyboardToggle={() => setKeyboardVisible(!keyboardVisible)}
									onKeyboardSettingsClick={() =>
										useSynthUiStore.getState().setKeyboardSettingsOpen(true)
									}
								/>
							</div>
						</PresetManagerProvider>
					</ScopeProvider>
				</SynthParamControllerProvider>
			</ModMatrixProvider>
		</HoverInfoProvider>
	);
});

export default SynthRenderer;
export const SharedPhaseDistortionVisualizer = SynthRenderer;
