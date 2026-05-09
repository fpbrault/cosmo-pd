import type { PerformanceMetrics } from "@/components/performance/PerformanceMonitor";

export type BenchmarkMode = "web" | "plugin";

export type BenchmarkScenarioDefinition = {
	id: string;
	label: string;
	description: string;
	estimatedDurationMs: number;
};

export type BenchmarkMetricSample = PerformanceMetrics & {
	elapsedMs: number;
	timestampMs: number;
};

export type BenchmarkCaseResult = {
	mode: BenchmarkMode;
	scenario: string;
	presetName: string;
	samples: BenchmarkMetricSample[];
	summary: {
		sampleCount: number;
		p50LastMs: number;
		p95LastMs: number;
		maxLastMs: number;
		p50LastRtPercent: number;
		p95LastRtPercent: number;
		maxLastRtPercent: number;
		finalAvgMs: number;
		finalMaxMs: number;
		finalBlockCount: number;
		finalBlockSamples: number;
		finalSampleRate: number;
	};
};

export type BenchmarkReport = {
	mode: BenchmarkMode;
	generatedAt: string;
	cases: BenchmarkCaseResult[];
};

export type BenchmarkRunOptions = {
	presetName?: string;
	scenarioIds?: string[];
	sampleIntervalMs?: number;
};

export type BenchmarkApi = {
	listScenarios: () => BenchmarkScenarioDefinition[];
	listBuiltinPresets: () => string[];
	runCase: (options: {
		scenarioId: string;
		presetName?: string;
	}) => Promise<BenchmarkCaseResult>;
	runAll: (options?: BenchmarkRunOptions) => Promise<BenchmarkReport>;
};

type BenchmarkRuntime = {
	mode: BenchmarkMode;
	listBuiltinPresets?: () => string[];
	loadBuiltinPreset?: (name: string) => void | Promise<void>;
	setPerformanceMonitorEnabled: (enabled: boolean) => void | Promise<void>;
	getPerformanceMetrics: () =>
		| PerformanceMetrics
		| null
		| Promise<PerformanceMetrics | null>;
	noteOn: (note: number, velocity?: number) => void | Promise<void>;
	noteOff: (note: number) => void | Promise<void>;
	panic: () => void | Promise<void>;
	ensureReady?: () => void | Promise<void>;
	presetSettleMs?: number;
	monitorSettleMs?: number;
	postRunSettleMs?: number;
};

declare global {
	interface Window {
		__czBenchmark?: BenchmarkApi;
	}
}

const DEFAULT_SAMPLE_INTERVAL_MS = 125;
const DEFAULT_PRESET_SETTLE_MS = 500;
const DEFAULT_MONITOR_SETTLE_MS = 200;
const DEFAULT_POST_RUN_SETTLE_MS = 400;

type ScenarioRunner = (runtime: BenchmarkRuntime) => Promise<void>;

const BENCHMARK_SCENARIOS: Array<
	BenchmarkScenarioDefinition & { run: ScenarioRunner }
> = [
	{
		id: "idle",
		label: "Idle",
		description: "Measure the engine with no active voices.",
		estimatedDurationMs: 3000,
		run: async () => {
			await wait(3000);
		},
	},
	{
		id: "single-note",
		label: "Single Note Sustain",
		description: "Hold a single note to measure a steady-state voice.",
		estimatedDurationMs: 3200,
		run: async (runtime) => {
			await runtime.noteOn(60, 112);
			await wait(2600);
			await runtime.noteOff(60);
			await wait(600);
		},
	},
	{
		id: "octave-pulses",
		label: "Octave Pulses",
		description: "Alternate octave notes to measure note-on/note-off churn.",
		estimatedDurationMs: 3600,
		run: async (runtime) => {
			const sequence = [48, 60, 72, 60, 48, 72, 60, 48];
			for (const note of sequence) {
				await runtime.noteOn(note, 108);
				await wait(180);
				await runtime.noteOff(note);
				await wait(220);
			}
		},
	},
	{
		id: "chord-stabs",
		label: "Chord Stabs",
		description: "Trigger repeated three-note chords to stress polyphony.",
		estimatedDurationMs: 3600,
		run: async (runtime) => {
			const chord = [48, 55, 60];
			for (let index = 0; index < 8; index += 1) {
				for (const note of chord) {
					await runtime.noteOn(note, 110);
				}
				await wait(160);
				for (const note of chord) {
					await runtime.noteOff(note);
				}
				await wait(240);
			}
		},
	},
];

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

function percentile(values: number[], ratio: number): number {
	if (values.length === 0) {
		return 0;
	}
	const sorted = [...values].sort((left, right) => left - right);
	const index = Math.min(
		sorted.length - 1,
		Math.max(0, Math.round((sorted.length - 1) * ratio)),
	);
	return sorted[index] ?? 0;
}

