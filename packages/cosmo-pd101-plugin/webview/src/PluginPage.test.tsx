import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PluginPage from "./PluginPage";

const mockUseSynthPresetManager = vi.hoisted(() => vi.fn());
const mockUsePluginParamBridge = vi.hoisted(() => vi.fn());
const mockUsePluginSynthRuntime = vi.hoisted(() => vi.fn());
const mockCreatePluginPresetManagerRepository = vi.hoisted(() => vi.fn());
const mockComputeRendererFrameLayout = vi.hoisted(() =>
	vi.fn(
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
		}),
	),
);
const mockComputeAuv3HostFitLayout = vi.hoisted(() =>
	vi.fn(
		({
			hostWidth,
			hostHeight,
			deviceLandscapeAspectRatio,
		}: {
			hostWidth: number;
			hostHeight: number;
			deviceLandscapeAspectRatio: number;
		}) => ({
			aspectRatio: deviceLandscapeAspectRatio,
			naturalWidth: hostWidth,
			naturalHeight: hostHeight,
			scale: 1,
			scaledWidth: hostWidth,
			scaledHeight: hostHeight,
			offsetX: 0,
			offsetY: 0,
		}),
	),
);
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
	};

	return {
		computeAuv3HostFitLayout: mockComputeAuv3HostFitLayout,
		computeRendererFrameLayout: mockComputeRendererFrameLayout,
		PresetManagerProvider: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		SYNTH_RENDERER_DESIGN_HEIGHT: 912,
		SYNTH_RENDERER_MAX_ASPECT_RATIO: 3 / 2,
		SYNTH_RENDERER_MIN_ASPECT_RATIO: 4 / 3,
		SynthRenderer: ({
			keyboardSettingsExtra,
		}: {
			keyboardSettingsExtra?: React.ReactNode;
		}) => (
			<div data-testid="synth-renderer">
				{keyboardSettingsExtra ? (
					<div data-testid="keyboard-settings-extra">
						{keyboardSettingsExtra}
					</div>
				) : null}
			</div>
		),
		useSynthPresetManager: mockUseSynthPresetManager,
		useSynthStore: (selector: (state: typeof synthStoreState) => unknown) =>
			selector(synthStoreState),
		useSynthUiStore: (selector: (state: typeof synthUiStoreState) => unknown) =>
			selector(synthUiStoreState),
		useGlobalSynthSettings: (selector: (state: unknown) => unknown) =>
			selector({
				voiceLimit: 8,
				setVoiceLimit: vi.fn(),
			}),
	};
});

