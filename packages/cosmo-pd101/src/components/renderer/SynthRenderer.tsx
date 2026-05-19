import { AnimatePresence, motion } from "motion/react";
import {
	type CSSProperties,
	memo,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useState,
} from "react";
import logoSrc from "@/assets/logo.png";
import Button from "@/components/controls/Button";
import LineSelectControl from "@/components/controls/LineSelectControl";
import ModModeControl from "@/components/controls/ModModeControl";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import type { EnvOverrideHandlers } from "@/components/editor/PhaseLinesSection";
import PhaseLinesSection from "@/components/editor/PhaseLinesSection";
import SynthSidebar from "@/components/layout/SynthSidebar";
import FxConsoleDrawer from "@/components/panels/drawers/FxConsoleDrawer";
import ModConsoleDrawer from "@/components/panels/drawers/ModConsoleDrawer";
import GlobalVoicePanel from "@/components/panels/voice/GlobalVoicePanel";
import PresetLibrary from "@/components/preset/PresetLibrary";
import SynthHeader, {
	type SynthHeaderProps,
} from "@/components/preset/SynthHeader";
import CzTabButton from "@/components/primitives/CzTabButton";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import { useMidiLearnBindings } from "@/features/synth/hooks/useMidiLearnBindings";
import {
	SynthParamControllerProvider,
	useSynthParam,
} from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { HoverInfoProvider, useHoverInfo } from "../layout/HoverInfo";
import MiniKeyboardOverlay from "../layout/MiniKeyboardOverlay";
import SynthInfoBar from "../layout/SynthInfoBar";
import { ScopeDrawerDisplay } from "../panels/analysis/ScopeDisplay";

const MemoPresetLibrary = memo(PresetLibrary);

const DRAWER_SLIDE_TRANSITION = {
	type: "spring",
	stiffness: 220,
	damping: 30,
	mass: 1,
} as const;

const LIBRARY_SLIDE_TRANSITION = {
	type: "spring",
	stiffness: 520,
	damping: 60,
	mass: 1,
} as const;

type DrawerPanel = "fx" | "mod" | "display";

const DRAWER_PANEL_ORDER: Record<DrawerPanel, number> = {
	fx: 0,
	mod: 1,
	display: 2,
};

const DRAWER_PANELS: DrawerPanel[] = ["fx", "mod", "display"];

function isDrawerPanel(mode: string): mode is DrawerPanel {
	return DRAWER_PANELS.includes(mode as DrawerPanel);
}

function getDrawerOffset(
	panel: DrawerPanel,
	activePanel: DrawerPanel,
	direction: 1 | -1,
): "0%" | "100%" | "-100%" {
	if (panel === activePanel) {
		return "0%";
	}

	const panelOrder = DRAWER_PANEL_ORDER[panel];
	const activeOrder = DRAWER_PANEL_ORDER[activePanel];
	if (panelOrder > activeOrder) {
		return direction === 1 ? "100%" : "-100%";
	}

	return direction === 1 ? "-100%" : "100%";
}

type SynthRendererProps = {
	headerProps: SynthHeaderProps;
	frameClassName: string;
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	effectivePitchHz: number;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	subscribeScopeFrames?: (
		onFrame: (frame: {
			samples: Float32Array;
			sampleRate: number;
			hz: number;
		}) => void,
	) => () => void;
	envOverrideHandlers?: EnvOverrideHandlers;
	miniKeyboard?: {
		activeNotes: number[];
		onNoteOn: (note: number, velocity?: number) => void;
		onNoteOff: (note: number) => void;
		onPolyAftertouch?: (note: number, value: number) => void;
	};
	/** When provided, shows an overlay asking the user to start audio. */
	audioGate?: {
		ready: boolean;
		onResume: () => void;
	};
};

const SynthRenderer = memo(function SynthRenderer({
	headerProps,
	frameClassName,
	frameStyle,
	headerExtra,
	bottomBarExtra,
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	subscribeScopeFrames,
	envOverrideHandlers,
	miniKeyboard,
	audioGate,
}: SynthRendererProps) {
	return (
		<HoverInfoProvider>
			<SynthRendererContent
				headerProps={headerProps}
				frameClassName={frameClassName}
				frameStyle={frameStyle}
				headerExtra={headerExtra}
				bottomBarExtra={bottomBarExtra}
				effectivePitchHz={effectivePitchHz}
				analyserNodeRef={analyserNodeRef}
				audioCtxRef={audioCtxRef}
				subscribeScopeFrames={subscribeScopeFrames}
				envOverrideHandlers={envOverrideHandlers}
				miniKeyboard={miniKeyboard}
				audioGate={audioGate}
			/>
		</HoverInfoProvider>
	);
});

