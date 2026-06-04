import {
	type CSSProperties,
	memo,
	type ReactNode,
	useCallback,
	useEffect,
} from "react";
import SynthSidebar from "@/components/layout/SynthSidebar";
import SynthHeader from "@/components/preset/SynthHeader";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { usePresetManager } from "@/context/PresetManagerContext";
import { ScopeProvider } from "@/context/ScopeContext";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import { SynthParamControllerProvider } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { installBenchmarkApi } from "@/lib/performance/benchmarkHarness";
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
	onAudioLevelChange?: (level: number) => void;
	disableAudioGate?: boolean;
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
	runtime,
	onAudioLevelChange,
	disableAudioGate = false,
	sidebarMinWidthRem = 18,
	miniKeyboard,
}: SynthRendererProps) {
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
	const {
		allPresetEntries,
		activatePreset,
		stepPreset,
		setNavigationEntryIds,
	} = usePresetManager();

	useAudioLevelMonitor(runtime.analyserNodeRef, onAudioLevelChange);

	useEffect(() => {
		const presetNames = allPresetEntries.map((preset) => preset.label);
		return installBenchmarkApi({
			mode: runtime.benchmark.mode,
			listBuiltinPresets: () => presetNames,
			loadBuiltinPreset: (name: string) => {
				const entry = allPresetEntries.find((preset) => preset.label === name);
				if (!entry) {
					return;
				}
				void activatePreset({ entryId: entry.id });
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
		allPresetEntries,
		activatePreset,
		panic,
		runtime.benchmark.ensureReady,
		runtime.benchmark.getPerformanceMetrics,
		runtime.benchmark.setPerformanceMonitorEnabled,
		sendNoteOff,
		sendNoteOn,
		runtime.benchmark.mode,
	]);

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
						<div
							data-theme="cosmo"
							className={`${FRAME_CLASS} relative select-none`}
							style={frameStyleWithPanelInset}
						>
							<div className="relative z-30">
								<SynthHeader
									onStepPreset={(direction) => {
										void stepPreset(direction);
									}}
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
								onNavigationEntriesChange={setNavigationEntryIds}
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
					</ScopeProvider>
				</SynthParamControllerProvider>
			</ModMatrixProvider>
		</HoverInfoProvider>
	);
});

export default SynthRenderer;
export const SharedPhaseDistortionVisualizer = SynthRenderer;
