import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PresetManagerProvider } from "@/context/PresetManagerContext";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import type { MainPanelMode } from "@/features/synth/synthUiStore";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import SynthRenderer from "./SynthRenderer";

const mockSynthStoreState = {
	modMatrix: {},
	setModMatrix: vi.fn(),
};

const mockSynthUiStoreState = {
	mainPanelMode: "phase" as MainPanelMode,
	setMainPanelMode: vi.fn(),
	keyboardVisible: false,
	setKeyboardVisible: vi.fn(),
	keyboardHeight: 0,
	libraryModeOpen: false,
	setLibraryModeOpen: vi.fn(),
	setBrandInfoOpen: vi.fn(),
};

vi.mock("@/components/preset/SynthHeader", () => ({
	default: ({
		onStepPreset,
	}: {
		onStepPreset: (direction: -1 | 1) => void;
	}) => (
		<div data-testid="synth-header">
			<button
				type="button"
				data-testid="step-next"
				onClick={() => onStepPreset(1)}
			>
				next
			</button>
		</div>
	),
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
vi.mock("@/components/preset/PresetLibrary", () => ({
	default: ({
		isOpen,
		onClose,
		allEntries,
		onNavigationEntriesChange,
	}: {
		isOpen?: boolean;
		onClose: () => void;
		allEntries: PresetEntry[];
		onNavigationEntriesChange?: (entryIds: string[]) => void;
	}) => (
		<div data-testid="preset-library" data-open={isOpen ? "true" : "false"}>
			<button
				type="button"
				data-testid="preset-library-close"
				onClick={onClose}
			>
				close
			</button>
			<button
				type="button"
				data-testid="preset-library-filter"
				onClick={() =>
					onNavigationEntriesChange?.(
						allEntries
							.filter((entry) => entry.id === "gamma")
							.map((entry) => entry.id),
					)
				}
			>
				filter
			</button>
		</div>
	),
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
}));
vi.mock("@/context/ModMatrixContext", () => ({
	ModMatrixProvider: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("./hooks/useAudioLevelMonitor", () => ({
	useAudioLevelMonitor: vi.fn(),
}));
vi.mock("@/lib/performance/benchmarkHarness", () => ({
	installBenchmarkApi: vi.fn(() => vi.fn()),
}));
vi.mock("./SynthRendererMainPanel", () => ({
	default: () => <div data-testid="synth-main-panel" />,
}));
vi.mock("./SynthRendererOverlays", () => ({
	default: () => <div data-testid="synth-overlays" />,
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
	subscribeScopeFrames: vi.fn(() => () => {}),
	benchmark: {
		mode: "web",
		setPerformanceMonitorEnabled: vi.fn(),
		getPerformanceMetrics: vi.fn(() => null),
		ensureReady: vi.fn(),
	},
};

const baseEntries: PresetEntry[] = [
	{
		id: "alpha",
		label: "Alpha",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Library",
		author: "Purr Audio",
		starred: false,
		favorite: false,
		tags: [],
		preset: {
			id: "alpha",
			name: "Alpha",
			source: "cosmo-factory",
			author: "Purr Audio",
			starred: false,
		},
	},
	{
		id: "gamma",
		label: "Gamma",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Library",
		author: "Purr Audio",
		starred: false,
		favorite: false,
		tags: [],
		preset: {
			id: "gamma",
			name: "Gamma",
			source: "cosmo-factory",
			author: "Purr Audio",
			starred: false,
		},
	},
];

const mockPresetManager = {
	allPresetEntries: baseEntries,
	navigationEntryIds: baseEntries.map((entry) => entry.id),
	activePresetId: "alpha",
	activePresetNameBase: "Alpha",
	activePresetName: "Alpha",
	isPresetDirty: false,
	syncExternalSelection: vi.fn(),
	activatePreset: vi.fn(),
	setNavigationEntryIds: vi.fn(),
	stepPreset: vi.fn(),
	savePreset: vi.fn(),
	deletePreset: vi.fn(),
	renamePreset: vi.fn(),
	setPresetAuthor: vi.fn(),
	setPresetFavorite: vi.fn(),
	setPresetTags: vi.fn(),
	initPreset: vi.fn(),
	exportPreset: vi.fn(),
	importPreset: vi.fn(),
	exportCurrentState: vi.fn(),
	recomputeDirtyState: vi.fn(),
	reloadLibrary: vi.fn(),
};

function renderWithProvider() {
	return render(
		<PresetManagerProvider value={mockPresetManager}>
			<SynthRenderer runtime={mockRuntime} />
		</PresetManagerProvider>,
	);
}

describe("SynthRenderer", () => {
	beforeEach(() => {
		mockSynthUiStoreState.mainPanelMode = "phase";
		mockSynthUiStoreState.keyboardVisible = false;
		mockSynthUiStoreState.keyboardHeight = 0;
		mockSynthUiStoreState.libraryModeOpen = false;
		mockSynthUiStoreState.setMainPanelMode.mockReset();
		mockSynthUiStoreState.setKeyboardVisible.mockReset();
		mockSynthUiStoreState.setLibraryModeOpen.mockReset();
		mockPresetManager.stepPreset.mockReset();
		mockPresetManager.setNavigationEntryIds.mockReset();
	});

	it("renders without crashing", () => {
		renderWithProvider();
		expect(screen.getByTestId("synth-header")).toBeInTheDocument();
	});

	it("passes a custom sidebar width through to the sidebar", () => {
		render(
			<PresetManagerProvider value={mockPresetManager}>
				<SynthRenderer runtime={mockRuntime} sidebarMinWidthRem={20.3125} />
			</PresetManagerProvider>,
		);
		expect(screen.getByTestId("synth-sidebar")).toHaveAttribute(
			"data-sidebar-min-width",
			"20.3125",
		);
	});

	it("closes the library overlay through the extracted library component", () => {
		mockSynthUiStoreState.libraryModeOpen = true;
		renderWithProvider();
		fireEvent.click(screen.getByTestId("preset-library-close"));
		expect(mockSynthUiStoreState.setLibraryModeOpen).toHaveBeenCalledWith(
			false,
		);
	});

	it("steps presets through the shared preset manager", () => {
		renderWithProvider();
		fireEvent.click(screen.getByTestId("step-next"));
		expect(mockPresetManager.stepPreset).toHaveBeenCalledWith(1);
	});

	it("pushes navigation entry ids back into the shared preset manager", () => {
		mockSynthUiStoreState.libraryModeOpen = true;
		renderWithProvider();
		fireEvent.click(screen.getByTestId("preset-library-filter"));
		expect(mockPresetManager.setNavigationEntryIds).toHaveBeenCalledWith([
			"gamma",
		]);
	});
});
