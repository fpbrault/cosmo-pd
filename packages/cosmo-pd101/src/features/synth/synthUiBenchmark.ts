import { FACTORY_PRESETS } from "@/lib/synth/factoryCzPresets";
import { useSynthStore } from "./synthStore";

type BenchmarkRunOptions = {
	presetName?: string;
	scenarioIds?: string[];
};

type BenchmarkCase = {
	mode: string;
	scenario: string;
	presetName: string;
	summary: {
		p50LastMs: number;
		p95LastMs: number;
		maxLastRtPercent: number;
		sampleCount: number;
		totalMs: number;
	};
};

type BenchmarkReport = {
	mode: string;
	cases: BenchmarkCase[];
};

type BenchmarkRegistrationOptions = {
	mode: string;
};

type Scenario = {
	id: string;
	run: (presetName: string) => Promise<number[]>;
};

declare global {
	interface Window {
		__czBenchmark?: {
			runAll: (options?: BenchmarkRunOptions) => Promise<BenchmarkReport>;
		};
	}
}

const FRAME_BUDGET_MS = 1000 / 60;

const nextFrame = () =>
	new Promise<number>((resolve) => {
		requestAnimationFrame(resolve);
	});

async function waitForFrames(count: number): Promise<void> {
	for (let index = 0; index < count; index += 1) {
		await nextFrame();
	}
}

function percentile(values: number[], percentileValue: number): number {
	if (values.length === 0) {
		return 0;
	}
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.min(
		sorted.length - 1,
		Math.floor((percentileValue / 100) * sorted.length),
	);
	return sorted[index] ?? 0;
}

function summarize(values: number[]) {
	const p50LastMs = percentile(values, 50);
	const p95LastMs = percentile(values, 95);
	const maxLastMs = values.reduce((max, value) => Math.max(max, value), 0);
	const totalMs = values.reduce((sum, value) => sum + value, 0);
	return {
		p50LastMs,
		p95LastMs,
		maxLastRtPercent: (maxLastMs / FRAME_BUDGET_MS) * 100,
		sampleCount: values.length,
		totalMs,
	};
}

function findPreset(name: string) {
	return (
		FACTORY_PRESETS.find((preset) => preset.name === name) ??
		FACTORY_PRESETS[0]
	);
}

async function measureFrames(sampleCount: number): Promise<number[]> {
	const samples: number[] = [];
	let previous = await nextFrame();
	for (let index = 0; index < sampleCount; index += 1) {
		const current = await nextFrame();
		samples.push(current - previous);
		previous = current;
	}
	return samples;
}

async function runPresetApplyScenario(presetName: string): Promise<number[]> {
	const preset = findPreset(presetName);
	if (!preset) {
		return [];
	}

	const samples: number[] = [];
	for (let index = 0; index < 24; index += 1) {
		const startedAt = performance.now();
		useSynthStore.getState().applyPreset(preset.data);
		await waitForFrames(2);
		samples.push(performance.now() - startedAt);
	}
	return samples;
}

async function runMacroSweepScenario(): Promise<number[]> {
	const samples: number[] = [];
	for (let index = 0; index < 60; index += 1) {
		const value = (index % 16) / 15;
		const startedAt = performance.now();
		useSynthStore.getState().setMacro1(value);
		await nextFrame();
		samples.push(performance.now() - startedAt);
	}
	return samples;
}

const SCENARIOS: Scenario[] = [
	{
		id: "steady-frames",
		run: () => measureFrames(90),
	},
	{
		id: "preset-apply",
		run: runPresetApplyScenario,
	},
	{
		id: "macro-sweep",
		run: runMacroSweepScenario,
	},
];

export function registerSynthUiBenchmark({
	mode,
}: BenchmarkRegistrationOptions): void {
	window.__czBenchmark = {
		async runAll(options = {}) {
			const presetName = options.presetName ?? "Current State";
			const requestedScenarios = new Set(options.scenarioIds ?? []);
			const scenarios =
				requestedScenarios.size > 0
					? SCENARIOS.filter((scenario) => requestedScenarios.has(scenario.id))
					: SCENARIOS;

			const cases: BenchmarkCase[] = [];
			for (const scenario of scenarios) {
				await waitForFrames(3);
				const samples = await scenario.run(presetName);
				cases.push({
					mode,
					scenario: scenario.id,
					presetName,
					summary: summarize(samples),
				});
			}

			return { mode, cases };
		},
	};
}
