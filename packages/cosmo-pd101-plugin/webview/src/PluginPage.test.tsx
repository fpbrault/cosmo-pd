import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage, { clampPluginKeyboardHeight } from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());
const mockInstallBenchmarkApi = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockSetKeyboardHeight = vi.hoisted(() => vi.fn());

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
		keyboardHeight: 160,
		setKeyboardHeight: mockSetKeyboardHeight,
	};

	return {
		computeRendererFrameLayout: vi.fn(
			({
				availableWidth,
				availableHeight,
				targetAspectRatio,
			}: {
				availableWidth: number;
				availableHeight: number;
				targetAspectRatio?: number;
			}) => ({
				frameWidth: availableWidth,
				frameHeight: availableHeight,
				frameScale: 1,
				effectiveAspectRatio:
					targetAspectRatio ?? availableWidth / availableHeight,
				sidebarMinWidthRem: 18,
			}),
		),
		DEFAULT_SYNTH_PRESETS: {},
		FACTORY_CZ_PRESETS: [],
		SYNTH_RENDERER_DESIGN_HEIGHT: 912,
		SYNTH_RENDERER_MIN_ASPECT_RATIO: 4 / 3,
		SynthRenderer: () => <div data-testid="synth-renderer" />,
		installBenchmarkApi: mockInstallBenchmarkApi,
		useNoteHandling: () => ({
			activeNotes: [],
			sendNoteOn: vi.fn(),
			sendNoteOff: vi.fn(),
			sendPolyAftertouch: vi.fn(),
			panic: vi.fn(),
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
		mockInstallBenchmarkApi.mockClear();
		mockSetKeyboardHeight.mockClear();
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

	it("renders and initializes the preset manager", () => {
		render(<PluginPage />);

		expect(mockUseSynthPresetManager).toHaveBeenCalledTimes(1);
		const options = mockUseSynthPresetManager.mock.calls[0]?.[0];
		expect(options).not.toHaveProperty("shouldLoadCurrentState");
	});

	it("calls __czGetPresetName on mount to restore preset name", async () => {
		const getPresetName = vi.fn().mockResolvedValue("Warm Pad");
		window.__czGetPresetName = getPresetName;

		render(<PluginPage />);

		await vi.waitFor(() => {
			expect(getPresetName).toHaveBeenCalled();
		});
	});

	it("clamps persisted keyboard height for plugin viewports", () => {
		expect(
			clampPluginKeyboardHeight({
				keyboardHeight: 256,
				viewportHeight: 834,
				frameScale: 0.91,
			}),
		).toBe(160);
		expect(
			clampPluginKeyboardHeight({
				keyboardHeight: 120,
				viewportHeight: 834,
				frameScale: 0.91,
			}),
		).toBe(120);
	});
});
