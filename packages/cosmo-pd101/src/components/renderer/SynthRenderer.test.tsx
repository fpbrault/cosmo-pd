import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PresetManagerPendingChange } from "@/context/PresetManagerContext";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import type { MainPanelMode } from "@/features/synth/synthUiStore";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import SynthRenderer from "./SynthRenderer";

const mockSynthStoreState = {
	modMatrix: {},
	setModMatrix: vi.fn(),
	setLine1DcoEnv: vi.fn(),
	setLine1DcwEnv: vi.fn(),
	setLine1DcaEnv: vi.fn(),
	setLine2DcoEnv: vi.fn(),
	setLine2DcwEnv: vi.fn(),
	setLine2DcaEnv: vi.fn(),
	velocityCurve: 0,
	gatherState: () => ({}),
	gatherPresetState: () => ({}),
	applyPreset: vi.fn(),
};

const mockSynthUiStoreState = {
	mainPanelMode: "phase" as MainPanelMode,
	setMainPanelMode: vi.fn(),
	keyboardVisible: false,
	setKeyboardVisible: vi.fn(),
	keyboardHeight: 0,
	libraryModeOpen: false,
	setLibraryModeOpen: vi.fn(),
	globalPanelOpen: false,
	setGlobalPanelOpen: vi.fn(),
	brandInfoOpen: false,
	setBrandInfoOpen: vi.fn(),
	midiLearnOpen: false,
	setMidiLearnOpen: vi.fn(),
	macroLabelEditorOpen: false,
	setMacroLabelEditorOpen: vi.fn(),
	keyboardSettingsOpen: false,
	setKeyboardSettingsOpen: vi.fn(),
	keyboardOctaves: 3,
	setKeyboardOctaves: vi.fn(),
	keyboardRange: 0,
	setKeyboardRange: vi.fn(),
	keyboardInputMode: "velocity",
	setKeyboardInputMode: vi.fn(),
};

vi.mock("@/components/preset/SynthHeader", () => ({
	default: () => <div data-testid="synth-header" />,
}));
vi.mock("@/components/layout/SynthSidebar", () => ({
	default: ({ sidebarMinWidthRem }: { sidebarMinWidthRem?: number }) => (
		<div
			data-testid="synth-sidebar"
			data-sidebar-min-width={sidebarMinWidthRem}
		>
			sidebar
		</div>
	),
}));
vi.mock("@/components/modals", () => ({
	GlobalVoiceModal: ({ open }: { open: boolean }) =>
		open ? <div data-testid="global-voice-panel" /> : null,
	KeyboardSettingsPopover: () => null,
	MacroLabelEditorPopover: () => null,
	PendingModifiedPresetModal: ({
		pendingPresetChange,
	}: {
		pendingPresetChange: unknown;
	}) =>
		pendingPresetChange ? <div data-testid="pending-preset-modal" /> : null,
	SynthBrandInfoModal: () => null,
}));
vi.mock("@/components/panels/drawers/FxConsoleDrawer", () => ({
	default: () => <div data-testid="fx-console-drawer" />,
}));
vi.mock("@/components/panels/drawers/ModConsoleDrawer", () => ({
	default: () => <div data-testid="mod-console-drawer" />,
}));
vi.mock("@/components/panels/analysis/ScopeDisplay", () => ({
	ScopeDrawerDisplay: () => <div data-testid="scope-drawer-display" />,
}));
vi.mock("@/components/controls/LineSelectControl", () => ({
	default: () => <div data-testid="line-select-control" />,
}));
vi.mock("@/components/controls/ModModeControl", () => ({
	default: () => <div data-testid="mod-mode-control" />,
}));
vi.mock("@/components/controls/MasterVolumeControl", () => ({
	default: () => <div data-testid="master-volume-control" />,
}));
vi.mock("@/components/editor/PhaseLinesSection", () => ({
	default: () => <div data-testid="phase-lines-section" />,
}));
vi.mock("@/components/preset/PresetLibrary", () => ({
	default: ({ isOpen, onClose }: { isOpen?: boolean; onClose: () => void }) => (
		<div data-testid="preset-library" data-open={isOpen ? "true" : "false"}>
			<button
				type="button"
				data-testid="preset-library-close"
				onClick={onClose}
			>
				close
			</button>
		</div>
	),
}));
vi.mock("@/components/layout/MiniKeyboardOverlay", () => ({
	default: () => <div data-testid="mini-keyboard-overlay" />,
}));
vi.mock("@/components/layout/SynthInfoBar", () => ({
	default: () => <div data-testid="synth-info-bar" />,
}));
vi.mock("@/components/primitives/CzTabButton", () => ({
	default: () => <button type="button" data-testid="cz-tab-button" />,
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(selector: (state: typeof mockSynthStoreState) => unknown) =>
			selector(mockSynthStoreState),
	),
}));

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(
		(selector: (state: typeof mockSynthUiStoreState) => unknown) =>
			selector(mockSynthUiStoreState),
	),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	SynthParamControllerProvider: ({
		children,
	}: {
		children: React.ReactNode;
	}) => <div>{children}</div>,
	useSynthParam: vi.fn(() => ({
		value: 0.5,
		setValue: vi.fn(),
	})),
}));

