import type { PerformanceMetrics } from "@/components/performance/PerformanceMonitor";
import type { WorkletPerformanceMetrics } from "@/features/synth/hooks/useAudioEngine";

export type BridgeBenchScenarioDefinition = {
	id: string;
	label: string;
	description: string;
	estimatedDurationMs: number;
};

export type BridgeBenchSample = {
	rttMs?: number;
	churnRate?: number;
	totalMs?: number;
	timestampMs: number;
};

export type BridgeBenchCaseResult = {
	scenario: string;
	samples: BridgeBenchSample[];
	summary: {
		sampleCount: number;
		p50RttMs: number;
		p95RttMs: number;
		maxRttMs: number;
		avgRttMs: number;
	};
};

export type BridgeBenchReport = {
	generatedAt: string;
	cases: BridgeBenchCaseResult[];
};

export type BridgeBenchApi = {
	listScenarios: () => BridgeBenchScenarioDefinition[];
	runCase: (scenarioId: string) => Promise<BridgeBenchCaseResult>;
	runAll: () => Promise<BridgeBenchReport>;
};

export type BridgeBenchRuntime = {
	postMessage: (msg: unknown) => void;
	getPerformanceMetrics: () => PerformanceMetrics | null;
	noteOn: (note: number, velocity?: number) => void;
	noteOff: (note: number) => void;
	panic: () => void;
};

declare global {
	interface Window {
		__czBridgeBench?: BridgeBenchApi;
	}
}

const SCENARIOS: Array<
	BridgeBenchScenarioDefinition & {
		run: (runtime: BridgeBenchRuntime) => Promise<BridgeBenchSample[]>;
	}
> = [
	{
		id: "telemetry-rtt",
		label: "Telemetry RTT",
		description:
			"Measures roundtrip time of requestRuntimeTelemetry → performanceMetrics. Sends 25 requests at 200ms intervals.",
		estimatedDurationMs: 5500,
		run: async (runtime) => {
			const samples: BridgeBenchSample[] = [];
			const metricsPromise = waitForPerformanceMetrics();
			for (let index = 0; index < 25; index++) {
				const start = performance.now();
				runtime.postMessage({ type: "requestRuntimeTelemetry" });
				const metrics = await metricsPromise.next();
				const elapsed = performance.now() - start;
				if (metrics) {
					samples.push({ rttMs: elapsed, timestampMs: Date.now() });
				}
				await wait(200);
			}
			return samples;
		},
	},
	{
		id: "param-set-telemetry",
		label: "Param Set + Telemetry",
		description:
			"Sends a setParams then immediately polls telemetry. 25 iterations measure bridge responsiveness under param load.",
		estimatedDurationMs: 6000,
		run: async (runtime) => {
			const testParams = generateTestParams();
			const samples: BridgeBenchSample[] = [];
			const metricsPromise = waitForPerformanceMetrics();
			for (let index = 0; index < 25; index++) {
				runtime.postMessage({ type: "setParams", params: testParams });
				await wait(20);
				const start = performance.now();
				runtime.postMessage({ type: "requestRuntimeTelemetry" });
				const metrics = await metricsPromise.next();
				const elapsed = performance.now() - start;
				if (metrics) {
					samples.push({ rttMs: elapsed, timestampMs: Date.now() });
				}
				await wait(180);
			}
			return samples;
		},
	},
	{
		id: "churn",
		label: "Message Churn",
		description:
			"Alternates rapid setParams and telemetry requests to stress-test the bridge message queue.",
		estimatedDurationMs: 6000,
		run: async (runtime) => {
			const paramA = generateTestParams();
			const paramB = generateAltTestParams();
			const samples: BridgeBenchSample[] = [];
			const metricsPromise = waitForPerformanceMetrics();
			for (let index = 0; index < 30; index++) {
				runtime.postMessage({
					type: "setParams",
					params: index % 2 === 0 ? paramA : paramB,
				});
				const start = performance.now();
				runtime.postMessage({ type: "requestRuntimeTelemetry" });
				const metrics = await metricsPromise.next();
				const elapsed = performance.now() - start;
				if (metrics) {
					samples.push({
						rttMs: elapsed,
						churnRate: 1000 / (200 + 20),
						timestampMs: Date.now(),
					});
				}
				await wait(200);
			}
			return samples;
		},
	},
	{
		id: "note-churn",
		label: "MIDI Note Churn",
		description:
			"Rapid note on/off sequence + telemetry polling. Measures bridge responsiveness with MIDI traffic.",
		estimatedDurationMs: 5000,
		run: async (runtime) => {
			const notes = [48, 55, 60, 64, 67, 72];
			const samples: BridgeBenchSample[] = [];
			const metricsPromise = waitForPerformanceMetrics();
			for (let index = 0; index < 20; index++) {
				const note = notes[index % notes.length];
				runtime.noteOn(note, 100);
				await wait(30);
				runtime.noteOff(note);
				await wait(20);
				const start = performance.now();
				runtime.postMessage({ type: "requestRuntimeTelemetry" });
				const metrics = await metricsPromise.next();
				const elapsed = performance.now() - start;
				if (metrics) {
					samples.push({ rttMs: elapsed, timestampMs: Date.now() });
				}
				await wait(150);
			}
			runtime.panic();
			return samples;
		},
	},
];

