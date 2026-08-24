import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
	migrateLegacyVisualizationMode,
	VISUALIZATION_MODES as SCOPE_VISUALIZATION_MODES,
	type VisualizationMode as ScopeVisualizationMode,
} from "@/features/visualization/visualizationModes";
export const SYNTH_UI_STATE_STORAGE_KEY = "cosmo-pd101-ui-state";

export type MainPanelMode = "phase" | "fx" | "mod";
export type SynthWorkspaceMode = "edit" | "performance";
export type ScopeColorTheme = "vintage" | "amber" | "plasma";
export type PhaseLinePanelTab =
	| "line1-algos"
	| "line2-algos"
	| "line1-envelopes"
	| "line2-envelopes";
export type EnvTab = "dco" | "dcw" | "dca";
export type SimpleExpandedSection = "sound" | "effects";
export type SimpleEditedLine = 1 | 2;
export type SimpleEditedAlgo = "a" | "b";
type KeyboardInputMode = "velocity" | "aftertouch";

type SynthUiState = {
	workspaceMode: SynthWorkspaceMode;
	mainPanelMode: MainPanelMode;
	phaseLinePanelTab: PhaseLinePanelTab;
	activeEnvTab: EnvTab;
	simpleExpandedSection: SimpleExpandedSection;
	simpleEditedLine: SimpleEditedLine;
	simpleEditedAlgo: SimpleEditedAlgo;
	keyboardVisible: boolean;
	keyboardOctaves: number;
	keyboardRange: number;
	keyboardHeight: number;
	keyboardInputMode: KeyboardInputMode;
	pcKeyboardOverlayVisible: boolean;
	libraryModeOpen: boolean;
	scopeCycles: number;
	scopeVerticalZoom: number;
	/** @deprecated Retained only so older DAW sessions can round-trip this value. */
	scopeTriggerLevel: number;
	scopeVisualizationMode: ScopeVisualizationMode;
	scopeColorTheme: ScopeColorTheme;
	brandInfoOpen: boolean;
	globalPanelOpen: boolean;
	midiLearnOpen: boolean;
	macroLabelEditorOpen: boolean;
	keyboardSettingsOpen: boolean;
};

type SynthUiActions = {
	setWorkspaceMode: (mode: SynthWorkspaceMode) => void;
	setMainPanelMode: (mode: MainPanelMode) => void;
	setPhaseLinePanelTab: (tab: PhaseLinePanelTab) => void;
	setActiveEnvTab: (tab: EnvTab) => void;
	setSimpleExpandedSection: (section: SimpleExpandedSection) => void;
	setSimpleEditedLine: (line: SimpleEditedLine) => void;
	setSimpleEditedAlgo: (algo: SimpleEditedAlgo) => void;
	setKeyboardVisible: (visible: boolean) => void;
	setKeyboardOctaves: (octaves: number) => void;
	setKeyboardRange: (range: number) => void;
	setKeyboardHeight: (height: number) => void;
	setKeyboardInputMode: (mode: KeyboardInputMode) => void;
	setPcKeyboardOverlayVisible: (visible: boolean) => void;
	setLibraryModeOpen: (open: boolean) => void;
	setScopeCycles: (cycles: number) => void;
	setScopeVerticalZoom: (zoom: number) => void;
	/** @deprecated Manual triggering is retired; retained for legacy session state. */
	setScopeTriggerLevel: (level: number) => void;
	setScopeVisualizationMode: (mode: ScopeVisualizationMode) => void;
	setScopeColorTheme: (theme: ScopeColorTheme) => void;
	setBrandInfoOpen: (open: boolean) => void;
	setGlobalPanelOpen: (open: boolean) => void;
	setMidiLearnOpen: (open: boolean) => void;
	setMacroLabelEditorOpen: (open: boolean) => void;
	setKeyboardSettingsOpen: (open: boolean) => void;
};

export type SynthUiStore = SynthUiState & SynthUiActions;

