#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";

function usage() {
	console.error(
		"Usage: bun run ./scripts/perf-engine-compare.mjs <baseline.json> <current.json> [--markdown-out <path>] [--fail-on-regressions]",
	);
}

function parseArgs(argv) {
	const options = {
		baselinePath: "",
		currentPath: "",
		markdownOutPath: "",
		failOnRegressions: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const next = argv[index + 1];

		if (!options.baselinePath && !arg.startsWith("--")) {
			options.baselinePath = arg;
			continue;
		}

		if (!options.currentPath && !arg.startsWith("--")) {
			options.currentPath = arg;
			continue;
		}

		if (arg === "--markdown-out" && next) {
			options.markdownOutPath = next;
			index += 1;
			continue;
		}

		if (arg === "--fail-on-regressions") {
			options.failOnRegressions = true;
		}
	}

	return options;
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

function formatDeltaPrecise(value) {
	const sign = value > 0 ? "+" : "";
	return `${sign}${value.toFixed(2)}%`;
}

function buildMarkdownReport(rows, regressions, meanNsDelta) {
	const lines = [
		`Compared ${rows.length} overlapping case(s).`,
		"",
		`Mean delta (PR vs base): ${formatDeltaPrecise(meanNsDelta)} (negative is faster).`,
		"",
		`Potential regressions detected in ${regressions} case(s) (>5% p50/rt_cpu/ns/sample).`,
		"",
		"Full results",
		"",
		"| case | p50ms | rt_cpu | realtime | ns/sample | checksum |",
		"|---|---:|---:|---:|---:|---:|",
	];

	for (const row of rows) {
		lines.push(
			`| ${row.caseKey} | ${formatDelta(row.p50Delta)} | ${formatDelta(row.rtDelta)} | ${formatDelta(row.realtimeDelta)} | ${formatDelta(row.nsDelta)} | ${formatDelta(row.checksumDelta)} |`,
		);
	}

	return `${lines.join("\n")}\n`;
}

const options = parseArgs(process.argv.slice(2));
const { baselinePath, currentPath } = options;
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
let nsDeltaSum = 0;
const rows = [];
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
	nsDeltaSum += nsDelta;

	if (p50Delta > 5 || rtDelta > 5 || nsDelta > 5) {
		regressions += 1;
	}

	rows.push({
		caseKey: key,
		p50Delta,
		rtDelta,
		realtimeDelta,
		nsDelta,
		checksumDelta,
	});

	console.log(
		`${key}\t ${formatDelta(p50Delta)}\t ${formatDelta(rtDelta)}\t ${formatDelta(realtimeDelta)}\t ${formatDelta(nsDelta)}\t ${formatDelta(checksumDelta)}`,
	);
}

const meanNsDelta = nsDeltaSum / rows.length;
const markdownReport = buildMarkdownReport(rows, regressions, meanNsDelta);

if (options.markdownOutPath) {
	await writeFile(options.markdownOutPath, markdownReport, "utf8");
}

if (regressions > 0) {
	console.log(`\nPotential regressions detected in ${regressions} case(s).`);
} else {
	console.log("\nNo obvious regressions detected (>5% thresholds).");
}

if (options.failOnRegressions && regressions > 0) {
	process.exit(1);
}
