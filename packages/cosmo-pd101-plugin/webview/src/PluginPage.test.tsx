import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage, { clampPluginKeyboardHeight } from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());
const mockUsePluginSynthRuntime = vi.hoisted(() => vi.fn());
const mockCreatePluginPresetManagerRepository = vi.hoisted(() => vi.fn());
const mockSetKeyboardHeight = vi.hoisted(() => vi.fn());

vi.mock("./hooks/usePluginParamBridge", () => ({
	usePluginParamBridge: mockUsePluginParamBridge,
}));

vi.mock("./hooks/usePluginSynthRuntime", () => ({
	usePluginSynthRuntime: mockUsePluginSynthRuntime,
}));

vi.mock("./hooks/createPluginPresetManagerRepository", () => ({
	createPluginPresetManagerRepository: mockCreatePluginPresetManagerRepository,
}));

vi.mock("@cosmo/cosmo-pd101", () => {
	const synthStoreState = {
		applyPreset: vi.fn(),
		gatherPresetState: () => ({ schemaVersion: 1, params: { volume: 1 } }),
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
		PresetManagerProvider: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		SYNTH_RENDERER_DESIGN_HEIGHT: 912,
		SYNTH_RENDERER_MIN_ASPECT_RATIO: 4 / 3,
		SynthRenderer: () => <div data-testid="synth-renderer" />,
		useSynthPresetManager: mockUseSynthPresetManager,
		useSynthStore: (selector: (state: typeof synthStoreState) => unknown) =>
			selector(synthStoreState),
		useSynthUiStore: (selector: (state: typeof synthUiStoreState) => unknown) =>
			selector(synthUiStoreState),
	};
});

describe("PluginPage", () => {
	let syncExternalSelection: ReturnType<typeof vi.fn>;
	let reloadLibrary: ReturnType<typeof vi.fn>;
	let recomputeDirtyState: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockSetKeyboardHeight.mockClear();
		mockUsePluginParamBridge.mockReset();
		mockUsePluginSynthRuntime.mockReset();
		mockCreatePluginPresetManagerRepository.mockReset();
		mockUsePluginParamBridge.mockReturnValue({
			bridgeReady: true,
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
			subscribeScopeFrames: vi.fn(() => () => {}),
		});
		mockCreatePluginPresetManagerRepository.mockReturnValue({
			listEntries: vi.fn(),
		});
		mockUseSynthPresetManager.mockReset();
		syncExternalSelection = vi.fn();
		reloadLibrary = vi.fn().mockResolvedValue(undefined);
		recomputeDirtyState = vi.fn();
		mockUseSynthPresetManager.mockReturnValue({
			allPresetEntries: [],
			navigationEntryIds: [],
			activePresetId: null,
			activePresetNameBase: "Current State",
			activePresetName: "Current State",
			isPresetDirty: false,
			syncExternalSelection,
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
			recomputeDirtyState,
			reloadLibrary,
		});
		delete (window as Window & { ipc?: unknown }).ipc;
	});

	it("renders and creates a plugin repository-backed preset manager", () => {
		render(<PluginPage />);

		expect(mockCreatePluginPresetManagerRepository).toHaveBeenCalledTimes(1);
		expect(mockUseSynthPresetManager).toHaveBeenCalledTimes(1);
		expect(reloadLibrary).toHaveBeenCalled();
	});

	it("restores preset session into the shared preset manager", async () => {
		const getPresetSession = vi.fn().mockResolvedValue({
			activePresetId: "preset-1",
			loadedPresetId: "preset-1",
			activePresetNameBase: "Warm Pad",
			isDirty: true,
		});
		mockUsePluginParamBridge.mockReturnValue({
			bridgeReady: true,
			getPresetSession,
			setPresetSession: vi.fn().mockResolvedValue(undefined),
		});

		render(<PluginPage />);

		await vi.waitFor(() => {
			expect(getPresetSession).toHaveBeenCalled();
		});
		expect(syncExternalSelection).toHaveBeenCalledWith(
			{
				activePresetId: "preset-1",
				activePresetNameBase: "Warm Pad",
				isDirty: true,
			},
			{ stateSync: "immediate" },
		);
	});

	it("recomputes dirty state from external host param updates", async () => {
		render(<PluginPage />);

		const bridgeOptions = mockUsePluginParamBridge.mock.calls[0]?.[0] as
			| { onExternalParamChange?: () => void }
			| undefined;
		bridgeOptions?.onExternalParamChange?.();

		expect(recomputeDirtyState).toHaveBeenCalled();
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