const MAIN_PANEL_MODES = new Set<MainPanelMode>(["phase", "fx", "mod"]);
const PHASE_LINE_PANEL_TABS = new Set<PhaseLinePanelTab>([
	"line1-algos",
	"line2-algos",
	"line1-envelopes",
	"line2-envelopes",
]);
const ENV_TABS = new Set<EnvTab>(["dco", "dcw", "dca"]);
const SIMPLE_EXPANDED_SECTIONS = new Set<SimpleExpandedSection>([
	"sound",
	"effects",
]);
const SIMPLE_EDITED_ALGOS = new Set<SimpleEditedAlgo>(["a", "b"]);
const SCOPE_COLOR_THEMES = new Set<ScopeColorTheme>([
	"vintage",
	"amber",
	"plasma",
]);

const KEYBOARD_INPUT_MODES = new Set<KeyboardInputMode>([
	"velocity",
	"aftertouch",
]);

const DEFAULT_UI_STATE: SynthUiState = {
	workspaceMode: "edit",
	mainPanelMode: "phase",
	phaseLinePanelTab: "line1-algos",
	activeEnvTab: "dcw",
	simpleExpandedSection: "sound",
	simpleEditedLine: 1,
	simpleEditedAlgo: "a",
	keyboardVisible: true,
	keyboardOctaves: 2,
	keyboardRange: 0,
	keyboardHeight: 160,
	keyboardInputMode: "velocity",
	pcKeyboardOverlayVisible: false,
	libraryModeOpen: false,
	scopeCycles: 2,
	scopeVerticalZoom: 1,
	scopeTriggerLevel: 128,
	scopeVisualizationMode: "spectrumWaterfall",
	scopeColorTheme: "vintage",
	brandInfoOpen: false,
	globalPanelOpen: false,
	midiLearnOpen: false,
	macroLabelEditorOpen: false,
	keyboardSettingsOpen: false,
};

const getStringValue = (value: unknown): string | null =>
	typeof value === "string" ? value : null;

