import { describe, expect, it } from "vitest";
import { AutoScopePhaseLock } from "./autoScopePhaseLock";

const SAMPLE_RATE = 48_000;
const PERIOD = 240;
const FREQUENCY = SAMPLE_RATE / PERIOD;
const PRODUCTION_CASES = [512, 1024].flatMap((length) =>
	[44_100, 48_000, 96_000].flatMap((sampleRate) =>
		[55, 110, 130, 185, 220].map(
			(frequency) => [length, sampleRate, frequency] as const,
		),
	),
);

function complexWave(phase: number): number {
	return (
		Math.sin(phase) +
		Math.sin(phase * 2 + 0.35) * 0.72 +
		Math.sin(phase * 5 - 0.2) * 0.33
	);
}

function changedWave(phase: number): number {
	return Math.sin(phase * 3 + 0.7) * 0.9 + Math.cos(phase * 2) * 0.4;
}

function createPeriodicFrame(
	offset: number,
	length = 4096,
	frequency = FREQUENCY,
	sampleRate = SAMPLE_RATE,
	wave = complexWave,
): Float32Array {
	return Float32Array.from({ length }, (_, index) =>
		wave((offset + index) * ((Math.PI * 2 * frequency) / sampleRate)),
	);
}

function createChordFrame(
	offset: number,
	length = 1024,
	frequencies: readonly number[] = [261.63, 329.63, 392],
): Float32Array {
	return Float32Array.from({ length }, (_, index) =>
		frequencies.reduce(
			(sum, frequency) =>
				sum +
				Math.sin((offset + index) * ((Math.PI * 2 * frequency) / SAMPLE_RATE)),
			0,
		),
	);
}

function circularDistance(a: number, b: number, period: number): number {
	const direct = Math.abs(a - b);
	return Math.min(direct, period - direct);
}

describe("AutoScopePhaseLock", () => {
	it("keeps the same complex-wave landmark as the rolling buffer advances", () => {
		const lock = new AutoScopePhaseLock();
		const offsets = [0, 37, 119, 231, 488, 731];
		const phases = offsets.map((offset) => {
			const result = lock.resolve(
				createPeriodicFrame(offset),
				FREQUENCY,
				SAMPLE_RATE,
				2,
			);
			expect(result.state).toBe("locked");
			return (offset + result.window.start) % PERIOD;
		});

		for (const phase of phases.slice(1)) {
			expect(circularDistance(phase, phases[0], PERIOD)).toBeLessThanOrEqual(2);
		}
	});

	it("keeps the pitch-derived period for rendering", () => {
		const lock = new AutoScopePhaseLock();
		const result = lock.resolve(
			createPeriodicFrame(0),
			FREQUENCY,
			SAMPLE_RATE,
			2,
		);

		expect(result.window.samplesPerCycle).toBeCloseTo(PERIOD, 0);
		expect(result.window.count).toBe(480);
	});

	it("holds a stable frame explicitly when the timbre invalidates the template", () => {
		const lock = new AutoScopePhaseLock();
		expect(
			lock.resolve(createPeriodicFrame(0), FREQUENCY, SAMPLE_RATE, 2).state,
		).toBe("locked");

		const result = lock.resolve(
			createPeriodicFrame(1, 4096, FREQUENCY, SAMPLE_RATE, changedWave),
			FREQUENCY,
			SAMPLE_RATE,
			2,
		);
		expect(result.state).toBe("hold");
		expect(result.heldSamples).toBeInstanceOf(Float32Array);
	});

	it("uses a non-freezing fallback when a low note exceeds a 512-sample payload", () => {
		const frequency = 110;
		const period = SAMPLE_RATE / frequency;
		const lock = new AutoScopePhaseLock();
		const states = [0, 37, 74, 111, 148, 185].map((offset) => {
			const result = lock.resolve(
				createPeriodicFrame(offset, 512, frequency),
				frequency,
				SAMPLE_RATE,
				2,
			);
			expect(result.window.samplesPerCycle).toBeCloseTo(period, 5);
			expect(result.window.count).toBe(510);
			return result.state;
		});

		expect(states.every((state) => state === "fallback")).toBe(true);
	});

	it.each(PRODUCTION_CASES)(
		"preserves the true period for %i samples at %i Hz sample rate and %i Hz",
		(length, sampleRate, frequency) => {
			const period = sampleRate / frequency;
			const result = new AutoScopePhaseLock().resolve(
				createPeriodicFrame(0, length, frequency, sampleRate),
				frequency,
				sampleRate,
				2,
			);

			expect(result.window.samplesPerCycle).toBeCloseTo(period, 5);
			expect(result.window.count).toBeLessThanOrEqual(length - 2);
		},
	);

	it.each([
		["mixed C-major chord", [261.63, 329.63, 392]],
		["detuned beating voices", [220, 224.5]],
	] as const)("does not freeze indefinitely on a %s", (_name, frequencies) => {
		const lock = new AutoScopePhaseLock();
		const states: string[] = [];
		for (let frame = 0; frame < 12; frame++) {
			const result = lock.resolve(
				createChordFrame(frame * 113, 1024, frequencies),
				frequencies[frequencies.length - 1] ?? 392,
				SAMPLE_RATE,
				2,
			);
			states.push(result.state);
			expect(result.window.samplesPerCycle).toBeCloseTo(
				SAMPLE_RATE / (frequencies[frequencies.length - 1] ?? 392),
				5,
			);
		}

		for (let index = 0; index <= states.length - 4; index++) {
			expect(
				states.slice(index, index + 4).every((state) => state === "hold"),
			).toBe(false);
		}
	});

	it("returns a fallback centered window for silence", () => {
		const result = new AutoScopePhaseLock().resolve(
			new Float32Array(4096),
			FREQUENCY,
			SAMPLE_RATE,
			2,
		);

		expect(result).toEqual({
			state: "fallback",
			window: {
				start: 1808,
				count: 480,
				samplesPerCycle: 240,
			},
		});
	});
});