describe("PluginPage", () => {
	let syncExternalSelection: ReturnType<typeof vi.fn>;
	let reloadLibrary: ReturnType<typeof vi.fn>;
	let recomputeDirtyState: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockComputeAuv3HostFitLayout.mockReset();
		mockComputeAuv3HostFitLayout.mockImplementation(
			({
				hostWidth,
				hostHeight,
				deviceLandscapeAspectRatio,
			}: {
				hostWidth: number;
				hostHeight: number;
				deviceLandscapeAspectRatio: number;
			}) => ({
				aspectRatio: deviceLandscapeAspectRatio,
				naturalWidth: hostWidth,
				naturalHeight: hostHeight,
				scale: 1,
				scaledWidth: hostWidth,
				scaledHeight: hostHeight,
				offsetX: 0,
				offsetY: 0,
			}),
		);
		mockComputeRendererFrameLayout.mockReset();
		mockComputeRendererFrameLayout.mockImplementation(
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
			}),
		);
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
			pitchBend: 0,
			modWheel: 0,
			sendNoteOn: vi.fn(),
			sendNoteOff: vi.fn(),
			sendPitchBend: vi.fn(),
			sendModWheel: vi.fn(),
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
			savePresetAs: vi.fn(),
			deletePreset: vi.fn(),
			renamePreset: vi.fn(),
			setPresetAuthor: vi.fn(),
			setPresetDescription: vi.fn(),
			setPresetFavorite: vi.fn(),
			setPresetTags: vi.fn(),
			initPreset: vi.fn(),
			exportPreset: vi.fn(),
			importPreset: vi.fn(),
			exportCurrentState: vi.fn(),
			recomputeDirtyState,
			reloadLibrary,
		});
		delete (
			window as Window & {
				__czHostPlatform?: string;
				__czHostSize?: { width: number; height: number };
				__czRuntimeMode?: string;
				ipc?: unknown;
			}
		).__czHostPlatform;
		delete (
			window as Window & {
				__czHostPlatform?: string;
				__czHostSize?: { width: number; height: number };
				__czRuntimeMode?: string;
				ipc?: unknown;
			}
		).__czHostSize;
		delete (
			window as Window & {
				__czHostPlatform?: string;
				__czHostSize?: { width: number; height: number };
				__czRuntimeMode?: string;
				__czSupportsStandaloneAppSettings?: boolean;
				ipc?: unknown;
			}
		).__czRuntimeMode;
		delete (
			window as Window & {
				__czSupportsStandaloneAppSettings?: boolean;
			}
		).__czSupportsStandaloneAppSettings;
		delete (
			window as Window & {
				__czGetStandaloneAppSettings?: unknown;
			}
		).__czGetStandaloneAppSettings;
		delete (
			window as Window & {
				__czSetStandaloneAppSettings?: unknown;
			}
		).__czSetStandaloneAppSettings;
		delete (window as Window & { ipc?: unknown }).ipc;
	});

	it("renders and creates a plugin repository-backed preset manager", () => {
		render(<PluginPage appVersion="0.2.0" />);

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

		render(<PluginPage appVersion="0.2.0" />);

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
		render(<PluginPage appVersion="0.2.0" />);

		const bridgeOptions = mockUsePluginParamBridge.mock.calls[0]?.[0] as
			| { onExternalParamChange?: () => void }
			| undefined;
		bridgeOptions?.onExternalParamChange?.();

		expect(recomputeDirtyState).toHaveBeenCalled();
	});

	it("fits AUv3 hosted content with the same centered fit-bounds layout as standalone", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: { width: number; height: number; fitMode?: string };
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";
		(
			window as Window & {
				__czHostSize?: { width: number; height: number; fitMode?: string };
			}
		).__czHostSize = {
			width: 684,
			height: 456,
			fitMode: "fit-width",
		};
		mockComputeAuv3HostFitLayout.mockReturnValue({
			aspectRatio: 1.5,
			naturalWidth: 1368,
			naturalHeight: 912,
			scale: 0.5,
			scaledWidth: 684,
			scaledHeight: 456,
			offsetX: 42,
			offsetY: 24,
		});

		const { container } = render(<PluginPage appVersion="0.2.0" />);
		const hostedViewport = container.firstElementChild as HTMLElement;
		const scaledFrame = container.querySelector(
			'[style*="transform: scale(0.5)"]',
		);
		const centeredWrapper = scaledFrame?.parentElement as HTMLElement;

		expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
			expect.objectContaining({
				hostWidth: 684,
				hostHeight: 456,
				fitMode: "fit-bounds",
			}),
		);
		expect(hostedViewport.className).toContain("overflow-hidden");
		expect(hostedViewport.className).not.toContain("overflow-y-auto");
		expect(hostedViewport.className).not.toContain("overflow-x-hidden");
		expect(scaledFrame).toBeInstanceOf(HTMLElement);
		expect((scaledFrame as HTMLElement).style.transform).toBe("scale(0.5)");
		expect((scaledFrame as HTMLElement).style.transformOrigin).toBe("top left");
		expect(centeredWrapper.style.left).toBe("42px");
		expect(centeredWrapper.style.top).toBe("24px");
		expect(centeredWrapper.style.width).toBe("684px");
		expect(centeredWrapper.style.height).toBe("456px");
	});

	it("lets AUv3 hosted content adapt its renderer aspect ratio to portrait hosts", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostSize = {
			width: 768,
			height: 1024,
			deviceLandscapeAspectRatio: 4 / 3,
		};
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 768,
				bottom: 1024,
				width: 768,
				height: 1024,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			render(<PluginPage appVersion="0.2.0" />);

			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 768,
					hostHeight: 1024,
					deviceLandscapeAspectRatio: 4 / 3,
					fitMode: "fit-bounds",
				}),
			);
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("uses native AUv3 host bounds instead of the WKWebView layout viewport", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";
		(
			window as Window & {
				__czHostPlatform?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostSize = {
			width: 684,
			height: 456,
			deviceLandscapeAspectRatio: 16 / 11,
		};
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1368,
				bottom: 912,
				width: 1368,
				height: 912,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			render(<PluginPage appVersion="0.2.0" />);

			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 684,
					hostHeight: 456,
					deviceLandscapeAspectRatio: 16 / 11,
					fitMode: "fit-bounds",
				}),
			);
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("uses AUv3 host-size layout for native iOS webviews without treating them as hosted", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostSize = {
			width: 684,
			height: 456,
			deviceLandscapeAspectRatio: 16 / 11,
			fitMode: "fit-bounds",
		};
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1024,
				bottom: 768,
				width: 1024,
				height: 768,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			const { container } = render(<PluginPage appVersion="0.2.0" />);
			const viewport = container.firstElementChild as HTMLElement;

			expect(mockComputeRendererFrameLayout).toHaveBeenCalledTimes(1);
			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 684,
					hostHeight: 456,
					deviceLandscapeAspectRatio: 16 / 11,
					fitMode: "fit-bounds",
				}),
			);
			expect(viewport.className).toContain("overflow-hidden");
			expect(viewport.className).not.toContain("overflow-y-auto");
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("keeps AUv3 standalone runtime on the centered fit-bounds host-size path", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "standalone";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostSize = {
			width: 684,
			height: 456,
			deviceLandscapeAspectRatio: 16 / 11,
			fitMode: "fit-bounds",
		};
		mockComputeAuv3HostFitLayout.mockReturnValue({
			aspectRatio: 1.5,
			naturalWidth: 1368,
			naturalHeight: 912,
			scale: 0.5,
			scaledWidth: 684,
			scaledHeight: 456,
			offsetX: 248,
			offsetY: 182,
		});
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1180,
				bottom: 820,
				width: 1180,
				height: 820,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			const { container } = render(<PluginPage appVersion="0.2.0" />);
			const viewport = container.firstElementChild as HTMLElement;
			const centeredWrapper = container.querySelector(
				'[style*="left: 248px"][style*="top: 182px"]',
			) as HTMLElement | null;

			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 684,
					hostHeight: 456,
					deviceLandscapeAspectRatio: 16 / 11,
					fitMode: "fit-bounds",
				}),
			);
			expect(mockComputeRendererFrameLayout).toHaveBeenCalledTimes(1);
			expect(viewport.className).toContain("overflow-hidden");
			expect(viewport.className).not.toContain("overflow-y-auto");
			expect(centeredWrapper).toBeInstanceOf(HTMLElement);
			expect(centeredWrapper?.style.width).toBe("684px");
			expect(centeredWrapper?.style.height).toBe("456px");
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("shows AUv3 app settings in AUv3 webviews without waiting for the standalone support flag", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czSupportsStandaloneAppSettings?: boolean;
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";

		const { getByText } = render(<PluginPage appVersion="0.2.0" />);

		expect(getByText("AUv3 App")).toBeInstanceOf(HTMLElement);
	});

	it("shows AUv3 app settings in the standalone AUv3 app", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czSupportsStandaloneAppSettings?: boolean;
				__czGetStandaloneAppSettings?: () => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
				__czSetStandaloneAppSettings?: (settings: {
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}) => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "standalone";
		(
			window as Window & {
				__czGetStandaloneAppSettings?: () => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czGetStandaloneAppSettings = vi.fn(async () => ({
			midiChannel: 0,
			keepRunningInBackground: false,
			bufferSize: 128,
		}));
		(
			window as Window & {
				__czSetStandaloneAppSettings?: (settings: {
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}) => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czSetStandaloneAppSettings = vi.fn(async (settings) => settings);

		const { getByText } = render(<PluginPage appVersion="0.2.0" />);

		expect(getByText("AUv3 App")).toBeInstanceOf(HTMLElement);
		expect(getByText("MIDI Channel")).toBeInstanceOf(HTMLElement);
		expect(getByText("Run In Background")).toBeInstanceOf(HTMLElement);
		expect(getByText("Buffer Size")).toBeInstanceOf(HTMLElement);
	});

	it("shows AUv3 app settings when standalone support arrives after render", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czSupportsStandaloneAppSettings?: boolean;
				__czGetStandaloneAppSettings?: () => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
				__czSetStandaloneAppSettings?: (settings: {
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}) => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czHostPlatform = undefined;
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "plugin";
		(
			window as Window & {
				__czGetStandaloneAppSettings?: () => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czGetStandaloneAppSettings = vi.fn(
			() =>
				new Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>(() => {}),
		);
		(
			window as Window & {
				__czSetStandaloneAppSettings?: (settings: {
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}) => Promise<{
					midiChannel: number;
					keepRunningInBackground: boolean;
					bufferSize: number;
				}>;
			}
		).__czSetStandaloneAppSettings = vi.fn(async (settings) => settings);

		const { getByText, queryByText } = render(
			<PluginPage appVersion="0.2.0" />,
		);

		expect(queryByText("AUv3 App")).toBeNull();

		act(() => {
			(
				window as Window & {
					__czRuntimeMode?: string;
					__czSupportsStandaloneAppSettings?: boolean;
				}
			).__czRuntimeMode = "standalone";
			(
				window as Window & {
					__czSupportsStandaloneAppSettings?: boolean;
				}
			).__czSupportsStandaloneAppSettings = true;
			window.dispatchEvent(new Event("cz-host-context-changed"));
		});

		expect(getByText("AUv3 App")).toBeInstanceOf(HTMLElement);
		expect(getByText("MIDI Channel")).toBeInstanceOf(HTMLElement);
		expect(getByText("Run In Background")).toBeInstanceOf(HTMLElement);
		expect(getByText("Buffer Size")).toBeInstanceOf(HTMLElement);
	});

	it("centers the AUv3 standalone wrapper while keeping the scaled renderer anchored top-left", () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "standalone";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
					fitMode?: string;
				};
			}
		).__czHostSize = {
			width: 1024,
			height: 768,
			deviceLandscapeAspectRatio: 4 / 3,
			fitMode: "fit-bounds",
		};
		mockComputeAuv3HostFitLayout.mockReturnValue({
			aspectRatio: 4 / 3,
			naturalWidth: 1368,
			naturalHeight: 912,
			scale: 0.5,
			scaledWidth: 684,
			scaledHeight: 456,
			offsetX: 170,
			offsetY: 156,
		});
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1024,
				bottom: 768,
				width: 1024,
				height: 768,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			const { container } = render(<PluginPage appVersion="0.2.0" />);
			const viewport = container.firstElementChild as HTMLElement;
			const scaledRenderer = container.querySelector(
				'[style*="transform: scale(0.5)"]',
			) as HTMLElement | null;
			const centeredWrapper = scaledRenderer?.parentElement as
				| HTMLElement
				| undefined;

			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 1024,
					hostHeight: 768,
					fitMode: "fit-bounds",
				}),
			);
			expect(viewport.className).toContain("overflow-hidden");
			expect(viewport.className).not.toContain("items-center");
			expect(viewport.className).not.toContain("justify-center");
			expect(centeredWrapper?.className).toContain("absolute");
			expect(centeredWrapper?.style.left).toBe("170px");
			expect(centeredWrapper?.style.top).toBe("156px");
			expect(centeredWrapper?.style.width).toBe("684px");
			expect(centeredWrapper?.style.height).toBe("456px");
			expect(scaledRenderer).toBeInstanceOf(HTMLElement);
			expect(scaledRenderer?.className).toContain("absolute");
			expect(scaledRenderer?.className).toContain("top-0");
			expect(scaledRenderer?.className).toContain("left-0");
			expect(scaledRenderer?.style.transformOrigin).toBe("top left");
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("keeps generic browser standalone on the centered renderer layout path", () => {
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1024,
				bottom: 768,
				width: 1024,
				height: 768,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			const { container } = render(<PluginPage appVersion="0.2.0" />);
			const viewport = container.firstElementChild as HTMLElement;

			expect(mockComputeAuv3HostFitLayout).not.toHaveBeenCalled();
			expect(mockComputeRendererFrameLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					availableWidth: 1024,
					availableHeight: 768,
				}),
			);
			expect(viewport.className).toContain("items-center");
			expect(viewport.className).toContain("justify-center");
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});

	it("recomputes AUv3 layout when the native host size event fires", async () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostSize = {
			width: 640,
			height: 480,
			deviceLandscapeAspectRatio: 4 / 3,
		};

		render(<PluginPage appVersion="0.2.0" />);
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostSize = {
			width: 800,
			height: 600,
			deviceLandscapeAspectRatio: 16 / 11,
		};
		window.dispatchEvent(new CustomEvent("cz-host-size-changed"));

		await vi.waitFor(() => {
			expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
				expect.objectContaining({
					hostWidth: 800,
					hostHeight: 600,
					deviceLandscapeAspectRatio: 16 / 11,
					fitMode: "fit-bounds",
				}),
			);
		});
	});

	it("uses current element bounds during live AUv3 resize events", async () => {
		(
			window as Window & {
				__czHostPlatform?: string;
				__czRuntimeMode?: string;
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostPlatform = "ios";
		(
			window as Window & {
				__czRuntimeMode?: string;
			}
		).__czRuntimeMode = "auv3-hosted";
		(
			window as Window & {
				__czHostSize?: {
					width: number;
					height: number;
					deviceLandscapeAspectRatio?: number;
				};
			}
		).__czHostSize = {
			width: 640,
			height: 480,
			deviceLandscapeAspectRatio: 4 / 3,
		};
		const getBoundingClientRect = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 900,
				bottom: 700,
				width: 900,
				height: 700,
				toJSON: () => ({}),
			} as DOMRect);

		try {
			render(<PluginPage appVersion="0.2.0" />);
			window.dispatchEvent(new Event("resize"));

			await vi.waitFor(() => {
				expect(mockComputeAuv3HostFitLayout).toHaveBeenLastCalledWith(
					expect.objectContaining({
						hostWidth: 900,
						hostHeight: 700,
						deviceLandscapeAspectRatio: 4 / 3,
						fitMode: "fit-bounds",
					}),
				);
			});
		} finally {
			getBoundingClientRect.mockRestore();
		}
	});
});
