#!/usr/bin/env bun
import { readFile } from "node:fs/promises";

function usage() {
	console.error(
		"Usage: bun run ./scripts/perf-engine-compare.mjs <baseline.json> <current.json>",
	);
}

function toCaseMap(report) {
	const cases = report?.cases;
	if (!Array.isArray(cases)) {
		throw new Error("invalid report: missing cases array");
	}
	const map = new Map();
	for (const entry of cases) {
		const scenario = String(entry?.scenario ?? "");
		const voices = Number(entry?.voices ?? 0);
		if (!scenario || voices <= 0) continue;
		map.set(`${scenario}:${voices}`, entry);
	}
	return map;
}

function readMetric(entry, key) {
	const value = entry?.summary?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function deltaPercent(current, baseline) {
	if (baseline === 0) return 0;
	return ((current - baseline) / baseline) * 100;
}

function formatDelta(value) {
	const sign = value > 0 ? "+" : "";
	return `${sign}${value.toFixed(1)}%`;
}

const [baselinePath, currentPath] = process.argv.slice(2);
if (!baselinePath || !currentPath) {
	usage();
	process.exit(2);
}

const [baselineText, currentText] = await Promise.all([
	readFile(baselinePath, "utf8"),
	readFile(currentPath, "utf8"),
]);

const baselineReport = JSON.parse(baselineText);
const currentReport = JSON.parse(currentText);

const baselineMap = toCaseMap(baselineReport);
const currentMap = toCaseMap(currentReport);

const keys = [...currentMap.keys()]
	.filter((key) => baselineMap.has(key))
	.sort();
if (keys.length === 0) {
	console.error("No overlapping scenario:voice cases found between reports.");
	process.exit(1);
}

console.log(`Comparing ${keys.length} overlapping cases`);
console.log("case\t p50ms\t rt_cpu\t realtime\t ns/sample\t checksum");

let regressions = 0;
for (const key of keys) {
	const baseline = baselineMap.get(key);
	const current = currentMap.get(key);
	const bP50 = readMetric(baseline, "p50Ms");
	const cP50 = readMetric(current, "p50Ms");
	const bRt = readMetric(baseline, "rtCpuPercentP50");
	const cRt = readMetric(current, "rtCpuPercentP50");
	const bRealtime = readMetric(baseline, "realtimeFactorP50");
	const cRealtime = readMetric(current, "realtimeFactorP50");
	const bNs = readMetric(baseline, "nsPerSampleP50");
	const cNs = readMetric(current, "nsPerSampleP50");
	const bChecksum = readMetric(baseline, "checksum");
	const cChecksum = readMetric(current, "checksum");

	if (
		bP50 === null ||
		cP50 === null ||
		bRt === null ||
		cRt === null ||
		bRealtime === null ||
		cRealtime === null ||
		bNs === null ||
		cNs === null ||
		bChecksum === null ||
		cChecksum === null
	) {
		continue;
	}

	const p50Delta = deltaPercent(cP50, bP50);
	const rtDelta = deltaPercent(cRt, bRt);
	const realtimeDelta = deltaPercent(cRealtime, bRealtime);
	const nsDelta = deltaPercent(cNs, bNs);
	const checksumDelta = deltaPercent(cChecksum, bChecksum);

	if (p50Delta > 5 || rtDelta > 5 || nsDelta > 5) {
		regressions += 1;
	}

	console.log(
		`${key}\t ${formatDelta(p50Delta)}\t ${formatDelta(rtDelta)}\t ${formatDelta(realtimeDelta)}\t ${formatDelta(nsDelta)}\t ${formatDelta(checksumDelta)}`,
	);
}

if (regressions > 0) {
	console.log(`\nPotential regressions detected in ${regressions} case(s).`);
} else {
	console.log("\nNo obvious regressions detected (>5% thresholds).");
}
