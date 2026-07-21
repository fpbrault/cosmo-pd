import {
	type CSSProperties,
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import MiniKeyboardOverlay from "@/components/layout/MiniKeyboardOverlay";
import SynthInfoBar from "@/components/layout/SynthInfoBar";
import SynthSidebar from "@/components/layout/SynthSidebar";
import MacroKnobsPanel from "@/components/panels/macro/MacroKnobsPanel";
import SynthHeader from "@/components/preset/SynthHeader";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { usePresetManager } from "@/context/PresetManagerContext";
import { ScopeProvider } from "@/context/ScopeContext";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import { SynthParamControllerProvider } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { HoverInfoProvider, useHoverInfo } from "../layout/HoverInfo";
import { useAudioLevelMonitor } from "./hooks/useAudioLevelMonitor";
import SynthRendererLibraryOverlay from "./SynthRendererLibraryOverlay";
import SynthRendererMainPanel from "./SynthRendererMainPanel";
import SynthRendererOverlays from "./SynthRendererOverlays";

type MiniKeyboardProps = {
	activeNotes: number[];
	pitchBend: number;
	modWheel: number;
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
	onPitchBend: (value: number) => void;
	onModWheel: (value: number) => void;
	onPolyAftertouch: (note: number, pressure: number) => void;
};

export type SynthRendererProps = {
	appVersion: string;
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	keyboardSettingsExtra?: ReactNode;
	runtime: SynthRuntime;
	onAudioLevelChange?: (level: number) => void;
	disableAudioGate?: boolean;
	miniKeyboard?: MiniKeyboardProps;
};

const RESIZE_HANDLE_HORIZONTAL =
	"group relative flex w-3 shrink-0 items-center justify-center transition-colors hover:bg-cz-light-blue/30 rounded-2xl bg-cz-border my-1 mx-0.5";
const RESIZE_HANDLE_VERTICAL =
	"group relative flex h-2 shrink-0 items-center justify-center transition-colors hover:bg-cz-light-blue/30 rounded-2xl bg-cz-border mx-1 my-0.5";

const SynthRenderer = memo(function SynthRenderer({
	appVersion,
	frameStyle,
	headerExtra,
	bottomBarExtra,
	keyboardSettingsExtra,
	runtime,
	onAudioLevelChange,
	disableAudioGate = false,
	miniKeyboard,
}: SynthRendererProps) {
	const modMatrix = useSynthStore((s) => s.modMatrix);
	const setModMatrix = useSynthStore((s) => s.setModMatrix);

	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const setMainPanelMode = useSynthUiStore((s) => s.setMainPanelMode);
	const keyboardVisible = useSynthUiStore((s) => s.keyboardVisible);
	const setKeyboardVisible = useSynthUiStore((s) => s.setKeyboardVisible);
	const libraryModeOpen = useSynthUiStore((s) => s.libraryModeOpen);
	const setLibraryModeOpen = useSynthUiStore((s) => s.setLibraryModeOpen);
	const setBrandInfoOpen = useSynthUiStore((s) => s.setBrandInfoOpen);

	const activeNotes = miniKeyboard?.activeNotes ?? runtime.activeNotes;
	const pitchBend = miniKeyboard?.pitchBend ?? runtime.pitchBend;
	const modWheel = miniKeyboard?.modWheel ?? runtime.modWheel;
	const sendNoteOn = miniKeyboard?.onNoteOn ?? runtime.sendNoteOn;
	const sendNoteOff = miniKeyboard?.onNoteOff ?? runtime.sendNoteOff;
	const sendPitchBend = miniKeyboard?.onPitchBend ?? runtime.sendPitchBend;
	const sendModWheel = miniKeyboard?.onModWheel ?? runtime.sendModWheel;
	const sendPolyAftertouch =
		miniKeyboard?.onPolyAftertouch ?? runtime.sendPolyAftertouch;
	const { stepPreset, setNavigationEntryIds } = usePresetManager();

	useAudioLevelMonitor(runtime.analyserNodeRef, onAudioLevelChange);

	const keyboardVisibleRef = useRef(keyboardVisible);
	keyboardVisibleRef.current = keyboardVisible;
	const keyboardPanelRef = usePanelRef();

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only sync
	useEffect(() => {
		if (!keyboardVisibleRef.current) {
			keyboardPanelRef.current?.collapse();
		}
	}, []);

	const handleKeyboardToggle = useCallback(() => {
		const panel = keyboardPanelRef.current;
		if (!panel) return;
		if (keyboardVisible) {
			panel.collapse();
		} else {
			panel.expand();
			panel.resize("23%");
		}
	}, [keyboardVisible, keyboardPanelRef]);

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
						scopePerformanceMode={runtime.scopePerformanceMode}
						subscribeScopeFrames={runtime.subscribeScopeFrames}
					>
						<div
							data-theme="cosmo"
							className="relative flex h-full min-h-0 w-full min-w-0 select-none flex-col overflow-hidden bg-cz-panel"
							style={frameStyle}
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

							<Group
								orientation="horizontal"
								className="z-10 min-h-0 flex-1 gap-0 overflow-hidden bg-cz-surface px-1"
							>
								<Panel
									defaultSize="23%"
									minSize="23%"
									maxSize="30%"
									collapsible
								>
									<div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.15rem] border border-cz-border/80 bg-cz-inset p-2 shadow-lg">
										<Group
											orientation="vertical"
											className="h-full min-h-0 flex-1 gap-0"
										>
											<Panel minSize="40%">
												<SynthSidebar />
											</Panel>
											<Separator className={RESIZE_HANDLE_VERTICAL}>
												<div className="h-1 w-12 rounded-full bg-cz-light-blue/20 transition-colors group-hover:bg-cz-light-blue/60" />
											</Separator>
											<Panel defaultSize="25%" minSize="15%" maxSize="30%">
												<MacroKnobsPanel />
											</Panel>
										</Group>
									</div>
								</Panel>
								<Separator className={RESIZE_HANDLE_HORIZONTAL}>
									<div className="h-12 w-1 rounded-full bg-cz-light-blue/20 transition-colors group-hover:bg-cz-light-blue/60" />
								</Separator>
								<Panel minSize="50%">
									<Group
										orientation="vertical"
										className="h-full min-h-0 gap-0"
									>
										<Panel minSize="30%">
											<SynthRendererMainPanel
												mainPanelMode={mainPanelMode}
												setMainPanelMode={setMainPanelMode}
											/>
										</Panel>
										<Separator className={RESIZE_HANDLE_VERTICAL}>
											<div className="h-1 w-12 rounded-full bg-cz-light-blue/20 transition-colors group-hover:bg-cz-light-blue/60" />
										</Separator>
										<Panel
											collapsible
											collapsedSize="0%"
											defaultSize="23%"
											minSize="22%"
											maxSize="30%"
											panelRef={keyboardPanelRef}
											onResize={(_size, _id, prevSize) => {
												if (prevSize === undefined) return;
												const size = _size.asPercentage;
												const prev = prevSize.asPercentage;
												if (size === 0 && prev > 0) {
													if (keyboardVisibleRef.current)
														setKeyboardVisible(false);
												} else if (size > 0 && prev === 0) {
													if (!keyboardVisibleRef.current)
														setKeyboardVisible(true);
												}
											}}
										>
											{keyboardVisible && !libraryModeOpen ? (
												<MiniKeyboardOverlay
													activeNotes={activeNotes}
													pitchBend={pitchBend}
													modWheel={modWheel}
													onNoteOn={sendNoteOn}
													onNoteOff={sendNoteOff}
													onPitchBend={sendPitchBend}
													onModWheel={sendModWheel}
													onPolyAftertouch={sendPolyAftertouch}
												/>
											) : null}
										</Panel>
									</Group>
								</Panel>
							</Group>

							<SynthRendererLibraryOverlay
								isOpen={libraryModeOpen}
								onNavigationEntriesChange={setNavigationEntryIds}
								onClose={handleCloseLibrary}
							/>

							<SynthBottomSection
								appVersion={appVersion}
								audioGate={audioGate}
								bottomBarExtra={bottomBarExtra}
								keyboardSettingsExtra={keyboardSettingsExtra}
								keyboardVisible={keyboardVisible}
								onKeyboardToggle={handleKeyboardToggle}
							/>
						</div>
					</ScopeProvider>
				</SynthParamControllerProvider>
			</ModMatrixProvider>
		</HoverInfoProvider>
	);
});

type SynthBottomSectionProps = {
	appVersion: string;
	audioGate: { ready: boolean; onResume: () => void };
	bottomBarExtra?: ReactNode;
	keyboardSettingsExtra?: ReactNode;
	keyboardVisible: boolean;
	onKeyboardToggle: () => void;
};

function SynthBottomSection({
	appVersion,
	audioGate,
	bottomBarExtra,
	keyboardSettingsExtra,
	keyboardVisible,
	onKeyboardToggle,
}: SynthBottomSectionProps) {
	const { infoText } = useHoverInfo();

	return (
		<>
			<SynthInfoBar
				infoText={infoText}
				bottomBarExtra={bottomBarExtra}
				keyboardSettingsExtra={keyboardSettingsExtra}
				showKeyboardToggle
				keyboardVisible={keyboardVisible}
				onKeyboardToggle={onKeyboardToggle}
			/>
			<SynthRendererOverlays appVersion={appVersion} audioGate={audioGate} />
		</>
	);
}

export default SynthRenderer;
export const SharedSynthRenderer = SynthRenderer;
