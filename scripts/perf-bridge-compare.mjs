#!/usr/bin/env bun
import { readFile } from "node:fs/promises";

function usage() {
	console.error(
		"Usage: bun run ./scripts/perf-bridge-compare.mjs <baseline.json> <current.json>",
	);
}

function parseReport(text) {
	const report = JSON.parse(text);
	if (!Array.isArray(report?.cases)) {
		throw new Error("invalid report: missing cases array");
	}
	return report;
}

function readNumber(entry, key) {
	const value = entry?.summary?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function deltaPercent(current, baseline) {
	if (baseline === 0) return 0;
	return ((current - baseline) / baseline) * 100;
}

function formatDelta(value) {
	if (value === 0) return " 0.0%";
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

const baseline = parseReport(baselineText);
const current = parseReport(currentText);

const baselineMap = new Map(
	baseline.cases.map((c) => [c.scenario, c]),
);
const currentMap = new Map(
	current.cases.map((c) => [c.scenario, c]),
);

const scenarios = [...currentMap.keys()]
	.filter((key) => baselineMap.has(key))
	.sort();

if (scenarios.length === 0) {
	console.error("No overlapping scenarios found between reports.");
	process.exit(1);
}

console.log(`Comparing ${scenarios.length} bridge benchmark scenarios`);
console.log(
	"scenario\t p50 RTT\t p95 RTT\t max RTT\t avg RTT\t samples",
);

let regressions = 0;
for (const scenario of scenarios) {
	const b = baselineMap.get(scenario);
	const c = currentMap.get(scenario);

	const bP50 = readNumber(b, "p50RttMs");
	const cP50 = readNumber(c, "p50RttMs");
	const bP95 = readNumber(b, "p95RttMs");
	const cP95 = readNumber(c, "p95RttMs");
	const bMax = readNumber(b, "maxRttMs");
	const cMax = readNumber(c, "maxRttMs");
	const bAvg = readNumber(b, "avgRttMs");
	const cAvg = readNumber(c, "avgRttMs");
	const bSamples = readNumber(b, "sampleCount");
	const cSamples = readNumber(c, "sampleCount");

	if (
		bP50 === null || cP50 === null ||
		bP95 === null || cP95 === null ||
		bMax === null || cMax === null ||
		bAvg === null || cAvg === null
	) {
		continue;
	}

	const dp50 = deltaPercent(cP50, bP50);
	const dp95 = deltaPercent(cP95, bP95);
	const dmax = deltaPercent(cMax, bMax);
	const davg = deltaPercent(cAvg, bAvg);

	if (dp50 > 10 || dp95 > 10) {
		regressions += 1;
	}

	console.log(
		`${scenario}\t ${formatDelta(dp50)}\t ${formatDelta(dp95)}\t ${formatDelta(dmax)}\t ${formatDelta(davg)}\t ${cSamples ?? "?"}`,
	);
}

if (regressions > 0) {
	console.log(
		`\nPotential bridge regressions detected in ${regressions} scenario(s) (>10% p50/p95 RTT increase).`,
	);
} else {
	console.log("\nNo obvious bridge regressions detected (>10% thresholds).");
}