const normalizeSynthUiState = (value: unknown): SynthUiState => {
	if (typeof value !== "object" || value === null) {
		return DEFAULT_UI_STATE;
	}

	const candidate = value as Record<string, unknown>;
	const workspaceMode = getStringValue(candidate.workspaceMode);
	const legacyPerformanceMode = migrateLegacyVisualizationMode(
		candidate.performanceDisplayMode,
	);
	const mainPanelMode = getStringValue(candidate.mainPanelMode);
	const phaseLinePanelTab = getStringValue(candidate.phaseLinePanelTab);
	const activeEnvTab = getStringValue(candidate.activeEnvTab);
	const simpleExpandedSection = getStringValue(candidate.simpleExpandedSection);
	const simpleEditedAlgo = getStringValue(candidate.simpleEditedAlgo);
	const rawScopeColorTheme = getStringValue(candidate.scopeColorTheme);
	const scopeColorTheme =
		rawScopeColorTheme === "classic" ? "vintage" : rawScopeColorTheme;
	const rawKeyboardInputMode = getStringValue(candidate.keyboardInputMode);
	const persistedVisualizationMode = migrateLegacyVisualizationMode(
		candidate.scopeVisualizationMode,
	);
	const normalizedWorkspaceMode =
		workspaceMode === "performance" || workspaceMode === "edit"
			? workspaceMode
			: DEFAULT_UI_STATE.workspaceMode;
	const visualizationMode =
		normalizedWorkspaceMode === "performance"
			? (legacyPerformanceMode ?? persistedVisualizationMode)
			: (persistedVisualizationMode ?? legacyPerformanceMode);

	return {
		workspaceMode: normalizedWorkspaceMode,
		mainPanelMode:
			mainPanelMode && MAIN_PANEL_MODES.has(mainPanelMode as MainPanelMode)
				? (mainPanelMode as MainPanelMode)
				: DEFAULT_UI_STATE.mainPanelMode,
		phaseLinePanelTab:
			phaseLinePanelTab &&
			PHASE_LINE_PANEL_TABS.has(phaseLinePanelTab as PhaseLinePanelTab)
				? (phaseLinePanelTab as PhaseLinePanelTab)
				: DEFAULT_UI_STATE.phaseLinePanelTab,
		activeEnvTab:
			activeEnvTab && ENV_TABS.has(activeEnvTab as EnvTab)
				? (activeEnvTab as EnvTab)
				: DEFAULT_UI_STATE.activeEnvTab,
		simpleExpandedSection:
			simpleExpandedSection &&
			SIMPLE_EXPANDED_SECTIONS.has(
				simpleExpandedSection as SimpleExpandedSection,
			)
				? (simpleExpandedSection as SimpleExpandedSection)
				: DEFAULT_UI_STATE.simpleExpandedSection,
		simpleEditedLine:
			candidate.simpleEditedLine === 1 || candidate.simpleEditedLine === 2
				? candidate.simpleEditedLine
				: DEFAULT_UI_STATE.simpleEditedLine,
		simpleEditedAlgo:
			simpleEditedAlgo &&
			SIMPLE_EDITED_ALGOS.has(simpleEditedAlgo as SimpleEditedAlgo)
				? (simpleEditedAlgo as SimpleEditedAlgo)
				: DEFAULT_UI_STATE.simpleEditedAlgo,
		keyboardVisible:
			typeof candidate.keyboardVisible === "boolean"
				? candidate.keyboardVisible
				: DEFAULT_UI_STATE.keyboardVisible,
		keyboardOctaves:
			typeof candidate.keyboardOctaves === "number" &&
			candidate.keyboardOctaves >= 1 &&
			candidate.keyboardOctaves <= 5
				? candidate.keyboardOctaves
				: DEFAULT_UI_STATE.keyboardOctaves,
		keyboardRange:
			typeof candidate.keyboardRange === "number" &&
			candidate.keyboardRange >= -2 &&
			candidate.keyboardRange <= 2
				? candidate.keyboardRange
				: DEFAULT_UI_STATE.keyboardRange,
		keyboardHeight:
			typeof candidate.keyboardHeight === "number" &&
			candidate.keyboardHeight >= 64 &&
			candidate.keyboardHeight <= 256
				? candidate.keyboardHeight
				: DEFAULT_UI_STATE.keyboardHeight,
		keyboardInputMode:
			rawKeyboardInputMode &&
			KEYBOARD_INPUT_MODES.has(rawKeyboardInputMode as KeyboardInputMode)
				? (rawKeyboardInputMode as KeyboardInputMode)
				: DEFAULT_UI_STATE.keyboardInputMode,
		pcKeyboardOverlayVisible:
			typeof candidate.pcKeyboardOverlayVisible === "boolean"
				? candidate.pcKeyboardOverlayVisible
				: DEFAULT_UI_STATE.pcKeyboardOverlayVisible,
		libraryModeOpen:
			typeof candidate.libraryModeOpen === "boolean"
				? candidate.libraryModeOpen
				: DEFAULT_UI_STATE.libraryModeOpen,
		scopeCycles:
			typeof candidate.scopeCycles === "number" &&
			candidate.scopeCycles >= 0.5 &&
			candidate.scopeCycles <= 8
				? candidate.scopeCycles
				: DEFAULT_UI_STATE.scopeCycles,
		scopeVerticalZoom:
			typeof candidate.scopeVerticalZoom === "number" &&
			candidate.scopeVerticalZoom >= 0.25 &&
			candidate.scopeVerticalZoom <= 4
				? candidate.scopeVerticalZoom
				: DEFAULT_UI_STATE.scopeVerticalZoom,
		scopeTriggerLevel:
			typeof candidate.scopeTriggerLevel === "number" &&
			candidate.scopeTriggerLevel >= 0 &&
			candidate.scopeTriggerLevel <= 255
				? candidate.scopeTriggerLevel
				: DEFAULT_UI_STATE.scopeTriggerLevel,
		scopeVisualizationMode:
			visualizationMode &&
			SCOPE_VISUALIZATION_MODES.includes(
				visualizationMode as ScopeVisualizationMode,
			)
				? (visualizationMode as ScopeVisualizationMode)
				: DEFAULT_UI_STATE.scopeVisualizationMode,
		scopeColorTheme:
			scopeColorTheme &&
			SCOPE_COLOR_THEMES.has(scopeColorTheme as ScopeColorTheme)
				? (scopeColorTheme as ScopeColorTheme)
				: DEFAULT_UI_STATE.scopeColorTheme,
		brandInfoOpen:
			typeof candidate.brandInfoOpen === "boolean"
				? candidate.brandInfoOpen
				: DEFAULT_UI_STATE.brandInfoOpen,
		globalPanelOpen:
			typeof candidate.globalPanelOpen === "boolean"
				? candidate.globalPanelOpen
				: DEFAULT_UI_STATE.globalPanelOpen,
		midiLearnOpen:
			typeof candidate.midiLearnOpen === "boolean"
				? candidate.midiLearnOpen
				: DEFAULT_UI_STATE.midiLearnOpen,
		macroLabelEditorOpen:
			typeof candidate.macroLabelEditorOpen === "boolean"
				? candidate.macroLabelEditorOpen
				: DEFAULT_UI_STATE.macroLabelEditorOpen,
		keyboardSettingsOpen:
			typeof candidate.keyboardSettingsOpen === "boolean"
				? candidate.keyboardSettingsOpen
				: DEFAULT_UI_STATE.keyboardSettingsOpen,
	};
};