vi.mock("@/context/ModMatrixContext", () => ({
	ModMatrixProvider: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

const mockPresetManager = {
	visiblePresetEntries: [] as PresetEntry[],
	activePresetId: "1",
	activePresetName: "Test Preset",
	pendingPresetChange: null as PresetManagerPendingChange | null,
	handleLoadLocal: vi.fn(),
	handleLoadBuiltin: vi.fn(),
	handleLoadLibrary: vi.fn(),
	handleStepPreset: vi.fn(),
	handleSavePreset: vi.fn(),
	handleDeletePreset: vi.fn(),
	handleRenamePreset: vi.fn(),
	handleSetPresetAuthor: vi.fn(),
	handleSetPresetFavorite: vi.fn(),
	handleSetPresetTags: vi.fn(),
	handleInitPreset: vi.fn(),
	handleExportPreset: vi.fn(),
	handleImportPreset: vi.fn(),
	handleExportCurrentState: vi.fn(),
	handleSavePendingPresetChange: vi.fn(),
	handleDiscardPendingPresetChange: vi.fn(),
	handleCancelPendingPresetChange: vi.fn(),
};

vi.mock("@/features/synth/useSynthPresetManager", () => ({
	useSynthPresetManager: vi.fn(() => mockPresetManager),
}));

vi.mock("./hooks/usePerformanceMetrics", () => ({
	usePerformanceMetrics: vi.fn(() => ({
		enabled: false,
		setEnabled: vi.fn(),
		metrics: null,
		metricsRef: { current: null },
	})),
}));

vi.mock("./hooks/useAudioLevelMonitor", () => ({
	useAudioLevelMonitor: vi.fn(),
}));

vi.mock("@/lib/performance/benchmarkHarness", () => ({
	installBenchmarkApi: vi.fn(() => vi.fn()),
}));

const mockRuntime: SynthRuntime = {
	activeNotes: [],
	sendNoteOn: vi.fn(),
	sendNoteOff: vi.fn(),
	sendPolyAftertouch: vi.fn(),
	panic: vi.fn(),
	audioContextState: "running",
	resumeAudio: vi.fn(),
	effectivePitchHz: 220,
	analyserNodeRef: { current: null },
	audioCtxRef: { current: null },
	benchmark: {
		mode: "web",
		setPerformanceMonitorEnabled: vi.fn(),
		getPerformanceMetrics: vi.fn(() => null),
		ensureReady: vi.fn(),
	},
};

describe("SynthRenderer Smoke Test", () => {
	beforeEach(() => {
		mockSynthUiStoreState.mainPanelMode = "phase";
		mockSynthUiStoreState.keyboardVisible = false;
		mockSynthUiStoreState.keyboardHeight = 0;
		mockSynthUiStoreState.libraryModeOpen = false;
		mockSynthUiStoreState.globalPanelOpen = false;
		mockSynthUiStoreState.brandInfoOpen = false;
		mockSynthUiStoreState.midiLearnOpen = false;
		mockSynthUiStoreState.macroLabelEditorOpen = false;
		mockSynthUiStoreState.keyboardSettingsOpen = false;
		mockSynthUiStoreState.setMainPanelMode.mockReset();
		mockSynthUiStoreState.setKeyboardVisible.mockReset();
		mockSynthUiStoreState.setLibraryModeOpen.mockReset();
		mockPresetManager.visiblePresetEntries = [];
		mockPresetManager.pendingPresetChange = null;
	});

	it("renders without crashing", () => {
		render(<SynthRenderer runtime={mockRuntime} />);
		expect(screen.getByTestId("synth-header")).toBeInTheDocument();
	});

	it("renders global modal when store flag is set", () => {
		mockSynthUiStoreState.globalPanelOpen = true;
		render(<SynthRenderer runtime={mockRuntime} />);
		expect(screen.getByTestId("global-voice-panel")).toBeInTheDocument();
	});

	it("passes a custom sidebar width through to the sidebar", () => {
		render(
			<SynthRenderer runtime={mockRuntime} sidebarMinWidthRem={20.3125} />,
		);
		expect(screen.getByTestId("synth-sidebar")).toHaveAttribute(
			"data-sidebar-min-width",
			"20.3125",
		);
	});

	it("closes the library overlay through the extracted library component", () => {
		mockSynthUiStoreState.libraryModeOpen = true;

		render(<SynthRenderer runtime={mockRuntime} />);
		fireEvent.click(screen.getByTestId("preset-library-close"));

		expect(mockSynthUiStoreState.setLibraryModeOpen).toHaveBeenCalledWith(
			false,
		);
	});

	it("renders modulation drawer content in mod mode", () => {
		mockSynthUiStoreState.mainPanelMode = "mod";
		render(<SynthRenderer runtime={mockRuntime} />);
		expect(screen.getByTestId("mod-console-drawer")).toBeInTheDocument();
	});

	it("renders pending preset modal when pending changes exist", () => {
		mockPresetManager.pendingPresetChange = {
			activePresetName: "Init",
			activeLocalName: null,
			suggestedName: "Init 2",
			changes: [{ path: "volume", previous: "0.1", next: "0.2" }],
		};

		render(<SynthRenderer runtime={mockRuntime} />);
		expect(screen.getByTestId("pending-preset-modal")).toBeInTheDocument();
	});
});
