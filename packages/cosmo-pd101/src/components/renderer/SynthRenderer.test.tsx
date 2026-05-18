import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SynthRenderer from "./SynthRenderer";

vi.mock("@/components/preset/SynthHeader", () => ({
	default: () => <div data-testid="synth-header" />,
}));
vi.mock("@/components/layout/SynthSidebar", () => ({
	default: ({ onOpenGlobal }: { onOpenGlobal: () => void }) => (
		<button type="button" onClick={onOpenGlobal} data-testid="synth-sidebar">
			open global
		</button>
	),
}));
vi.mock("@/components/panels/voice/GlobalVoicePanel", () => ({
	default: () => <div data-testid="global-voice-panel" />,
}));
vi.mock("@/components/panels/drawers/FxConsoleDrawer", () => ({
	default: () => <div data-testid="fx-console-drawer" />,
}));
vi.mock("@/components/panels/drawers/ModConsoleDrawer", () => ({
	default: () => <div data-testid="mod-console-drawer" />,
}));
vi.mock("@/components/panels/analysis/ScopeDisplay", () => ({
	ScopeDrawerDisplay: () => <div data-testid="scope-drawer-display" />,
	ScopeMiniDisplay: () => <div data-testid="scope-mini-display" />,
}));
vi.mock("@/components/controls/LineSelectControl", () => ({
	default: () => <div data-testid="line-select-control" />,
}));
vi.mock("@/components/controls/ModModeControl", () => ({
	default: () => <div data-testid="mod-mode-control" />,
}));
vi.mock("@/components/editor/PhaseLinesSection", () => ({
	default: () => <div data-testid="phase-lines-section" />,
}));
vi.mock("@/components/preset/PresetLibrary", () => ({
	default: () => <div data-testid="preset-library" />,
}));
vi.mock("@/components/layout/MiniKeyboardOverlay", () => ({
	default: () => <div data-testid="mini-keyboard-overlay" />,
}));
vi.mock("@/components/layout/SynthInfoBar", () => ({
	default: () => <div data-testid="synth-info-bar" />,
}));
vi.mock("@/components/controls/SynthParamKnob", () => ({
	default: () => <div data-testid="synth-param-knob" />,
}));
vi.mock("@/components/primitives/CzTabButton", () => ({
	default: () => <div data-testid="cz-tab-button" />,
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(() => ({
		modMatrix: {},
		setModMatrix: vi.fn(),
		fxSlots: {},
	})),
}));

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(() => ({
		mainPanelMode: "phase",
		setMainPanelMode: vi.fn(),
		keyboardVisible: false,
		setKeyboardVisible: vi.fn(),
		libraryModeOpen: false,
		setLibraryModeOpen: vi.fn(),
	})),
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

describe("SynthRenderer Smoke Test", () => {
	it("renders without crashing", () => {
		const props = {
			headerProps: {
				allEntries: [],
				activeEntryId: "1",
				activePresetName: "Test Preset",
				showLibraryPresets: true,
				onToggleLibraryPresets: vi.fn(),
				onLoadLocal: vi.fn(),
				onLoadLibrary: vi.fn(),
				onLoadBuiltin: vi.fn(),
				onSavePreset: vi.fn(),
				onDeletePreset: vi.fn(),
				onRenamePreset: vi.fn(),
				onSetPresetFavorite: vi.fn(),
				onSetPresetCategory: vi.fn(),
				onSetPresetTags: vi.fn(),
				onExportPreset: vi.fn(),
				onExportCurrentState: vi.fn(),
				onImportPreset: vi.fn(),
				onInitPreset: vi.fn(),
				pendingPresetChange: null,
				onSavePendingPresetChange: vi.fn(),
				onDiscardPendingPresetChange: vi.fn(),
				onCancelPendingPresetChange: vi.fn(),
				onStepPreset: vi.fn(),
			},
			frameClassName: "test-frame",
			effectivePitchHz: 440,
			analyserNodeRef: { current: null },
			audioCtxRef: { current: null },
			miniKeyboard: {
				activeNotes: [],
				onNoteOn: vi.fn(),
				onNoteOff: vi.fn(),
			},
			audioGate: {
				ready: true,
				onResume: vi.fn(),
			},
		};

		render(<SynthRenderer {...props} />);
	});

	it("opens global modal from sidebar action", () => {
		const props = {
			headerProps: {
				allEntries: [],
				activeEntryId: "1",
				activePresetName: "Test Preset",
				showLibraryPresets: true,
				onToggleLibraryPresets: vi.fn(),
				onLoadLocal: vi.fn(),
				onLoadLibrary: vi.fn(),
				onLoadBuiltin: vi.fn(),
				onSavePreset: vi.fn(),
				onDeletePreset: vi.fn(),
				onRenamePreset: vi.fn(),
				onSetPresetFavorite: vi.fn(),
				onSetPresetCategory: vi.fn(),
				onSetPresetTags: vi.fn(),
				onExportPreset: vi.fn(),
				onExportCurrentState: vi.fn(),
				onImportPreset: vi.fn(),
				onInitPreset: vi.fn(),
				pendingPresetChange: null,
				onSavePendingPresetChange: vi.fn(),
				onDiscardPendingPresetChange: vi.fn(),
				onCancelPendingPresetChange: vi.fn(),
				onStepPreset: vi.fn(),
			},
			frameClassName: "test-frame",
			effectivePitchHz: 440,
			analyserNodeRef: { current: null },
			audioCtxRef: { current: null },
		};

		render(<SynthRenderer {...props} />);
		fireEvent.click(screen.getByTestId("synth-sidebar"));
		expect(screen.getByTestId("global-voice-panel")).toBeInTheDocument();
	});
});