export const useSynthUiStore = create<SynthUiStore>()(
	persist(
		(set) => ({
			...DEFAULT_UI_STATE,
			setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
			setMainPanelMode: (mode) => set({ mainPanelMode: mode }),
			setPhaseLinePanelTab: (tab) => set({ phaseLinePanelTab: tab }),
			setActiveEnvTab: (tab) => set({ activeEnvTab: tab }),
			setSimpleExpandedSection: (section) =>
				set({ simpleExpandedSection: section }),
			setSimpleEditedLine: (line) => set({ simpleEditedLine: line }),
			setSimpleEditedAlgo: (algo) => set({ simpleEditedAlgo: algo }),
			setKeyboardVisible: (visible) => set({ keyboardVisible: visible }),
			setKeyboardOctaves: (octaves) => set({ keyboardOctaves: octaves }),
			setKeyboardRange: (range) => set({ keyboardRange: range }),
			setKeyboardHeight: (height) => set({ keyboardHeight: height }),
			setKeyboardInputMode: (mode) => set({ keyboardInputMode: mode }),
			setPcKeyboardOverlayVisible: (visible) =>
				set({ pcKeyboardOverlayVisible: visible }),
			setLibraryModeOpen: (open) => set({ libraryModeOpen: open }),
			setScopeCycles: (cycles) => set({ scopeCycles: cycles }),
			setScopeVerticalZoom: (zoom) => set({ scopeVerticalZoom: zoom }),
			setScopeTriggerLevel: (level) => set({ scopeTriggerLevel: level }),
			setScopeVisualizationMode: (mode) =>
				set({ scopeVisualizationMode: mode }),
			setScopeColorTheme: (theme) => set({ scopeColorTheme: theme }),
			setBrandInfoOpen: (open) => set({ brandInfoOpen: open }),
			setGlobalPanelOpen: (open) => set({ globalPanelOpen: open }),
			setMidiLearnOpen: (open) => set({ midiLearnOpen: open }),
			setMacroLabelEditorOpen: (open) => set({ macroLabelEditorOpen: open }),
			setKeyboardSettingsOpen: (open) => set({ keyboardSettingsOpen: open }),
		}),
		{
			name: SYNTH_UI_STATE_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				workspaceMode: state.workspaceMode,
				mainPanelMode: state.mainPanelMode,
				phaseLinePanelTab: state.phaseLinePanelTab,
				activeEnvTab: state.activeEnvTab,
				simpleExpandedSection: state.simpleExpandedSection,
				simpleEditedLine: state.simpleEditedLine,
				simpleEditedAlgo: state.simpleEditedAlgo,
				keyboardVisible: state.keyboardVisible,
				keyboardOctaves: state.keyboardOctaves,
				keyboardRange: state.keyboardRange,
				keyboardHeight: state.keyboardHeight,
				keyboardInputMode: state.keyboardInputMode,
				pcKeyboardOverlayVisible: state.pcKeyboardOverlayVisible,
				libraryModeOpen: state.libraryModeOpen,
				scopeCycles: state.scopeCycles,
				scopeVerticalZoom: state.scopeVerticalZoom,
				scopeTriggerLevel: state.scopeTriggerLevel,
				scopeVisualizationMode: state.scopeVisualizationMode,
				scopeColorTheme: state.scopeColorTheme,
			}),
			merge: (persistedState, currentState) => ({
				...currentState,
				...normalizeSynthUiState(persistedState),
			}),
		},
	),
);
