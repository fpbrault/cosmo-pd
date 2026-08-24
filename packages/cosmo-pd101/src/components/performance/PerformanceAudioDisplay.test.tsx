import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutoScopePhaseLock } from "@/components/panels/analysis/scope-visualizations/autoScopePhaseLock";
import { ScopeProvider } from "@/context/ScopeContext";
import { calculateCanvasBackingSize } from "./displayPerformance";
import PerformanceAudioDisplay, {
	getPerformanceDisplayProfile,
} from "./PerformanceAudioDisplay";

const analyserNodeRef = { current: null };
const audioCtxRef = { current: null };

function renderDisplay(effectivePitchHz: number) {
	return (
		<ScopeProvider
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			effectivePitchHz={effectivePitchHz}
		>
			<PerformanceAudioDisplay mode="scope" />
		</ScopeProvider>
	);
}

describe("PerformanceAudioDisplay", () => {
	beforeEach(() => {
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("keeps scope history intact when the played note changes", () => {
		const reset = vi.spyOn(AutoScopePhaseLock.prototype, "reset");
		const { rerender } = render(renderDisplay(220));
		const resetsAfterMount = reset.mock.calls.length;

		rerender(renderDisplay(440));

		expect(resetsAfterMount).toBeGreaterThan(0);
		expect(reset).toHaveBeenCalledTimes(resetsAfterMount);
	});

	it("uses a responsive, lower-cost profile on constrained hosts", () => {
		expect(getPerformanceDisplayProfile("constrained")).toMatchObject({
			historyInterval: 33,
			maxPixelRatio: 1.5,
			glowBlur: 4,
		});
	});

	it("sizes the backing canvas from its transformed visible size", () => {
		expect(
			calculateCanvasBackingSize({
				clientWidth: 800,
				clientHeight: 300,
				visibleWidth: 600,
				visibleHeight: 225,
				devicePixelRatio: 3,
				maxPixelRatio: 2,
			}),
		).toEqual({ width: 1_200, height: 450 });
	});

	it("repaints external scope history only when a new row is ready", () => {
		let animationFrame: FrameRequestCallback | undefined;
		vi.mocked(window.requestAnimationFrame).mockImplementation((callback) => {
			animationFrame = callback;
			return 1;
		});
		const fillRect = vi.fn();
		const drawImage = vi.fn();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
			beginPath: vi.fn(),
			drawImage,
			fillRect,
			lineTo: vi.fn(),
			moveTo: vi.fn(),
			setTransform: vi.fn(),
			stroke: vi.fn(),
		} as unknown as CanvasRenderingContext2D);
		let onScopeFrame:
			| ((frame: {
					samples: Float32Array;
					sampleRate: number;
					hz: number;
			  }) => void)
			| undefined;
		const subscribeScopeFrames = vi.fn((callback) => {
			onScopeFrame = callback;
			return () => {};
		});
		const { container } = render(
			<ScopeProvider
				analyserNodeRef={analyserNodeRef}
				audioCtxRef={audioCtxRef}
				effectivePitchHz={220}
				scopePerformanceMode="constrained"
				subscribeScopeFrames={subscribeScopeFrames}
			>
				<PerformanceAudioDisplay mode="scope" />
			</ScopeProvider>,
		);
		const canvas = container.querySelector("canvas");
		expect(canvas).not.toBeNull();
		Object.defineProperties(canvas as HTMLCanvasElement, {
			clientWidth: { configurable: true, value: 800 },
			clientHeight: { configurable: true, value: 300 },
		});

		animationFrame?.(0);
		expect(fillRect).toHaveBeenCalledTimes(1);
		expect(drawImage).toHaveBeenCalledTimes(1);

		const samples = Float32Array.from({ length: 512 }, (_, index) =>
			Math.sin((index / 218) * Math.PI * 2),
		);
		onScopeFrame?.({ samples, sampleRate: 48_000, hz: 220 });
		animationFrame?.(40);
		expect(drawImage).toHaveBeenCalledTimes(2);

		animationFrame?.(56);
		expect(drawImage).toHaveBeenCalledTimes(2);

		onScopeFrame?.({ samples, sampleRate: 48_000, hz: 220 });
		animationFrame?.(73);
		expect(drawImage).toHaveBeenCalledTimes(3);

		animationFrame?.(89);
		expect(drawImage).toHaveBeenCalledTimes(3);

		onScopeFrame?.({ samples, sampleRate: 48_000, hz: 220 });
		animationFrame?.(106);
		expect(drawImage).toHaveBeenCalledTimes(4);
	});

	it("repaints the current frame when an idle canvas is resized", () => {
		let animationFrame: FrameRequestCallback | undefined;
		let resizeCallback: ResizeObserverCallback | undefined;
		vi.mocked(window.requestAnimationFrame).mockImplementation((callback) => {
			animationFrame = callback;
			return 1;
		});
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(callback: ResizeObserverCallback) {
					resizeCallback = callback;
				}

				observe() {}
				disconnect() {}
				unobserve() {}
			},
		);
		const drawImage = vi.fn();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
			beginPath: vi.fn(),
			drawImage,
			fillRect: vi.fn(),
			lineTo: vi.fn(),
			moveTo: vi.fn(),
			setTransform: vi.fn(),
			stroke: vi.fn(),
		} as unknown as CanvasRenderingContext2D);
		const subscribeScopeFrames = vi.fn(() => () => {});
		render(
			<ScopeProvider
				analyserNodeRef={analyserNodeRef}
				audioCtxRef={audioCtxRef}
				effectivePitchHz={220}
				subscribeScopeFrames={subscribeScopeFrames}
			>
				<PerformanceAudioDisplay mode="scope" />
			</ScopeProvider>,
		);

		animationFrame?.(0);
		expect(drawImage).toHaveBeenCalledTimes(1);

		resizeCallback?.([], {} as ResizeObserver);
		animationFrame?.(40);
		expect(drawImage).toHaveBeenCalledTimes(2);
	});
});
