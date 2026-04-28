import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());

vi.mock("./hooks/usePluginParamBridge", () => ({
	usePluginParamBridge: mockUsePluginParamBridge,
}));

vi.mock("@cosmo/cosmo-pd101", () => {
	const synthStoreState = {
		gatherState: () => ({ params: { volume: 1 } }),
		applyPreset: vi.fn(),
		velocityCurve: "linear",
	};
	const synthUiStoreState = {
		activeAsidePanel: null,
		setActiveAsidePanel: vi.fn(),
	};

	return {
		DEFAULT_SYNTH_PRESETS: {},
		getSynthRuntimeCapabilities: () => ({
			uiScaleOptions: [70],
			showUiScaleControl: true,
		}),
		SynthRenderer: () => <div data-testid="synth-renderer" />,
		useLcdControlReadout: () => ({
			lcdControlReadout: "",
			pushLcdControlReadout: vi.fn(),
		}),
		useNoteHandling: () => ({
			activeNotes: [],
			sendNoteOn: vi.fn(),
			sendNoteOff: vi.fn(),
		}),
		useSynthPresetManager: mockUseSynthPresetManager,
		useSynthStore: (selector: (state: typeof synthStoreState) => unknown) =>
			selector(synthStoreState),
		useSynthUiStore: (selector: (state: typeof synthUiStoreState) => unknown) =>
			selector(synthUiStoreState),
	};
});

describe("PluginPage", () => {
	beforeEach(() => {
		mockUsePluginParamBridge.mockReset();
		mockUseSynthPresetManager.mockReset();
		mockUseSynthPresetManager.mockReturnValue({
			allPresetEntries: [],
			activePresetId: null,
			activePresetName: "Current State",
			pendingPresetChange: null,
			handleLoadLocal: vi.fn(),
			handleLoadBuiltin: vi.fn(),
			handleLoadLibrary: vi.fn(),
			handleStepPreset: vi.fn(),
			handleSavePreset: vi.fn(),
			handleDeletePreset: vi.fn(),
			handleRenamePreset: vi.fn(),
			handleInitPreset: vi.fn(),
			handleExportPreset: vi.fn(),
			handleImportPreset: vi.fn(),
			handleExportCurrentState: vi.fn(),
			handleSavePendingPresetChange: vi.fn(),
			handleDiscardPendingPresetChange: vi.fn(),
			handleCancelPendingPresetChange: vi.fn(),
		});
		delete (window as Window & { ipc?: unknown }).ipc;
	});

	it("does not hydrate persisted current state in plugin mode", () => {
		render(<PluginPage />);

		expect(mockUseSynthPresetManager).toHaveBeenCalledTimes(1);
		const options = mockUseSynthPresetManager.mock.calls[0]?.[0] as {
			shouldLoadCurrentState: () => boolean;
		};
		expect(options.shouldLoadCurrentState()).toBe(false);
	});
});
