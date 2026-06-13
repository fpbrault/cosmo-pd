const IOS_SCOPE_POLL_INTERVAL_MS = 16;
const DEFAULT_SCOPE_POLL_INTERVAL_MS = 16;
const SCOPE_HZ_EPSILON = 0.5;

export function getAuv3ScopePollIntervalMs(
	hostPlatform: Window["__czHostPlatform"],
): number {
	return hostPlatform === "ios"
		? IOS_SCOPE_POLL_INTERVAL_MS
		: DEFAULT_SCOPE_POLL_INTERVAL_MS;
}

export function normalizeScopeHz(hz: number): number {
	return Number.isFinite(hz) && hz > 0 ? hz : 220;
}

export function hasMeaningfulScopeHzChange(
	previousHz: number,
	nextHz: number,
): boolean {
	return Math.abs(previousHz - nextHz) >= SCOPE_HZ_EPSILON;
}

let scopeRpcCount = 0;
let scopePayloadSamples = 0;
let scopeStatsStartedAt = 0;

export function recordAuv3ScopeRpc(sampleCount: number): void {
	if (!import.meta.env.DEV) {
		return;
	}

	const now = performance.now();
	if (scopeStatsStartedAt === 0) {
		scopeStatsStartedAt = now;
	}
	scopeRpcCount++;
	scopePayloadSamples += sampleCount;

	const elapsedMs = now - scopeStatsStartedAt;
	if (elapsedMs < 5000) {
		return;
	}

	console.debug("[scope-perf] AUv3 bridge", {
		rpcsPerSecond: (scopeRpcCount * 1000) / elapsedMs,
		averagePayloadSamples: scopePayloadSamples / scopeRpcCount,
	});
	scopeRpcCount = 0;
	scopePayloadSamples = 0;
	scopeStatsStartedAt = now;
}
