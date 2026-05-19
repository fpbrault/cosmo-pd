import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const SYNTH_UI_STATE_STORAGE_KEY = "cosmo-pd101-ui-state";

export type MainPanelMode = "phase" | "fx" | "mod" | "display";
export type ScopeColorTheme = "vintage" | "amber" | "plasma";
export type ScopeVisualizationMode =
	| "waveform"
	| "orbital"
	| "spectrogram"
	| "waterfall3d"
	| "transferCurves"
	| "asteroids";
export type PhaseLinePanelTab =
	| "line1-algos"
	| "line2-algos"
	| "line1-envelopes"
	| "line2-envelopes";
export type EnvTab = "dco" | "dcw" | "dca";
export type KeyboardInputMode = "velocity" | "aftertouch";

type SynthUiState = {
	mainPanelMode: MainPanelMode;
	phaseLinePanelTab: PhaseLinePanelTab;
	activeEnvTab: EnvTab;
	keyboardVisible: boolean;
	keyboardOctaves: number;
	keyboardRange: number;
	keyboardHeight: number;
	keyboardInputMode: KeyboardInputMode;
	libraryModeOpen: boolean;
	scopeCycles: number;
	scopeVerticalZoom: number;
	scopeTriggerLevel: number;
	scopeVisualizationMode: ScopeVisualizationMode;
	scopeColorTheme: ScopeColorTheme;
};

type SynthUiActions = {
	setMainPanelMode: (mode: MainPanelMode) => void;
	setPhaseLinePanelTab: (tab: PhaseLinePanelTab) => void;
	setActiveEnvTab: (tab: EnvTab) => void;
	setKeyboardVisible: (visible: boolean) => void;
	setKeyboardOctaves: (octaves: number) => void;
	setKeyboardRange: (range: number) => void;
	setKeyboardHeight: (height: number) => void;
	setKeyboardInputMode: (mode: KeyboardInputMode) => void;
	setLibraryModeOpen: (open: boolean) => void;
	setScopeCycles: (cycles: number) => void;
	setScopeVerticalZoom: (zoom: number) => void;
	setScopeTriggerLevel: (level: number) => void;
	setScopeVisualizationMode: (mode: ScopeVisualizationMode) => void;
	setScopeColorTheme: (theme: ScopeColorTheme) => void;
};

export type SynthUiStore = SynthUiState & SynthUiActions;

const MAIN_PANEL_MODES = new Set<MainPanelMode>([
	"phase",
	"fx",
	"mod",
	"display",
]);
const PHASE_LINE_PANEL_TABS = new Set<PhaseLinePanelTab>([
	"line1-algos",
	"line2-algos",
	"line1-envelopes",
	"line2-envelopes",
]);
const ENV_TABS = new Set<EnvTab>(["dco", "dcw", "dca"]);
const SCOPE_VISUALIZATION_MODES = new Set<ScopeVisualizationMode>([
	"waveform",
	"orbital",
	"spectrogram",
	"waterfall3d",
	"transferCurves",
	"asteroids",
]);
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
	mainPanelMode: "phase",
	phaseLinePanelTab: "line1-algos",
	activeEnvTab: "dcw",
	keyboardVisible: true,
	keyboardOctaves: 3,
	keyboardRange: 0,
	keyboardHeight: 128,
	keyboardInputMode: "velocity",
	libraryModeOpen: false,
	scopeCycles: 2,
	scopeVerticalZoom: 1,
	scopeTriggerLevel: 128,
	scopeVisualizationMode: "waveform",
	scopeColorTheme: "vintage",
};

const getStringValue = (value: unknown): string | null =>
	typeof value === "string" ? value : null;

const normalizeSynthUiState = (value: unknown): SynthUiState => {
	if (typeof value !== "object" || value === null) {
		return DEFAULT_UI_STATE;
	}

	const candidate = value as Partial<Record<keyof SynthUiState, unknown>>;
	const mainPanelMode = getStringValue(candidate.mainPanelMode);
	const phaseLinePanelTab = getStringValue(candidate.phaseLinePanelTab);
	const activeEnvTab = getStringValue(candidate.activeEnvTab);
	const scopeVisualizationMode = getStringValue(
		candidate.scopeVisualizationMode,
	);
	const rawScopeColorTheme = getStringValue(candidate.scopeColorTheme);
	const scopeColorTheme =
		rawScopeColorTheme === "classic" ? "vintage" : rawScopeColorTheme;
	const rawKeyboardInputMode = getStringValue(candidate.keyboardInputMode);

	return {
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
			scopeVisualizationMode &&
			SCOPE_VISUALIZATION_MODES.has(
				scopeVisualizationMode as ScopeVisualizationMode,
			)
				? (scopeVisualizationMode as ScopeVisualizationMode)
				: DEFAULT_UI_STATE.scopeVisualizationMode,
		scopeColorTheme:
			scopeColorTheme &&
			SCOPE_COLOR_THEMES.has(scopeColorTheme as ScopeColorTheme)
				? (scopeColorTheme as ScopeColorTheme)
				: DEFAULT_UI_STATE.scopeColorTheme,
	};
};

export const useSynthUiStore = create<SynthUiStore>()(
	persist(
		(set) => ({
			...DEFAULT_UI_STATE,
			setMainPanelMode: (mode) => set({ mainPanelMode: mode }),
			setPhaseLinePanelTab: (tab) => set({ phaseLinePanelTab: tab }),
			setActiveEnvTab: (tab) => set({ activeEnvTab: tab }),
			setKeyboardVisible: (visible) => set({ keyboardVisible: visible }),
			setKeyboardOctaves: (octaves) => set({ keyboardOctaves: octaves }),
			setKeyboardRange: (range) => set({ keyboardRange: range }),
			setKeyboardHeight: (height) => set({ keyboardHeight: height }),
			setKeyboardInputMode: (mode) => set({ keyboardInputMode: mode }),
			setLibraryModeOpen: (open) => set({ libraryModeOpen: open }),
			setScopeCycles: (cycles) => set({ scopeCycles: cycles }),
			setScopeVerticalZoom: (zoom) => set({ scopeVerticalZoom: zoom }),
			setScopeTriggerLevel: (level) => set({ scopeTriggerLevel: level }),
			setScopeVisualizationMode: (mode) =>
				set({ scopeVisualizationMode: mode }),
			setScopeColorTheme: (theme) => set({ scopeColorTheme: theme }),
		}),
		{
			name: SYNTH_UI_STATE_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				mainPanelMode: state.mainPanelMode,
				phaseLinePanelTab: state.phaseLinePanelTab,
				activeEnvTab: state.activeEnvTab,
				keyboardVisible: state.keyboardVisible,
				keyboardOctaves: state.keyboardOctaves,
				keyboardRange: state.keyboardRange,
				keyboardHeight: state.keyboardHeight,
				keyboardInputMode: state.keyboardInputMode,
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