function summarizeCase(samples: BenchmarkMetricSample[]) {
	const lastMs = samples.map((sample) => sample.lastMs);
	const lastRtPercent = samples.map((sample) => sample.lastRtPercent);
	const finalSample = samples[samples.length - 1] ?? null;

	return {
		sampleCount: samples.length,
		p50LastMs: percentile(lastMs, 0.5),
		p95LastMs: percentile(lastMs, 0.95),
		maxLastMs: lastMs.reduce((max, value) => Math.max(max, value), 0),
		p50LastRtPercent: percentile(lastRtPercent, 0.5),
		p95LastRtPercent: percentile(lastRtPercent, 0.95),
		maxLastRtPercent: lastRtPercent.reduce(
			(max, value) => Math.max(max, value),
			0,
		),
		finalAvgMs: finalSample?.avgMs ?? 0,
		finalMaxMs: finalSample?.maxMs ?? 0,
		finalBlockCount: finalSample?.blockCount ?? 0,
		finalBlockSamples: finalSample?.blockSamples ?? 0,
		finalSampleRate: finalSample?.sampleRate ?? 0,
	};
}

async function sampleMetrics(
	runtime: BenchmarkRuntime,
	startMs: number,
	sampleIntervalMs: number,
	stopSignal: { done: boolean },
): Promise<BenchmarkMetricSample[]> {
	const samples: BenchmarkMetricSample[] = [];
	let lastBlockCount = -1;

	while (!stopSignal.done) {
		const metrics = await runtime.getPerformanceMetrics();
		if (metrics?.enabled && metrics.blockCount !== lastBlockCount) {
			lastBlockCount = metrics.blockCount;
			samples.push({
				...metrics,
				elapsedMs: performance.now() - startMs,
				timestampMs: Date.now(),
			});
		}
		await wait(sampleIntervalMs);
	}

	const finalMetrics = await runtime.getPerformanceMetrics();
	if (finalMetrics?.enabled && finalMetrics.blockCount !== lastBlockCount) {
		samples.push({
			...finalMetrics,
			elapsedMs: performance.now() - startMs,
			timestampMs: Date.now(),
		});
	}

	return samples;
}

function scenarioById(id: string) {
	return BENCHMARK_SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}

export function createBenchmarkApi(runtime: BenchmarkRuntime): BenchmarkApi {
	const api: BenchmarkApi = {
		listScenarios: () =>
			BENCHMARK_SCENARIOS.map(
				({ id, label, description, estimatedDurationMs }) => ({
					id,
					label,
					description,
					estimatedDurationMs,
				}),
			),
		listBuiltinPresets: () => runtime.listBuiltinPresets?.() ?? [],
		runCase: async ({ scenarioId, presetName }) => {
			const scenario = scenarioById(scenarioId);
			if (!scenario) {
				throw new Error(`Unknown benchmark scenario: ${scenarioId}`);
			}

			await runtime.ensureReady?.();
			await runtime.panic();
			await Promise.resolve(runtime.setPerformanceMonitorEnabled(false));
			await wait(runtime.monitorSettleMs ?? DEFAULT_MONITOR_SETTLE_MS);

			if (presetName && runtime.loadBuiltinPreset) {
				await Promise.resolve(runtime.loadBuiltinPreset(presetName));
				await wait(runtime.presetSettleMs ?? DEFAULT_PRESET_SETTLE_MS);
			}

			await Promise.resolve(runtime.setPerformanceMonitorEnabled(true));
			await wait(runtime.monitorSettleMs ?? DEFAULT_MONITOR_SETTLE_MS);

			const stopSignal = { done: false };
			const startMs = performance.now();
			const samplesPromise = sampleMetrics(
				runtime,
				startMs,
				DEFAULT_SAMPLE_INTERVAL_MS,
				stopSignal,
			);

			try {
				await scenario.run(runtime);
				await wait(runtime.postRunSettleMs ?? DEFAULT_POST_RUN_SETTLE_MS);
			} finally {
				await runtime.panic();
				stopSignal.done = true;
			}

			const samples = await samplesPromise;
			await Promise.resolve(runtime.setPerformanceMonitorEnabled(false));

			return {
				mode: runtime.mode,
				scenario: scenario.id,
				presetName: presetName?.trim() || "Current State",
				samples,
				summary: summarizeCase(samples),
			};
		},
		runAll: async (options = {}) => {
			const scenarioIds =
				options.scenarioIds && options.scenarioIds.length > 0
					? options.scenarioIds
					: BENCHMARK_SCENARIOS.map((scenario) => scenario.id);

			const cases: BenchmarkCaseResult[] = [];
			for (const scenarioId of scenarioIds) {
				cases.push(
					await api.runCase({
						scenarioId,
						presetName: options.presetName,
					}),
				);
			}

			return {
				mode: runtime.mode,
				generatedAt: new Date().toISOString(),
				cases,
			};
		},
	};

	return api;
}

export function installBenchmarkApi(runtime: BenchmarkRuntime): () => void {
	const api = createBenchmarkApi(runtime);
	window.__czBenchmark = api;
	return () => {
		if (window.__czBenchmark === api) {
			window.__czBenchmark = undefined;
		}
	};
}
