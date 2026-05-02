import { AnimatePresence, motion } from "motion/react";
import {
	type CSSProperties,
	memo,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Button from "@/components/controls/Button";
import LineSelectControl from "@/components/controls/LineSelectControl";
import ModModeControl from "@/components/controls/ModModeControl";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import type { EnvOverrideHandlers } from "@/components/editor/PhaseLinesSection";
import PhaseLinesSection from "@/components/editor/PhaseLinesSection";
import type { AsidePanelTab } from "@/components/layout/AsidePanelSwitcher";
import AsidePanelSwitcher from "@/components/layout/AsidePanelSwitcher";
import ScopePanel, {
	ScopeMiniDisplay,
} from "@/components/panels/analysis/ScopePanel";
import FxConsoleDrawer from "@/components/panels/drawers/FxConsoleDrawer";
import ModConsoleDrawer from "@/components/panels/drawers/ModConsoleDrawer";
import { FX_SLOT_PANELS } from "@/components/panels/fx/FxSlotPanel";
import GlobalVoicePanel from "@/components/panels/voice/GlobalVoicePanel";
import PresetLibrary from "@/components/preset/PresetLibrary";
import SynthHeader, {
	type SynthHeaderProps,
} from "@/components/preset/SynthHeader";
import CzTabButton from "@/components/primitives/CzTabButton";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import {
	SynthParamControllerProvider,
	useSynthParam,
} from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

import { HoverInfoProvider, useHoverInfo } from "../layout/HoverInfo";
import MiniKeyboardOverlay from "../layout/MiniKeyboardOverlay";
import SynthInfoBar from "../layout/SynthInfoBar";

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

type SynthRendererProps = {
	headerProps: SynthHeaderProps;
	frameClassName: string;
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	lcdPrimaryText: string;
	lcdSecondaryText: string;
	lcdTransientReadout?: {
		label: string;
		value: string;
	} | null;
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
	activeAsidePanel: AsidePanelTab;
	onAsidePanelChange: (tab: AsidePanelTab) => void;
	envOverrideHandlers?: EnvOverrideHandlers;
	onControlReadout?: (key: string, value: string | number | boolean) => void;
	miniKeyboard?: {
		activeNotes: number[];
		onNoteOn: (note: number, velocity?: number) => void;
		onNoteOff: (note: number) => void;
	};
	/** When provided, shows an overlay asking the user to start audio. */
	audioGate?: {
		ready: boolean;
		onResume: () => void;
	};
};

export default function SynthRenderer({
	headerProps,
	frameClassName,
	frameStyle,
	headerExtra,
	bottomBarExtra,
	lcdPrimaryText,
	lcdSecondaryText,
	lcdTransientReadout = null,
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	subscribeScopeFrames,
	activeAsidePanel,
	onAsidePanelChange,
	envOverrideHandlers,
	onControlReadout,
	miniKeyboard,
	audioGate,
}: SynthRendererProps) {
	return (
		<HoverInfoProvider externalReadout={lcdTransientReadout}>
			<SynthRendererContent
				headerProps={headerProps}
				frameClassName={frameClassName}
				frameStyle={frameStyle}
				headerExtra={headerExtra}
				bottomBarExtra={bottomBarExtra}
				lcdPrimaryText={lcdPrimaryText}
				lcdSecondaryText={lcdSecondaryText}
				lcdTransientReadout={lcdTransientReadout}
				effectivePitchHz={effectivePitchHz}
				analyserNodeRef={analyserNodeRef}
				audioCtxRef={audioCtxRef}
				subscribeScopeFrames={subscribeScopeFrames}
				activeAsidePanel={activeAsidePanel}
				onAsidePanelChange={onAsidePanelChange}
				envOverrideHandlers={envOverrideHandlers}
				onControlReadout={onControlReadout}
				miniKeyboard={miniKeyboard}
				audioGate={audioGate}
			/>
		</HoverInfoProvider>
	);
}

function SynthRendererContent({
	headerProps,
	frameClassName,
	frameStyle,
	headerExtra,
	bottomBarExtra,
	lcdPrimaryText: _lcdPrimaryText,
	lcdSecondaryText: _lcdSecondaryText,
	effectivePitchHz,
	analyserNodeRef,
	audioCtxRef,
	subscribeScopeFrames,
	activeAsidePanel,
	onAsidePanelChange,
	envOverrideHandlers,
	onControlReadout,
	miniKeyboard,
	audioGate,
}: SynthRendererProps) {
	const modMatrix = useSynthStore((s) => s.modMatrix);
	const setModMatrix = useSynthStore((s) => s.setModMatrix);
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const setMainPanelMode = useSynthUiStore((s) => s.setMainPanelMode);
	const keyboardVisible = useSynthUiStore((s) => s.keyboardVisible);
	const setKeyboardVisible = useSynthUiStore((s) => s.setKeyboardVisible);
	const libraryModeOpen = useSynthUiStore((s) => s.libraryModeOpen);
	const setLibraryModeOpen = useSynthUiStore((s) => s.setLibraryModeOpen);
	const { infoText, setControlReadout } = useHoverInfo();
	const drawerOpen = mainPanelMode === "fx" || mainPanelMode === "mod";
	const [activeDrawerPanel, setActiveDrawerPanel] = useState<"fx" | "mod">(
		mainPanelMode === "mod" ? "mod" : "fx",
	);
	const [drawerSlideDirection, setDrawerSlideDirection] = useState<1 | -1>(1);
	const [brandInfoOpen, setBrandInfoOpen] = useState(false);
	const handleCloseLibrary = useCallback(() => {
		setLibraryModeOpen(false);
	}, [setLibraryModeOpen]);

	useEffect(() => {
		if (mainPanelMode !== "fx" && mainPanelMode !== "mod") {
			return;
		}
		if (mainPanelMode === activeDrawerPanel) {
			return;
		}

		setDrawerSlideDirection(
			activeDrawerPanel === "fx" && mainPanelMode === "mod" ? 1 : -1,
		);
		setActiveDrawerPanel(mainPanelMode);
	}, [mainPanelMode, activeDrawerPanel]);

	return (
		<ModMatrixProvider modMatrix={modMatrix} setModMatrix={setModMatrix}>
			<SynthParamControllerProvider onControlReadout={onControlReadout}>
				<div
					data-theme="cz101"
					className={`${frameClassName} relative select-none`}
					style={frameStyle}
				>
					<div className="pointer-events-none absolute inset-0" />
					<div className="pointer-events-none absolute inset-x-0 top-[5.8rem] bottom-10" />
					<div className="relative z-30">
						<SynthHeader
							{...headerProps}
							onBrandInfoClick={() => setBrandInfoOpen(true)}
							isLibraryModeOpen={libraryModeOpen}
							onLibraryModeChange={setLibraryModeOpen}
						/>
						{headerExtra}
					</div>
					<div className="relative z-10 px-1 flex flex-1 min-h-0 min-w-0 w-full gap-2 overflow-hidden">
						<aside className="overflow-y-auto min-h-0 rounded-[1.15rem] border border-cz-border/80 bg-cz-inset px-0 pb-2 shadow-lg [scrollbar-gutter:stable]">
							<div className="px-4 mt-4 mx-auto">
								<ScopeMiniDisplay
									analyserNodeRef={analyserNodeRef}
									audioCtxRef={audioCtxRef}
									effectivePitchHz={effectivePitchHz}
									subscribeScopeFrames={subscribeScopeFrames}
								/>
							</div>

							<AsidePanelSwitcher
								activeTab={activeAsidePanel}
								onTabChange={onAsidePanelChange}
							>
								<GlobalVoicePanel />
								<ScopePanel />
								{FX_SLOT_PANELS.map((Panel) => (
									<Panel key={Panel.panelId} />
								))}
							</AsidePanelSwitcher>
						</aside>

						<main className="flex min-h-0 min-w-0 overflow-y-auto overflow-x-hidden w-full max-w-4xl mx-auto">
							<div className="flex w-full  min-h-0 flex-1 flex-col rounded-[1.2rem] mx-auto">
								<div className="pointer-events-none absolute inset-x-4 top-0 h-12 rounded-t-[1.2rem] opacity-70" />
								<div className="relative shrink-0 rounded-md border border-cz-border bg-cz-body px-3 shadow-inner">
									<div className="flex flex-wrap justify-center gap-y-2 gap-x-4 items-center">
										<MasterVolumeControl />
										<LineSelectControl />

										<ModModeControl />

										<div className="flex items-end gap-2">
											<CzTabButton
												active={mainPanelMode === "phase"}
												onClick={() => {
													setMainPanelMode("phase");
													setControlReadout({
														label: "Main Panel",
														value: "PHASE",
													});
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
													setControlReadout({
														label: "Main Panel",
														value: nextMode.toUpperCase(),
													});
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
													setControlReadout({
														label: "Main Panel",
														value: nextMode.toUpperCase(),
													});
												}}
												topLabel="MOD"
												bottomLabel=""
												width={48}
												color="cyan"
												tooltip="Toggle modulation console drawer."
											></CzTabButton>
										</div>
									</div>
								</div>

								<div className="relative flex-1 min-h-0 min-w-0 overflow-hidden">
									<div className="pointer-events-none absolute inset-0" />
									<PhaseLinesSection
										className="h-full min-h-0 max-h-164"
										envOverrideHandlers={envOverrideHandlers}
									/>
									<motion.div
										aria-hidden={!drawerOpen}
										initial={false}
										animate={{ y: drawerOpen ? 0 : "-100%" }}
										transition={DRAWER_SLIDE_TRANSITION}
										style={{ transformOrigin: "top center" }}
										className={`absolute inset-0 z-10 origin-top overflow-hidden will-change-transform ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
									>
										<div className="relative flex h-full min-h-0 flex-col rounded-lg border border-cz-border bg-cz-body">
											<div className="pointer-events-none absolute inset-0 rounded-lg bg-white/5" />
											<div className="pointer-events-none absolute inset-x-0 top-0 h-14 rounded-t-lg opacity-60" />
											<div className="relative min-h-0 flex-1 overflow-hidden">
												<motion.div
													aria-hidden={activeDrawerPanel !== "fx"}
													initial={false}
													animate={{
														y:
															activeDrawerPanel === "fx"
																? "0%"
																: drawerSlideDirection === 1
																	? "-100%"
																	: "100%",
													}}
													transition={DRAWER_SLIDE_TRANSITION}
													className={`absolute inset-0 will-change-transform ${activeDrawerPanel === "fx" ? "pointer-events-auto" : "pointer-events-none"}`}
												>
													<FxConsoleDrawer />
												</motion.div>
												<motion.div
													aria-hidden={activeDrawerPanel !== "mod"}
													initial={false}
													animate={{
														y:
															activeDrawerPanel === "mod"
																? "0%"
																: drawerSlideDirection === 1
																	? "100%"
																	: "-100%",
													}}
													transition={DRAWER_SLIDE_TRANSITION}
													className={`absolute inset-0 will-change-transform ${activeDrawerPanel === "mod" ? "pointer-events-auto" : "pointer-events-none"}`}
												>
													<ModConsoleDrawer />
												</motion.div>
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
						animate={{ y: libraryModeOpen ? 0 : "-100%" }}
						transition={LIBRARY_SLIDE_TRANSITION}
						style={{ transformOrigin: "top center" }}
						className={`absolute inset-x-0 top-20 bottom-10 z-20 flex min-h-0 flex-col origin-top overflow-hidden shadow-lg shadow-black will-change-transform ${libraryModeOpen ? "pointer-events-auto" : "pointer-events-none"}`}
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
							onExportPreset={headerProps.onExportPreset}
							onExportCurrentState={headerProps.onExportCurrentState}
							onImportPreset={headerProps.onImportPreset}
							onInitPreset={headerProps.onInitPreset}
							onClose={handleCloseLibrary}
							isOpen={libraryModeOpen}
						/>
					</motion.div>
					<AudioStartOverlay audioGate={audioGate} />
					<SynthBrandInfoModal
						open={brandInfoOpen}
						onClose={() => setBrandInfoOpen(false)}
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
						/>
					) : null}
					<SynthInfoBar
						infoText={infoText}
						bottomBarExtra={bottomBarExtra}
						showKeyboardToggle={Boolean(miniKeyboard) && !libraryModeOpen}
						keyboardVisible={keyboardVisible}
						onKeyboardToggle={() => setKeyboardVisible(!keyboardVisible)}
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
				value={volume}
				onChange={setVolume}
				size={48}
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
						<div className="flex h-16 w-16 items-center justify-center rounded-md border border-cz-border bg-linear-to-br from-cz-light-blue/25 to-cz-gold/25 text-3xs font-mono uppercase tracking-[0.22em] text-cz-cream-dim">
							Logo
						</div>
						<div>
							<p className="text-4xs font-mono uppercase tracking-[0.3em] text-cz-light-blue">
								Phase Distortion
							</p>
							<h3 className="mt-1 text-sm font-mono font-semibold uppercase tracking-[0.18em] text-cz-cream">
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
					<p className="text-xs font-mono text-cz-cream">Felix Perron-Brault</p>
					<p className="text-2xs font-mono uppercase tracking-[0.14em] text-cz-cream-dim">
						Version: 0.1.0
					</p>
					<p className="text-2xs font-mono uppercase tracking-[0.14em] text-cz-cream-dim">
						Year: 2026
					</p>
					<p className="pt-2 text-sm text-cz-gold">
						For my cats, Basil, Lola, and Latte
					</p>
				</div>
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

	useEffect(() => {
		if (!pendingPresetChange) return;
		setPendingSaveName(pendingPresetChange.suggestedName);
	}, [pendingPresetChange]);

	return (
		<dialog
			className="modal"
			open={pendingPresetChange !== null}
			onCancel={(event) => {
				event.preventDefault();
				onCancel?.();
			}}
		>
			<div className="modal-box rounded-md border border-cz-border bg-cz-surface text-cz-cream">
				<h3 className="font-mono text-lg font-bold">Save modified preset?</h3>
				<p className="mt-3 text-sm text-cz-cream-dim">
					{pendingPresetChange?.activePresetName} has unsaved changes.
				</p>
				{pendingPresetChange?.changes.length ? (
					<div className="mt-4 rounded-md border border-cz-border bg-cz-inset/70 p-2">
						<p className="mb-2 text-3xs font-mono uppercase tracking-[0.24em] text-cz-light-blue">
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
						className="input mt-4 w-full border-cz-border bg-cz-inset text-cz-cream"
						placeholder="Preset name"
						value={pendingSaveName}
						onChange={(event) => setPendingSaveName(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && pendingSaveName.trim()) {
								onSave?.(pendingSaveName);
							}
							if (event.key === "Escape") {
								onCancel?.();
							}
						}}
					/>
				)}
				<div className="modal-action">
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
		</dialog>
	);
}

function AudioStartOverlay({
	audioGate,
}: {
	audioGate?: SynthRendererProps["audioGate"];
}) {
	const startButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (!audioGate || audioGate.ready) return;
		startButtonRef.current?.focus();
	}, [audioGate]);

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
					<p className="font-mono text-sm text-cz-cream-dim">
						Audio requires a user interaction to start.
					</p>
					<Button
						ref={startButtonRef}
						type="button"
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
