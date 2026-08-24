import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScopeProvider } from "@/context/ScopeContext";
import {
	VISUALIZATION_MODES,
	type VisualizationMode,
} from "@/features/visualization/visualizationModes";
import PerformanceAudioDisplay from "./PerformanceAudioDisplay";

type CanvasFrame = FrameRequestCallback;

function createAnalyser() {
	let phase = 0;
	const timeTargets: Float32Array[] = [];
	const frequencyTargets: Uint8Array[] = [];
	const analyser = {
		fftSize: 256,
		frequencyBinCount: 128,
		getFloatTimeDomainData(target: Float32Array) {
			timeTargets.push(target);
			for (let index = 0; index < target.length; index++) {
				target[index] = Math.sin(index * 0.08 + phase);
			}
			phase += 0.35;
		},
		getByteFrequencyData(target: Uint8Array) {
			frequencyTargets.push(target);
			for (let index = 0; index < target.length; index++) {
				target[index] = (index * 13 + Math.round(phase * 20)) % 255;
			}
		},
	} as unknown as AnalyserNode;
	return { analyser, frequencyTargets, timeTargets };
}

type DisplayMode = VisualizationMode | "scope" | "waterfall";
type CanvasDimensions = {
	clientWidth?: number;
	clientHeight?: number;
	visibleWidth?: number;
	visibleHeight?: number;
};

function mountDisplay(
	mode: DisplayMode,
	{
		clientWidth = 320,
		clientHeight = 180,
		visibleWidth = clientWidth,
		visibleHeight = clientHeight,
	}: CanvasDimensions = {},
) {
	const analyserState = createAnalyser();
	const analyserNodeRef = { current: analyserState.analyser };
	const audioCtxRef = { current: { sampleRate: 48_000 } as AudioContext };
	const renderDisplay = (displayMode: DisplayMode) => (
		<ScopeProvider
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			effectivePitchHz={220}
		>
			<PerformanceAudioDisplay mode={displayMode} />
		</ScopeProvider>
	);
	const result = render(renderDisplay(mode));
	const canvas = result.container.querySelector("canvas");
	if (!canvas) throw new Error("Expected a performance display canvas");
	Object.defineProperties(canvas, {
		clientWidth: { configurable: true, value: clientWidth },
		clientHeight: { configurable: true, value: clientHeight },
		getBoundingClientRect: {
			configurable: true,
			value: () => ({ width: visibleWidth, height: visibleHeight }),
		},
	});
	return {
		...result,
		analyserState,
		canvas,
		rerenderMode: (nextMode: DisplayMode) =>
			result.rerender(renderDisplay(nextMode)),
	};
}

describe("PerformanceAudioDisplay (browser)", () => {
	let frameCallbacks: CanvasFrame[];
	let nextFrameId: number;

	beforeEach(() => {
		frameCallbacks = [];
		nextFrameId = 0;
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
			frameCallbacks.push(callback);
			return ++nextFrameId;
		});
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
		vi.spyOn(window, "matchMedia").mockImplementation(() => ({
			matches: false,
			media: "(pointer: coarse)",
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			onchange: null,
			dispatchEvent: () => false,
		}));
		Object.defineProperty(window, "devicePixelRatio", {
			configurable: true,
			value: 1,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function step(timestamp: number) {
		const callback = frameCallbacks.shift();
		if (!callback) throw new Error("Expected a scheduled animation frame");
		act(() => callback(timestamp));
	}

	it.each(["scope", "waterfall"] as const)(
		"consumes analyser data for the %s display",
		(mode) => {
			const { analyserState, canvas } = mountDisplay(mode);
			step(0);
			const firstImage = canvas.toDataURL();
			step(40);

			expect(canvas.toDataURL()).not.toBe(firstImage);
			expect(canvas.width).toBe(320);
			expect(canvas.height).toBe(180);
			expect(analyserState.timeTargets[1]).toBe(analyserState.timeTargets[0]);
			if (mode === "waterfall") {
				expect(analyserState.frequencyTargets[1]).toBe(
					analyserState.frequencyTargets[0],
				);
			}
		},
	);

	it("downshifts the canvas tier under sustained slow frames", () => {
		const { canvas } = mountDisplay("scope");
		step(0);
		const slowDrawSpy = vi
			.spyOn(CanvasRenderingContext2D.prototype, "drawImage")
			.mockImplementation(() => {
				const deadline = performance.now() + 20;
				while (performance.now() < deadline) {
					// Simulate a slow canvas compositor without changing application code.
				}
			});
		const changes: string[] = [];
		let previousTier = canvas.dataset.performanceTier;
		const slowStep = (now: number) => {
			step(now);
			const tier = canvas.dataset.performanceTier;
			if (tier !== previousTier) {
				changes.push(tier ?? "missing");
				previousTier = tier;
			}
		};

		for (let now = 2_000; now <= 12_000; now += 2_000) {
			slowStep(now);
		}
		expect(changes).toEqual(["balanced", "low"]);

		slowDrawSpy.mockRestore();
	});

	it("keeps one full-canvas render target across HiDPI mode switches", () => {
		Object.defineProperty(window, "devicePixelRatio", {
			configurable: true,
			value: 2,
		});
		const { canvas, rerenderMode } = mountDisplay("scopeHistory", {
			clientWidth: 320,
			clientHeight: 180,
			visibleWidth: 160,
			visibleHeight: 90,
		});

		for (const [index, mode] of VISUALIZATION_MODES.entries()) {
			rerenderMode(mode);
			step((index + 1) * 40);

			expect(canvas.width).toBe(240);
			expect(canvas.height).toBe(135);
			const transform = canvas.getContext("2d")?.getTransform();
			expect(transform?.a).toBeCloseTo(0.75);
			expect(transform?.d).toBeCloseTo(0.75);
		}
	});
});