export default SynthRenderer;

function SynthRendererContent({
	headerProps,
	frameClassName,
	frameStyle,
	headerExtra,
	bottomBarExtra,
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	subscribeScopeFrames,
	envOverrideHandlers,
	miniKeyboard,
	audioGate,
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
	const { infoText } = useHoverInfo();
	useMidiLearnBindings();
	const drawerOpen = isDrawerPanel(mainPanelMode);
	const waveDrawerOpen = mainPanelMode === "display";
	const [activeDrawerPanel, setActiveDrawerPanel] = useState<DrawerPanel>(
		isDrawerPanel(mainPanelMode) ? mainPanelMode : "fx",
	);
	const [drawerSlideDirection, setDrawerSlideDirection] = useState<1 | -1>(1);
	const [brandInfoOpen, setBrandInfoOpen] = useState(false);
	const [globalPanelOpen, setGlobalPanelOpen] = useState(false);
	const [midiLearnOpen, setMidiLearnOpen] = useState(false);
	const [macroLabelEditorOpen, setMacroLabelEditorOpen] = useState(false);
	const [keyboardSettingsOpen, setKeyboardSettingsOpen] = useState(false);
	const [libraryVisibleEntries, setLibraryVisibleEntries] = useState<
		PresetEntry[]
	>(headerProps.allEntries);

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
		if (!isDrawerPanel(mainPanelMode)) {
			return;
		}
		if (mainPanelMode === activeDrawerPanel) {
			return;
		}

		setDrawerSlideDirection(
			DRAWER_PANEL_ORDER[mainPanelMode] > DRAWER_PANEL_ORDER[activeDrawerPanel]
				? 1
				: -1,
		);
		setActiveDrawerPanel(mainPanelMode);
	}, [mainPanelMode, activeDrawerPanel]);

	useEffect(() => {
		setLibraryVisibleEntries(headerProps.allEntries);
	}, [headerProps.allEntries]);

	const handleStepPresetInVisibleOrder = useCallback(
		(direction: -1 | 1) => {
			const entries =
				libraryVisibleEntries.length > 0
					? libraryVisibleEntries
					: headerProps.allEntries;
			if (entries.length === 0) {
				return;
			}

			const currentIndex = entries.findIndex(
				(entry) => entry.id === headerProps.activeEntryId,
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
				headerProps.onLoadLocal(entry.id);
				return;
			}
			if (entry.type === "builtin") {
				headerProps.onLoadBuiltin(entry.label);
				return;
			}
			if (entry.preset) {
				headerProps.onLoadLibrary(entry.preset);
			}
		},
		[headerProps, libraryVisibleEntries],
	);

	return (
		<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
			<SynthParamControllerProvider>
				<div
					data-theme="cz101"
					className={`${frameClassName} relative select-none`}
					style={frameStyleWithPanelInset}
				>
					<div className="pointer-events-none absolute inset-0" />
					<div className="pointer-events-none absolute inset-x-0 top-[5.8rem] bottom-10" />
					<div className="relative z-30">
						<SynthHeader
							{...headerProps}
							onStepPreset={handleStepPresetInVisibleOrder}
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
							subscribeScopeFrames={subscribeScopeFrames}
							waveDrawerOpen={waveDrawerOpen}
							libraryModeOpen={libraryModeOpen}
							globalOpen={globalPanelOpen}
							onOpenGlobal={() => setGlobalPanelOpen(true)}
							midiLearnOpen={midiLearnOpen}
							onOpenMidiLearn={() => setMidiLearnOpen((value) => !value)}
							onOpenMacroLabels={() => setMacroLabelEditorOpen(true)}
						/>

						<main className="flex min-h-0 w-full min-w-0 overflow-y-auto overflow-x-hidden">
							<div className="mx-auto flex min-h-0 w-full flex-1 flex-col rounded-[1.2rem]">
								<div className="pointer-events-none absolute inset-x-4 top-0 h-12 rounded-t-[1.2rem] opacity-70" />
								<div className="relative shrink-0 rounded-md border border-cz-border bg-cz-body px-3 shadow-inner">
									<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
										<div className="flex items-center">
											<MasterVolumeControl />
											<div className="divider divider-horizontal py-2"></div>
											<div className="flex items-end gap-2">
												<CzTabButton
													active={mainPanelMode === "phase"}
													onClick={() => {
														setMainPanelMode("phase");
													}}
													topLabel="Main"
													bottomLabel=""
													color="red"
													width={48}
													tooltip="Show phase editor controls."
												></CzTabButton>
												<CzTabButton
													active={mainPanelMode === "fx"}
													onClick={() => {
														const nextMode =
															mainPanelMode === "fx" ? "phase" : "fx";
														setMainPanelMode(nextMode);
													}}
													topLabel="FX"
													bottomLabel=""
													width={48}
													color="blue"
													tooltip="Toggle FX console drawer."
												></CzTabButton>
												<CzTabButton
													active={mainPanelMode === "mod"}
													onClick={() => {
														const nextMode =
															mainPanelMode === "mod" ? "phase" : "mod";
														setMainPanelMode(nextMode);
													}}
													topLabel="MOD"
													bottomLabel=""
													width={48}
													color="cyan"
													tooltip="Toggle modulation console drawer."
												></CzTabButton>
												<CzTabButton
													active={mainPanelMode === "display"}
													onClick={() => {
														const nextMode =
															mainPanelMode === "display" ? "phase" : "display";
														setMainPanelMode(nextMode);
													}}
													topLabel="DISPLAY"
													bottomLabel=""
													width={48}
													color="grey"
													tooltip="Toggle full-size scope drawer."
												></CzTabButton>
											</div>
										</div>

										<div className="flex items-end">
											<LineSelectControl />
											<div className="divider divider-horizontal py-2"></div>
											<ModModeControl />
										</div>
									</div>
								</div>

								<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
									<div className="pointer-events-none absolute inset-0" />

									<PhaseLinesSection
										className="main-panel-fill min-h-0"
										envOverrideHandlers={envOverrideHandlers}
									/>
									<motion.div
										aria-hidden={!drawerOpen}
										initial={false}
										animate={{ y: drawerOpen ? 0 : "-100%" }}
										transition={DRAWER_SLIDE_TRANSITION}
										style={{ transformOrigin: "top center" }}
										className={`absolute inset-0 isolate z-40 origin-top overflow-hidden will-change-transform ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
									>
										<div className="relative flex h-full max-h-130 min-h-0 flex-col rounded-lg border border-cz-border bg-cz-body">
											<div className="pointer-events-none absolute inset-0 rounded-lg bg-white/5" />
											<div className="pointer-events-none absolute inset-x-0 top-0 h-14 rounded-t-lg opacity-60" />
											<div className="relative min-h-0 flex-1 overflow-hidden">
												{DRAWER_PANELS.map((panel) => (
													<motion.div
														key={panel}
														aria-hidden={activeDrawerPanel !== panel}
														initial={false}
														animate={{
															y: getDrawerOffset(
																panel,
																activeDrawerPanel,
																drawerSlideDirection,
															),
														}}
														transition={DRAWER_SLIDE_TRANSITION}
														className={`absolute inset-0 will-change-transform ${
															activeDrawerPanel === panel
																? "pointer-events-auto"
																: "pointer-events-none"
														}`}
													>
														{panel === "fx" &&
														drawerOpen &&
														activeDrawerPanel === panel ? (
															<FxConsoleDrawer />
														) : null}
														{panel === "mod" &&
														drawerOpen &&
														activeDrawerPanel === panel ? (
															<ModConsoleDrawer />
														) : null}
														{panel === "display" &&
														drawerOpen &&
														activeDrawerPanel === panel ? (
															<ScopeDrawerDisplay
																analyserNodeRef={analyserNodeRef}
																audioCtxRef={audioCtxRef}
																effectivePitchHz={effectivePitchHz}
																subscribeScopeFrames={subscribeScopeFrames}
															/>
														) : null}
													</motion.div>
												))}
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						</main>
					</div>
					<motion.div
						aria-hidden={!libraryModeOpen}
						initial={false}
						animate={{ y: libraryModeOpen ? 0 : "-120%" }}
						transition={LIBRARY_SLIDE_TRANSITION}
						style={{ transformOrigin: "top center" }}
						className={`absolute inset-x-0 top-18 bottom-10 z-20 flex min-h-0 origin-top flex-col overflow-hidden shadow-black shadow-lg will-change-transform ${libraryModeOpen ? "pointer-events-auto" : "pointer-events-none"}`}
					>
						<MemoPresetLibrary
							allEntries={headerProps.allEntries}
							activeEntryId={headerProps.activeEntryId}
							activePresetName={headerProps.activePresetName}
							onLoadLocal={headerProps.onLoadLocal}
							onLoadLibrary={headerProps.onLoadLibrary}
							onLoadBuiltin={headerProps.onLoadBuiltin}
							onSavePreset={headerProps.onSavePreset}
							onDeletePreset={headerProps.onDeletePreset}
							onRenamePreset={headerProps.onRenamePreset}
							onSetPresetAuthor={headerProps.onSetPresetAuthor}
							onSetPresetFavorite={headerProps.onSetPresetFavorite}
							onSetPresetTags={headerProps.onSetPresetTags}
							onExportPreset={headerProps.onExportPreset}
							onExportCurrentState={headerProps.onExportCurrentState}
							onImportPreset={headerProps.onImportPreset}
							onInitPreset={headerProps.onInitPreset}
							onVisibleEntriesChange={setLibraryVisibleEntries}
							onClose={handleCloseLibrary}
							isOpen={libraryModeOpen}
						/>
					</motion.div>
					<AudioStartOverlay audioGate={audioGate} />
					<SynthBrandInfoModal
						open={brandInfoOpen}
						onClose={() => setBrandInfoOpen(false)}
					/>
					<GlobalVoiceModal
						open={globalPanelOpen}
						onClose={() => setGlobalPanelOpen(false)}
					/>
					<MacroLabelEditorModal
						open={macroLabelEditorOpen}
						onClose={() => setMacroLabelEditorOpen(false)}
					/>

					<KeyboardSettingsModal
						open={keyboardSettingsOpen}
						onClose={() => setKeyboardSettingsOpen(false)}
					/>

					<PendingModifiedPresetModal
						pendingPresetChange={headerProps.pendingPresetChange}
						onSave={headerProps.onSavePendingPresetChange}
						onDiscard={headerProps.onDiscardPendingPresetChange}
						onCancel={headerProps.onCancelPendingPresetChange}
					/>
					{miniKeyboard && !libraryModeOpen ? (
						<MiniKeyboardOverlay
							activeNotes={miniKeyboard.activeNotes}
							visible={keyboardVisible}
							onNoteOn={miniKeyboard.onNoteOn}
							onNoteOff={miniKeyboard.onNoteOff}
							onPolyAftertouch={miniKeyboard.onPolyAftertouch}
						/>
					) : null}
					<SynthInfoBar
						infoText={infoText}
						bottomBarExtra={bottomBarExtra}
						showKeyboardToggle={Boolean(miniKeyboard) && !libraryModeOpen}
						keyboardVisible={keyboardVisible}
						onKeyboardToggle={() => setKeyboardVisible(!keyboardVisible)}
						onKeyboardSettingsClick={() => setKeyboardSettingsOpen(true)}
					/>
				</div>
			</SynthParamControllerProvider>
		</ModMatrixProvider>
	);
}

function MasterVolumeControl() {
	const { value: volume, setValue: setVolume } = useSynthParam("volume");

	return (
		<div className="shrink-0">
			<SynthParamKnob
				paramKey="volume"
				value={volume as number}
				size={64}
				onChange={setVolume}
				color="white"
				label="Main Volume"
				modDestination="volume"
			/>
		</div>
	);
}

function SynthBrandInfoModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	useEffect(() => {
		if (!open) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			onClose();
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="absolute inset-0 z-40 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label="Synthesizer lab information"
		>
			<button
				type="button"
				className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm"
				onClick={onClose}
				aria-label="Close synthesizer information"
			/>
			<div className="relative w-[min(32rem,94%)] rounded-md border border-cz-border bg-cz-surface p-5 text-cz-cream shadow-2xl">
				<div className="mb-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<img
							src={logoSrc}
							alt="Cosmo PD101 logo"
							className="h-16 w-16 rounded-md object-contain"
						/>
						<div>
							<p className="font-mono text-4xs text-cz-light-blue uppercase tracking-[0.3em]">
								Phase Distortion
							</p>
							<h3 className="mt-1 font-mono font-semibold text-cz-cream text-sm uppercase tracking-[0.18em]">
								Synthesizer Lab
							</h3>
						</div>
					</div>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
						onClick={onClose}
					>
						Close
					</Button>
				</div>

				<div className="space-y-2 rounded-md border border-cz-border bg-cz-inset/60 p-4">
					<p className="font-mono text-cz-cream text-xs">Felix Perron-Brault</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						Version: 0.1.0
					</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						Year: 2026
					</p>
					<p className="pt-2 text-cz-gold text-sm">
						For my cats, Basil, Lola, and Latte
					</p>
				</div>
			</div>
		</div>
	);
}

function GlobalVoiceModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Global Settings"
			ariaLabel="Global settings"
			widthClassName="w-[min(48rem,96%)]"
		>
			<div className="max-h-[72vh] overflow-y-auto rounded-md bg-cz-bg/35 p-2">
				<GlobalVoicePanel />
			</div>
		</SynthOverlayModal>
	);
}

function MacroLabelEditorModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const labels = useSynthStore((s) => s.macroLabels);
	const setMacroLabel = useSynthStore((s) => s.setMacroLabel);

	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Macro Labels"
			ariaLabel="Macro label editor"
			widthClassName="w-[min(30rem,94vw)]"
		>
			<div className="grid grid-cols-2 gap-2">
				{[0, 1, 2, 3].map((idx) => (
					<label
						key={`macro-label-editor-${idx}`}
						className="flex flex-col gap-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.12em]"
					>
						Macro {idx + 1}
						<input
							type="text"
							className="input input-sm w-full border-cz-border bg-cz-inset font-mono text-2xs text-cz-cream"
							maxLength={18}
							value={labels[idx]}
							onChange={(event) =>
								setMacroLabel(idx, event.currentTarget.value)
							}
						/>
					</label>
				))}
			</div>
		</SynthOverlayModal>
	);
}

function KeyboardSettingsModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const keyboardOctaves = useSynthUiStore((s) => s.keyboardOctaves);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const keyboardInputMode = useSynthUiStore((s) => s.keyboardInputMode);
	const setKeyboardOctaves = useSynthUiStore((s) => s.setKeyboardOctaves);
	const setKeyboardRange = useSynthUiStore((s) => s.setKeyboardRange);
	const setKeyboardInputMode = useSynthUiStore((s) => s.setKeyboardInputMode);

	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Keyboard Settings"
			ariaLabel="Keyboard settings"
			widthClassName="w-[min(26rem,94vw)]"
		>
			<div className="space-y-4">
				<div className="space-y-1.5">
					<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Octave Range
					</p>
					<div className="flex gap-1">
						{[-2, -1, 0, 1, 2].map((value) => (
							<Button
								key={`range-${value}`}
								type="button"
								onClick={() => setKeyboardRange(value)}
								className={`btn btn-sm flex-1 border text-xs ${
									keyboardRange === value
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								{value > 0 ? `+${value}` : `${value}`}
							</Button>
						))}
					</div>
				</div>
				<div className="space-y-1.5">
					<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Octaves
					</p>
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((value) => (
							<Button
								key={`octaves-${value}`}
								type="button"
								onClick={() => setKeyboardOctaves(value)}
								className={`btn btn-sm flex-1 border text-xs ${
									keyboardOctaves === value
										? "border-cz-gold bg-cz-gold/10 text-cz-gold"
										: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
								}`}
							>
								{value}
							</Button>
						))}
					</div>
				</div>
				<div className="space-y-1.5">
					<p className="font-mono text-3xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Key Touch
					</p>
					<div className="flex gap-1">
						<Button
							type="button"
							onClick={() => setKeyboardInputMode("velocity")}
							className={`btn btn-sm flex-1 border text-xs ${
								keyboardInputMode === "velocity"
									? "border-cz-gold bg-cz-gold/10 text-cz-gold"
									: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
							}`}
						>
							Velocity
						</Button>
						<Button
							type="button"
							onClick={() => setKeyboardInputMode("aftertouch")}
							className={`btn btn-sm flex-1 border text-xs ${
								keyboardInputMode === "aftertouch"
									? "border-cz-gold bg-cz-gold/10 text-cz-gold"
									: "border-cz-border bg-cz-inset text-cz-cream/70 hover:text-cz-cream"
							}`}
						>
							Aftertouch
						</Button>
					</div>
					<p className="pt-1 font-mono text-4xs text-cz-cream-dim/60">
						{keyboardInputMode === "velocity"
							? "Press position on key sets velocity. Top = 127, bottom = 1."
							: "Note-on uses default velocity. Drag up after pressing for aftertouch."}
					</p>
				</div>
			</div>
		</SynthOverlayModal>
	);
}

