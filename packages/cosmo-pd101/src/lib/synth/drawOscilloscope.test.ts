import { beforeEach, describe, expect, it, vi } from "vitest";
import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import { drawOscilloscope, type OscilloscopeConfig } from "./drawOscilloscope";

describe("drawOscilloscope", () => {
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let target: VisualizationCanvasTarget;

	beforeEach(() => {
		canvas = document.createElement("canvas");
		// Mock canvas dimensions
		Object.defineProperty(canvas, "clientWidth", {
			value: 100,
			configurable: true,
		});
		Object.defineProperty(canvas, "clientHeight", {
			value: 50,
			configurable: true,
		});

		ctx = {
			setTransform: vi.fn(),
			clearRect: vi.fn(),
			drawImage: vi.fn(),
			fillRect: vi.fn(),
			beginPath: vi.fn(),
			moveTo: vi.fn(),
			lineTo: vi.fn(),
			stroke: vi.fn(),
			lineWidth: 0,
			strokeStyle: "",
			fillStyle: "",
			shadowColor: "",
			shadowBlur: 0,
		} as unknown as CanvasRenderingContext2D;

		canvas.getContext = vi.fn().mockReturnValue(ctx);
		target = {
			canvas,
			context: ctx,
			width: 100,
			height: 50,
			pixelWidth: 100,
			pixelHeight: 50,
			scaleX: 1,
			scaleY: 1,
		};
	});

	const defaultConfig: OscilloscopeConfig = {
		cycles: 1,
		verticalZoom: 1,
		triggerLevel: 128,
		triggerMode: "rise",
	};

	it("does not resize the controller-owned backing store", () => {
		canvas.width = 200;
		canvas.height = 100;
		target = {
			...target,
			pixelWidth: 200,
			pixelHeight: 100,
			scaleX: 2,
			scaleY: 2,
		};
		drawOscilloscope(target, new Float32Array(100), defaultConfig, 440, 44100);
		expect(canvas.width).toBe(200);
		expect(canvas.height).toBe(100);
	});

	it("handles empty samples", () => {
		drawOscilloscope(target, new Float32Array(0), defaultConfig, 440, 44100);
		expect(ctx.fillRect).toHaveBeenCalled();
		expect(ctx.fillStyle).toBe("#051005");
	});

	it("handles very small number of samples", () => {
		drawOscilloscope(target, new Float32Array(1), defaultConfig, 440, 44100);
		expect(ctx.fillRect).toHaveBeenCalled();
		expect(ctx.fillStyle).toBe("#051005");
	});

	it("draws a waveform with Float32Array", () => {
		const samples = new Float32Array(1000)
			.fill(0)
			.map((_, i) => Math.sin(i * 0.1));
		drawOscilloscope(target, samples, defaultConfig, 440, 44100);

		expect(ctx.beginPath).toHaveBeenCalled();
		expect(ctx.moveTo).toHaveBeenCalled();
		expect(ctx.lineTo).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("draws a waveform with Uint8Array", () => {
		const samples = new Uint8Array(1000)
			.fill(0)
			.map((_, i) => Math.sin(i * 0.1) * 127 + 128);
		drawOscilloscope(target, samples, defaultConfig, 440, 44100);

		expect(ctx.beginPath).toHaveBeenCalled();
		expect(ctx.moveTo).toHaveBeenCalled();
		expect(ctx.lineTo).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("respects triggerMode 'off'", () => {
		const samples = new Float32Array(1000)
			.fill(0)
			.map((_, i) => Math.sin(i * 0.1));
		const config = {
			...defaultConfig,
			triggerMode: "off" as const,
			startIndex: 100,
		};
		drawOscilloscope(target, samples, config, 440, 44100);

		// If triggerMode is off and startIndex is provided, it should use startIndex.
		// We can't easily check the exact points without a more detailed mock,
		// but we've exercised the path.
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("respects triggerMode 'rise'", () => {
		const samples = new Float32Array(1000).fill(0);
		samples[100] = 0.5; // Rise at index 100
		const config = {
			...defaultConfig,
			triggerMode: "rise" as const,
			triggerLevel: 0,
		};
		drawOscilloscope(target, samples, config, 440, 44100);
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("respects triggerMode 'fall'", () => {
		const samples = new Float32Array(1000).fill(0);
		samples[100] = -0.5; // Fall at index 100
		const config = {
			...defaultConfig,
			triggerMode: "fall" as const,
			triggerLevel: 0,
		};
		drawOscilloscope(target, samples, config, 440, 44100);
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("uses custom colors", () => {
		const samples = new Float32Array(1000).fill(0);
		const config = {
			...defaultConfig,
			color: "red",
			gridColor: "blue",
		};
		drawOscilloscope(target, samples, config, 440, 44100);
		expect(ctx.strokeStyle).toBe("red");
	});

	it("handles fixedWindowSamples", () => {
		const samples = new Float32Array(1000).fill(0);
		const config = { ...defaultConfig, fixedWindowSamples: 500 };
		drawOscilloscope(target, samples, config, 440, 44100);
		expect(ctx.stroke).toHaveBeenCalled();
	});
});
