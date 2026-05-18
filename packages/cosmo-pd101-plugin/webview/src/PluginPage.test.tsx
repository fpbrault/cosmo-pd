import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());
const mockInstallBenchmarkApi = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock("./hooks/usePluginParamBridge", () => ({
	usePluginParamBridge: mockUsePluginParamBridge,
}));

vi.mock("@cosmo/cosmo-pd101", () => {
	const synthStoreState = {
		gatherState: () => ({ params: { volume: 1 } }),
		applyPreset: vi.fn(),
		velocityCurve: "linear",
	};

	return {
		DEFAULT_SYNTH_PRESETS: {},
		SynthRenderer: () => <div data-testid="synth-renderer" />,
		installBenchmarkApi: mockInstallBenchmarkApi,
		useNoteHandling: () => ({
			activeNotes: [],
			sendNoteOn: vi.fn(),
			sendNoteOff: vi.fn(),
		}),
		useSynthPresetManager: mockUseSynthPresetManager,
		useSynthStore: (selector: (state: typeof synthStoreState) => unknown) =>
			selector(synthStoreState),
	};
});

describe("PluginPage", () => {
	beforeEach(() => {
		mockInstallBenchmarkApi.mockClear();
		mockUsePluginParamBridge.mockReset();
		mockUseSynthPresetManager.mockReset();
		mockUseSynthPresetManager.mockReturnValue({
			allPresetEntries: [],
			activePresetId: null,
			activePresetNameBase: "Current State",
			activePresetName: "Current State",
			loadedPresetFingerprint: null,
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

	it("hydrates preset session restored from plugin host", () => {
		render(<PluginPage />);

		expect(mockUseSynthPresetManager).toHaveBeenCalledTimes(1);
		const options = mockUseSynthPresetManager.mock.calls[0]?.[0] as {
			shouldLoadCurrentState: () => boolean;
		};
		expect(options.shouldLoadCurrentState()).toBe(true);
	});

	it("syncs preset session to host using loaded preset fingerprint baseline", () => {
		const postMessage = vi.fn();
		(
			window as Window & { ipc?: { postMessage: (message: string) => void } }
		).ipc = {
			postMessage,
		};

		mockUseSynthPresetManager.mockReturnValue({
			allPresetEntries: [],
			activePresetId: "builtin:Factory Brass",
			activePresetNameBase: "Factory Brass",
			activePresetName: "Factory Brass *",
			loadedPresetFingerprint: "baseline-fingerprint",
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

		render(<PluginPage />);

		expect(postMessage).toHaveBeenCalledTimes(1);
		const payload = JSON.parse(postMessage.mock.calls[0]?.[0] ?? "{}");
		expect(payload).toEqual({
			preset_session: {
				activePresetId: "builtin:Factory Brass",
				activePresetNameBase: "Factory Brass",
				loadedPresetFingerprint: "baseline-fingerprint",
			},
		});
	});
});
