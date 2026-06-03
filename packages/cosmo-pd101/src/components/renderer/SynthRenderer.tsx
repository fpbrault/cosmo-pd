import {
	type CSSProperties,
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import SynthSidebar from "@/components/layout/SynthSidebar";
import SynthHeader from "@/components/preset/SynthHeader";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { PresetManagerProvider } from "@/context/PresetManagerContext";
import { ScopeProvider } from "@/context/ScopeContext";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import { SynthParamControllerProvider } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { useSynthPresetManager } from "@/features/synth/useSynthPresetManager";
import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";
import { installBenchmarkApi } from "@/lib/performance/benchmarkHarness";
import { convertDecodedPatchToSynthPreset } from "@/lib/synth/czPresetConverter";
import { FACTORY_PRESETS } from "@/lib/synth/factoryCzPresets";
import { HoverInfoProvider, useHoverInfo } from "../layout/HoverInfo";
import { useAudioLevelMonitor } from "./hooks/useAudioLevelMonitor";
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
	runtime: SynthRuntime;
	libraryPresets?: LibraryPreset[];
	onAudioLevelChange?: (level: number) => void;
	disableAudioGate?: boolean;
	miniKeyboard?: MiniKeyboardProps;
	onInitPresetSession?: (
		syncBuiltinSelection: (
			name: string,
			options?: { isDirty?: boolean },
		) => void,
	) => void;
	onPresetSessionChange?: (session: {
		activePresetId: string | null;
		activePresetNameBase: string;
		isDirty: boolean;
	}) => void;
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
	runtime,
	libraryPresets = FACTORY_PRESETS,
	onAudioLevelChange,
	disableAudioGate = false,
	sidebarMinWidthRem = 18,
	miniKeyboard,
	onInitPresetSession,
	onPresetSessionChange,
}: SynthRendererProps) {
	const gatherPresetState = useSynthStore((s) => s.gatherPresetState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
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

	const activeNotes = miniKeyboard?.activeNotes ?? runtime.activeNotes;
	const sendNoteOn = miniKeyboard?.onNoteOn ?? runtime.sendNoteOn;
	const sendNoteOff = miniKeyboard?.onNoteOff ?? runtime.sendNoteOff;
	const sendPolyAftertouch =
		miniKeyboard?.onPolyAftertouch ?? runtime.sendPolyAftertouch;
	const panic = runtime.panic;
	const _hasActiveNotes = activeNotes.length > 0;

	useAudioLevelMonitor(runtime.analyserNodeRef, onAudioLevelChange);

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
		allPresetEntries,
		visiblePresetEntries,
		activePresetId,
		activePresetName,
		activePresetNameBase,
		handleLoadLocal,
		handleLoadPresetByName,
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
		handleSyncPresetSelection,
		isPresetDirty,
	} = useSynthPresetManager({
		gatherPresetState,
		applyPreset,
		onBeforeApplyPreset: panic,
		libraryPresets,
		onLoadLibraryPreset: handleLoadLibraryPreset,
	});

	useEffect(() => {
		const presetNames = libraryPresets.map((preset) => preset.name);
		return installBenchmarkApi({
			mode: runtime.benchmark.mode,
			listBuiltinPresets: () => presetNames,
			loadBuiltinPreset: (name: string) => {
				handleLoadPresetByName(name);
			},
			setPerformanceMonitorEnabled:
				runtime.benchmark.setPerformanceMonitorEnabled,
			getPerformanceMetrics: runtime.benchmark.getPerformanceMetrics,
			noteOn: (note: number, velocity?: number) => sendNoteOn(note, velocity),
			noteOff: (note: number) => sendNoteOff(note),
			panic,
			ensureReady: runtime.benchmark.ensureReady,
		});
	}, [
		handleLoadPresetByName,
		libraryPresets,
		panic,
		runtime.benchmark.ensureReady,
		runtime.benchmark.getPerformanceMetrics,
		runtime.benchmark.setPerformanceMonitorEnabled,
		sendNoteOff,
		sendNoteOn,
		runtime.benchmark.mode,
	]);

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
		onInitPresetSession?.(handleSyncPresetSelection);
	}, [handleSyncPresetSelection, onInitPresetSession]);

	useEffect(() => {
		onPresetSessionChange?.({
			activePresetId,
			activePresetNameBase,
			isDirty: isPresetDirty,
		});
	}, [
		activePresetId,
		activePresetNameBase,
		isPresetDirty,
		onPresetSessionChange,
	]);

	const handleStepPresetInVisibleOrder = useCallback(
		(direction: -1 | 1) => {
			const entries = libraryVisibleEntries;
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
			if (entry.preset) {
				handleLoadLibrary(entry.preset);
				return;
			}
			handleLoadPresetByName(entry.label);
		},
		[
			libraryVisibleEntries,
			activePresetId,
			handleLoadLocal,
			handleLoadLibrary,
			handleLoadPresetByName,
		],
	);

	const audioGate = {
		ready: disableAudioGate || runtime.audioContextState === "running",
		onResume: runtime.resumeAudio,
	};

	return (
		<HoverInfoProvider>
			<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
				<SynthParamControllerProvider>
					<ScopeProvider
						analyserNodeRef={runtime.analyserNodeRef}
						audioCtxRef={runtime.audioCtxRef}
						effectivePitchHz={runtime.effectivePitchHz}
						subscribeScopeFrames={runtime.subscribeScopeFrames}
					>
						<PresetManagerProvider
							value={{
								allPresetEntries,
								visiblePresetEntries: libraryVisibleEntries,
								activePresetId,
								activePresetName,
								handleLoadPresetByName,
								handleLoadLocal,
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
