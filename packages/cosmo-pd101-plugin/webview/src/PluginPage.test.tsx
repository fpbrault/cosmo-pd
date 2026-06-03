import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage, { clampPluginKeyboardHeight } from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());
const mockUsePluginSynthRuntime = vi.hoisted(() => vi.fn());
const mockInstallBenchmarkApi = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockSetKeyboardHeight = vi.hoisted(() => vi.fn());
const mockRendererSyncPresetSelection = vi.hoisted(() => vi.fn());

vi.mock("./hooks/usePluginParamBridge", () => ({
	usePluginParamBridge: mockUsePluginParamBridge,
}));

vi.mock("./hooks/usePluginSynthRuntime", () => ({
	usePluginSynthRuntime: mockUsePluginSynthRuntime,
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
		FACTORY_PRESETS: [],
		SYNTH_RENDERER_DESIGN_HEIGHT: 912,
		SYNTH_RENDERER_MIN_ASPECT_RATIO: 4 / 3,
		SynthRenderer: (props: {
			onInitPresetSession?: (
				syncBuiltinSelection: (
					name: string,
					options?: { isDirty?: boolean; presetId?: string | null },
				) => void,
			) => void;
		}) => {
			props.onInitPresetSession?.(mockRendererSyncPresetSelection);
			return <div data-testid="synth-renderer" />;
		},
		installBenchmarkApi: mockInstallBenchmarkApi,
		useSynthPresetManager: mockUseSynthPresetManager,
		useSynthStore: (selector: (state: typeof synthStoreState) => unknown) =>
			selector(synthStoreState),
		useSynthUiStore: (selector: (state: typeof synthUiStoreState) => unknown) =>
			selector(synthUiStoreState),
	};
});

describe("PluginPage", () => {
	let handleSyncPresetSelection: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockInstallBenchmarkApi.mockClear();
		mockSetKeyboardHeight.mockClear();
		mockUsePluginParamBridge.mockReset();
		mockUsePluginSynthRuntime.mockReset();
		mockRendererSyncPresetSelection.mockReset();
		mockUsePluginParamBridge.mockReturnValue({
			loadPresetData: vi.fn().mockResolvedValue("Mock Preset"),
			getPresetSession: vi.fn().mockResolvedValue(null),
			setPresetSession: vi.fn().mockResolvedValue(undefined),
		});
		mockUsePluginSynthRuntime.mockReturnValue({
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
				mode: "plugin",
				setPerformanceMonitorEnabled: vi.fn(),
				getPerformanceMetrics: vi.fn(),
				ensureReady: vi.fn(),
			},
		});
		mockUseSynthPresetManager.mockReset();
		handleSyncPresetSelection = vi.fn();
		mockUseSynthPresetManager.mockReturnValue({
			allPresetEntries: [],
			activePresetId: null,
			activePresetNameBase: "Current State",
			activePresetName: "Current State",
			isPresetDirty: false,
			handleSyncPresetSelection,
			handleLoadPresetByName: vi.fn(),
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
			markPresetDirty: vi.fn(),
			setPresetDirtyState: vi.fn(),
		});
		delete (window as Window & { ipc?: unknown }).ipc;
	});

	it("renders and initializes the preset manager", () => {
		const loadPresetData = vi.fn().mockResolvedValue("Mock Preset");
		mockUsePluginParamBridge.mockReturnValue({
			loadPresetData,
			getPresetSession: vi.fn().mockResolvedValue(null),
			setPresetSession: vi.fn().mockResolvedValue(undefined),
		});

		render(<PluginPage />);

		expect(mockUseSynthPresetManager).toHaveBeenCalledTimes(1);
		const options = mockUseSynthPresetManager.mock.calls[0]?.[0];
		expect(options).not.toHaveProperty("shouldLoadCurrentState");
		expect(loadPresetData).not.toHaveBeenCalled();
	});

	it("calls preset session restore on mount", async () => {
		const getPresetSession = vi.fn().mockResolvedValue({
			activePresetId: "preset-1",
			activePresetNameBase: "Warm Pad",
			isDirty: true,
		});
		mockUsePluginParamBridge.mockReturnValue({
			loadPresetData: vi.fn().mockResolvedValue("Mock Preset"),
			getPresetSession,
			setPresetSession: vi.fn().mockResolvedValue(undefined),
		});

		render(<PluginPage />);

		await vi.waitFor(() => {
			expect(getPresetSession).toHaveBeenCalled();
		});
		expect(mockRendererSyncPresetSelection).toHaveBeenCalledWith("Warm Pad", {
			isDirty: true,
			presetId: "preset-1",
		});
	});

	it("restores current state label when provided by the host session", async () => {
		const getPresetSession = vi.fn().mockResolvedValue({
			activePresetId: null,
			activePresetNameBase: "Current State",
			isDirty: false,
		});
		mockUsePluginParamBridge.mockReturnValue({
			loadPresetData: vi.fn().mockResolvedValue("Mock Preset"),
			getPresetSession,
			setPresetSession: vi.fn().mockResolvedValue(undefined),
		});

		render(<PluginPage />);

		await vi.waitFor(() => {
			expect(mockRendererSyncPresetSelection).toHaveBeenCalledWith(
				"Current State",
				{
					isDirty: false,
					presetId: null,
				},
			);
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