function SynthOverlayModal({
	open,
	onClose,
	title,
	ariaLabel,
	widthClassName,
	children,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	ariaLabel: string;
	widthClassName: string;
	children: ReactNode;
}) {
	useEffect(() => {
		if (!open) return;
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			onClose();
		};
		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="absolute inset-0 z-45 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel}
		>
			<button
				type="button"
				className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm"
				onClick={onClose}
				aria-label={`Close ${ariaLabel}`}
			/>
			<div
				className={`relative rounded-md border border-cz-border bg-cz-surface p-4 shadow-2xl ${widthClassName}`}
			>
				<div className="mb-2 flex items-center justify-between px-1">
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.18em]">
						{title}
					</p>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
						onClick={onClose}
					>
						Close
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}

type PendingModifiedPresetModalProps = {
	pendingPresetChange: SynthHeaderProps["pendingPresetChange"];
	onSave?: (name?: string) => void;
	onDiscard?: () => void;
	onCancel?: () => void;
};

function PendingModifiedPresetModal({
	pendingPresetChange,
	onSave,
	onDiscard,
	onCancel,
}: PendingModifiedPresetModalProps) {
	const [pendingSaveName, setPendingSaveName] = useState("");
	const open = pendingPresetChange !== null;

	useEffect(() => {
		if (!pendingPresetChange) return;
		setPendingSaveName(pendingPresetChange.suggestedName);
	}, [pendingPresetChange]);

	return (
		<SynthOverlayModal
			open={open}
			onClose={() => onCancel?.()}
			title="Save Modified Preset"
			ariaLabel="Save modified preset"
			widthClassName="w-[min(36rem,94vw)]"
		>
			<div className="space-y-4 text-cz-cream">
				<p className="text-cz-cream-dim text-sm">
					{pendingPresetChange?.activePresetName} has unsaved changes.
				</p>
				{pendingPresetChange?.changes.length ? (
					<div className="rounded-md border border-cz-border bg-cz-inset/70 p-2">
						<p className="mb-2 font-mono text-3xs text-cz-light-blue uppercase tracking-[0.24em]">
							Changed Parameters ({pendingPresetChange.changes.length})
						</p>
						<ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
							{pendingPresetChange.changes.map((change) => (
								<li
									key={`${change.path}-${change.previous}-${change.next}`}
									className="rounded border border-cz-border/60 bg-black/20 px-2 py-1 text-[0.7rem] leading-tight"
								>
									<p className="font-mono text-cz-cream">{change.path}</p>
									<p className="font-mono text-cz-cream-dim">
										{change.previous} → {change.next}
									</p>
								</li>
							))}
						</ul>
					</div>
				) : null}
				{pendingPresetChange?.activeLocalName ? null : (
					<input
						type="text"
						className="input w-full border-cz-border bg-cz-inset text-cz-cream"
						placeholder="Preset name"
						value={pendingSaveName}
						onChange={(event) => setPendingSaveName(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && pendingSaveName.trim()) {
								onSave?.(pendingSaveName);
							}
						}}
					/>
				)}
				<div className="flex justify-end gap-2 pt-1">
					<Button
						type="button"
						className="btn border-cz-border bg-cz-inset text-cz-cream"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						type="button"
						className="btn border-cz-border bg-cz-inset text-cz-cream"
						onClick={onDiscard}
					>
						Discard
					</Button>
					<Button
						type="button"
						className="btn btn-primary"
						aria-label="Save modified preset"
						disabled={
							!pendingPresetChange?.activeLocalName && !pendingSaveName.trim()
						}
						onClick={() => onSave?.(pendingSaveName)}
					>
						Save
					</Button>
				</div>
			</div>
		</SynthOverlayModal>
	);
}

function AudioStartOverlay({
	audioGate,
}: {
	audioGate?: SynthRendererProps["audioGate"];
}) {
	if (!audioGate || audioGate.ready) return null;
	return (
		<AnimatePresence>
			<motion.div
				key="audio-start-overlay"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="absolute inset-0 z-50 flex items-center justify-center"
				role="dialog"
				aria-modal="true"
				aria-label="Start audio"
			>
				<div className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm" />
				<div className="relative flex flex-col items-center gap-4 rounded-md border border-cz-border bg-cz-surface px-8 py-6 text-cz-cream shadow-2xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-8 w-8 opacity-70"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.342 1.241 1.519 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
						<path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.061Z" />
					</svg>
					<p className="font-mono text-cz-cream-dim text-sm">
						Audio requires a user interaction to start.
					</p>
					<Button
						type="button"
						autoFocus
						className="btn btn-primary"
						onClick={audioGate.onResume}
					>
						Start Audio
					</Button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
