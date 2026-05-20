import {
	type CSSProperties,
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import SynthSidebar from "@/components/layout/SynthSidebar";
import SynthHeader from "@/components/preset/SynthHeader";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
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
import { useDrawerPanelState } from "./useDrawerPanelState";
import { useEnvOverrideHandlers } from "./useEnvOverrideHandlers";

export type SynthRendererProps = {
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	libraryPresets?: LibraryPreset[];
	onAudioLevelChange?: (level: number) => void;
};

const FRAME_CLASS =
	"h-full min-h-0 min-w-0 bg-cz-panel flex flex-col overflow-hidden w-full";

const SynthRenderer = memo(function SynthRenderer({
	frameStyle,
	headerExtra,
	bottomBarExtra,
	libraryPresets = FACTORY_CZ_PRESETS,
	onAudioLevelChange,
}: SynthRendererProps = {}) {
	const setLine1DcoEnv = useSynthStore((s) => s.setLine1DcoEnv);
	const setLine1DcwEnv = useSynthStore((s) => s.setLine1DcwEnv);
	const setLine1DcaEnv = useSynthStore((s) => s.setLine1DcaEnv);
	const setLine2DcoEnv = useSynthStore((s) => s.setLine2DcoEnv);
	const setLine2DcwEnv = useSynthStore((s) => s.setLine2DcwEnv);
	const setLine2DcaEnv = useSynthStore((s) => s.setLine2DcaEnv);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));
	const modMatrix = useSynthStore((s) => s.modMatrix);
	const setModMatrix = useSynthStore((s) => s.setModMatrix);

	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const setMainPanelMode = useSynthUiStore((s) => s.setMainPanelMode);
	const keyboardVisible = useSynthUiStore((s) => s.keyboardVisible);
	const setKeyboardVisible = useSynthUiStore((s) => s.setKeyboardVisible);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const libraryModeOpen = useSynthUiStore((s) => s.libraryModeOpen);
	const setLibraryModeOpen = useSynthUiStore((s) => s.setLibraryModeOpen);

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

	const { activeNotes, sendNoteOn, sendNoteOff, sendPolyAftertouch, panic } =
		useNoteHandling({ workletNodeRef, velocityCurve });
	const hasActiveNotes = activeNotes.length > 0;

	useAudioLevelMonitor(analyserNodeRef, onAudioLevelChange);

	const heldNote = hasActiveNotes ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq = heldNote != null ? noteToFreq(heldNote) : 220;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz: currentFreq,
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
		gatherState,
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

	const lastHeldFreqRef = useRef(currentFreq);
	lastHeldFreqRef.current = currentFreq;
	const effectivePitchHz = lastHeldFreqRef.current;

	const envOverrideHandlers = useEnvOverrideHandlers({
		setLine1DcoEnv,
		setLine1DcwEnv,
		setLine1DcaEnv,
		setLine2DcoEnv,
		setLine2DcwEnv,
		setLine2DcaEnv,
	});

	useMidiLearnBindings();

	const { infoText } = useHoverInfo();
	const {
		drawerOpen,
		waveDrawerOpen,
		activeDrawerPanel,
		drawerSlideDirection,
	} = useDrawerPanelState(mainPanelMode);

	const [brandInfoOpen, setBrandInfoOpen] = useState(false);
	const [globalPanelOpen, setGlobalPanelOpen] = useState(false);
	const [midiLearnOpen, setMidiLearnOpen] = useState(false);
	const [macroLabelEditorOpen, setMacroLabelEditorOpen] = useState(false);
	const [keyboardSettingsOpen, setKeyboardSettingsOpen] = useState(false);
	const [libraryVisibleEntries, setLibraryVisibleEntries] =
		useState<PresetEntry[]>(visiblePresetEntries);

	const keyboardInsetPx = keyboardHeight + 48;
	const mainPanelBottomInset =
		keyboardVisible && !libraryModeOpen ? `${keyboardInsetPx / 16}rem` : "0rem";
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
		ready: audioContextState === "running",
		onResume: resumeAudio,
	};

	return (
		<HoverInfoProvider>
			<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
				<SynthParamControllerProvider>
					<div
						data-theme="cosmo"
						className={`${FRAME_CLASS} relative select-none`}
						style={frameStyleWithPanelInset}
					>
						<div className="relative z-30">
							<SynthHeader
								allEntries={visiblePresetEntries}
								activeEntryId={activePresetId}
								activePresetName={activePresetName}
								pendingPresetChange={pendingPresetChange}
								onLoadLocal={handleLoadLocal}
								onLoadLibrary={handleLoadLibrary}
								onLoadBuiltin={handleLoadBuiltin}
								onStepPreset={handleStepPresetInVisibleOrder}
								onSavePreset={handleSavePreset}
								onDeletePreset={handleDeletePreset}
								onRenamePreset={handleRenamePreset}
								onSetPresetAuthor={handleSetPresetAuthor}
								onSetPresetFavorite={handleSetPresetFavorite}
								onSetPresetTags={handleSetPresetTags}
								onInitPreset={handleInitPreset}
								onExportPreset={handleExportPreset}
								onExportCurrentState={handleExportCurrentState}
								onImportPreset={handleImportPreset}
								onSavePendingPresetChange={handleSavePendingPresetChange}
								onDiscardPendingPresetChange={handleDiscardPendingPresetChange}
								onCancelPendingPresetChange={handleCancelPendingPresetChange}
								onBrandInfoClick={() => setBrandInfoOpen(true)}
								isLibraryModeOpen={libraryModeOpen}
								onLibraryModeChange={setLibraryModeOpen}
							/>
							{headerExtra}
						</div>
						<div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 gap-2 overflow-hidden px-1">
							<SynthSidebar
								effectivePitchHz={effectivePitchHz}
								analyserNodeRef={analyserNodeRef}
								audioCtxRef={audioCtxRef}
								waveDrawerOpen={waveDrawerOpen}
								libraryModeOpen={libraryModeOpen}
								globalOpen={globalPanelOpen}
								onOpenGlobal={() => setGlobalPanelOpen(true)}
								midiLearnOpen={midiLearnOpen}
								onOpenMidiLearn={() => setMidiLearnOpen((value) => !value)}
								onOpenMacroLabels={() => setMacroLabelEditorOpen(true)}
							/>
							<SynthRendererMainPanel
								mainPanelMode={mainPanelMode}
								setMainPanelMode={setMainPanelMode}
								envOverrideHandlers={envOverrideHandlers}
								drawerOpen={drawerOpen}
								activeDrawerPanel={activeDrawerPanel}
								drawerSlideDirection={drawerSlideDirection}
								analyserNodeRef={analyserNodeRef}
								audioCtxRef={audioCtxRef}
								effectivePitchHz={effectivePitchHz}
							/>
						</div>
						<SynthRendererLibraryOverlay
							isOpen={libraryModeOpen}
							allEntries={visiblePresetEntries}
							activeEntryId={activePresetId}
							activePresetName={activePresetName}
							onLoadLocal={handleLoadLocal}
							onLoadLibrary={handleLoadLibrary}
							onLoadBuiltin={handleLoadBuiltin}
							onSavePreset={handleSavePreset}
							onDeletePreset={handleDeletePreset}
							onRenamePreset={handleRenamePreset}
							onSetPresetAuthor={handleSetPresetAuthor}
							onSetPresetFavorite={handleSetPresetFavorite}
							onSetPresetTags={handleSetPresetTags}
							onExportPreset={handleExportPreset}
							onExportCurrentState={handleExportCurrentState}
							onImportPreset={handleImportPreset}
							onInitPreset={handleInitPreset}
							onVisibleEntriesChange={setLibraryVisibleEntries}
							onClose={handleCloseLibrary}
						/>
						<SynthRendererOverlays
							audioGate={audioGate}
							brandInfoOpen={brandInfoOpen}
							onCloseBrandInfo={() => setBrandInfoOpen(false)}
							globalPanelOpen={globalPanelOpen}
							onCloseGlobalPanel={() => setGlobalPanelOpen(false)}
							macroLabelEditorOpen={macroLabelEditorOpen}
							onCloseMacroLabelEditor={() => setMacroLabelEditorOpen(false)}
							keyboardSettingsOpen={keyboardSettingsOpen}
							onCloseKeyboardSettings={() => setKeyboardSettingsOpen(false)}
							pendingPresetChange={pendingPresetChange}
							onSavePendingPresetChange={handleSavePendingPresetChange}
							onDiscardPendingPresetChange={handleDiscardPendingPresetChange}
							onCancelPendingPresetChange={handleCancelPendingPresetChange}
							hasActiveNotes={hasActiveNotes}
							activeNotes={activeNotes}
							libraryModeOpen={libraryModeOpen}
							keyboardVisible={keyboardVisible}
							onNoteOn={sendNoteOn}
							onNoteOff={sendNoteOff}
							onPolyAftertouch={sendPolyAftertouch}
							infoText={infoText}
							bottomBarExtra={bottomBarExtra}
							onKeyboardToggle={() => setKeyboardVisible(!keyboardVisible)}
							onKeyboardSettingsClick={() => setKeyboardSettingsOpen(true)}
						/>
					</div>
				</SynthParamControllerProvider>
			</ModMatrixProvider>
		</HoverInfoProvider>
	);
});

export default SynthRenderer;
export const SharedPhaseDistortionVisualizer = SynthRenderer;
export type { SynthRendererProps as SharedPhaseDistortionVisualizerProps };