type MetricsResolver = {
	resolve: (metrics: PerformanceMetrics | null) => void;
};

async function* waitForPerformanceMetrics(): AsyncGenerator<PerformanceMetrics | null> {
	let resolver: MetricsResolver | null = null;

	const handler = (event: Event) => {
		const detail = (event as CustomEvent<WorkletPerformanceMetrics>).detail;
		const metrics: PerformanceMetrics = {
			enabled: detail.enabled,
			blockCount: detail.blockCount,
			lastMs: detail.lastMs,
			avgMs: detail.avgMs,
			maxMs: detail.maxMs,
			blockBudgetMs: detail.blockBudgetMs,
			lastRtPercent: detail.lastRtPercent,
			avgRtPercent: detail.avgRtPercent,
			maxRtPercent: detail.maxRtPercent,
			blockSamples: detail.blockSamples,
			sampleRate: detail.sampleRate,
			activeVoices: detail.activeVoices,
		};
		resolver?.resolve(metrics);
	};

	window.addEventListener("cz-performance-metrics", handler);

	while (true) {
		const promise = new Promise<PerformanceMetrics | null>((resolve) => {
			resolver = { resolve };
		});
		yield await promise;
	}
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function percentile(values: number[], ratio: number): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.min(
		sorted.length - 1,
		Math.max(0, Math.round((sorted.length - 1) * ratio)),
	);
	return sorted[index] ?? 0;
}

function generateTestParams() {
	return {
		volume: 0.75,
		line1: {
			coarse: 0,
			fine: 0,
			key_follow: 0,
			fixed_key: false,
			fixed_key_note: 60,
			filter_cutoff: 99,
			filter_resonance: 0,
		},
		line2: {
			coarse: 0,
			fine: 0,
			key_follow: 0,
			fixed_key: false,
			fixed_key_note: 60,
			filter_cutoff: 99,
			filter_resonance: 0,
		},
		mod_matrix: { routes: [] },
	};
}

function generateAltTestParams() {
	return {
		volume: 0.5,
		line1: {
			coarse: 12,
			fine: 0,
			key_follow: 1,
			fixed_key: false,
			fixed_key_note: 60,
			filter_cutoff: 50,
			filter_resonance: 30,
		},
		line2: {
			coarse: -12,
			fine: 0,
			key_follow: 1,
			fixed_key: false,
			fixed_key_note: 60,
			filter_cutoff: 50,
			filter_resonance: 30,
		},
		mod_matrix: { routes: [] },
	};
}

function summarizeRtt(samples: BridgeBenchSample[]) {
	const rtts = samples
		.map((s) => s.rttMs)
		.filter((v): v is number => v !== undefined);
	return {
		sampleCount: rtts.length,
		p50RttMs: percentile(rtts, 0.5),
		p95RttMs: percentile(rtts, 0.95),
		maxRttMs: rtts.reduce((max, v) => Math.max(max, v), 0),
		avgRttMs:
			rtts.length > 0 ? rtts.reduce((sum, v) => sum + v, 0) / rtts.length : 0,
	};
}

export function createBridgeBenchApi(
	runtime: BridgeBenchRuntime,
): BridgeBenchApi {
	const api: BridgeBenchApi = {
		listScenarios: () =>
			SCENARIOS.map(({ id, label, description, estimatedDurationMs }) => ({
				id,
				label,
				description,
				estimatedDurationMs,
			})),
		runCase: async (scenarioId) => {
			const scenario = SCENARIOS.find((s) => s.id === scenarioId);
			if (!scenario) {
				throw new Error(`Unknown bridge benchmark scenario: ${scenarioId}`);
			}
			runtime.panic();
			await wait(500);
			const samples = await scenario.run(runtime);
			runtime.panic();
			return {
				scenario: scenario.id,
				samples,
				summary: summarizeRtt(samples),
			};
		},
		runAll: async () => {
			const cases: BridgeBenchCaseResult[] = [];
			for (const scenario of SCENARIOS) {
				cases.push(await api.runCase(scenario.id));
			}
			return {
				generatedAt: new Date().toISOString(),
				cases,
			};
		},
	};
	return api;
}

export function installBridgeBenchApi(runtime: BridgeBenchRuntime): () => void {
	const api = createBridgeBenchApi(runtime);
	window.__czBridgeBench = api;
	return () => {
		if (window.__czBridgeBench === api) {
			window.__czBridgeBench = undefined;
		}
	};
}
