#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";

function usage() {
	console.error(
		"Usage: bun run ./scripts/perf-ui-compare.mjs <baseline.json> <current.json> [--markdown-out <path>] [--fail-on-regressions] [--label <name>]",
	);
}

function parseArgs(argv) {
	const options = {
		baselinePath: "",
		currentPath: "",
		markdownOutPath: "",
		failOnRegressions: false,
		label: "UI",
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

		if (arg === "--label" && next) {
			options.label = next;
			index += 1;
			continue;
		}

		if (arg === "--fail-on-regressions") {
			options.failOnRegressions = true;
		}
	}

	return options;
}

function parseReport(text) {
	const report = JSON.parse(text);
	if (!Array.isArray(report?.cases)) {
		throw new Error("invalid report: missing cases array");
	}
	return report;
}

function caseKey(entry) {
	return `${String(entry?.scenario ?? "")}:${String(entry?.presetName ?? "")}`;
}

function toCaseMap(report) {
	const map = new Map();
	for (const entry of report.cases) {
		map.set(caseKey(entry), entry);
	}
	return map;
}

function readNumber(entry, key) {
	const value = entry?.summary?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function deltaPercent(current, baseline) {
	if (baseline === 0) {
		return 0;
	}
	return ((current - baseline) / baseline) * 100;
}

function formatDelta(value) {
	const sign = value > 0 ? "+" : "";
	return `${sign}${value.toFixed(1)}%`;
}

const options = parseArgs(process.argv.slice(2));
if (!options.baselinePath || !options.currentPath) {
	usage();
	process.exit(2);
}

const [baselineText, currentText] = await Promise.all([
	readFile(options.baselinePath, "utf8"),
	readFile(options.currentPath, "utf8"),
]);

const baselineMap = toCaseMap(parseReport(baselineText));
const currentMap = toCaseMap(parseReport(currentText));

const keys = [...currentMap.keys()]
	.filter((key) => baselineMap.has(key))
	.sort();

if (keys.length === 0) {
	console.error("No overlapping cases found between reports.");
	process.exit(1);
}

console.log(
	`Comparing ${keys.length} overlapping ${options.label} benchmark cases`,
);
console.log("case\t p50 last ms\t p95 last ms\t max rt%\t sample count");

let regressions = 0;
const rows = [];
for (const key of keys) {
	const baseline = baselineMap.get(key);
	const current = currentMap.get(key);
	const bP50 = readNumber(baseline, "p50LastMs");
	const cP50 = readNumber(current, "p50LastMs");
	const bP95 = readNumber(baseline, "p95LastMs");
	const cP95 = readNumber(current, "p95LastMs");
	const bMaxRt = readNumber(baseline, "maxLastRtPercent");
	const cMaxRt = readNumber(current, "maxLastRtPercent");
	const bSamples = readNumber(baseline, "sampleCount");
	const cSamples = readNumber(current, "sampleCount");

	if (
		bP50 === null ||
		cP50 === null ||
		bP95 === null ||
		cP95 === null ||
		bMaxRt === null ||
		cMaxRt === null ||
		bSamples === null ||
		cSamples === null
	) {
		continue;
	}

	const p50Delta = deltaPercent(cP50, bP50);
	const p95Delta = deltaPercent(cP95, bP95);
	const maxRtDelta = deltaPercent(cMaxRt, bMaxRt);
	const sampleDelta = deltaPercent(cSamples, bSamples);

	if (p50Delta > 5 || p95Delta > 5 || maxRtDelta > 5) {
		regressions += 1;
	}

	rows.push({ key, p50Delta, p95Delta, maxRtDelta, sampleDelta });

	console.log(
		`${key}\t ${formatDelta(p50Delta)}\t ${formatDelta(p95Delta)}\t ${formatDelta(maxRtDelta)}\t ${formatDelta(sampleDelta)}`,
	);
}

if (regressions > 0) {
	console.log(`\nPotential regressions detected in ${regressions} case(s).`);
} else {
	console.log("\nNo obvious regressions detected (>5% thresholds).");
}

if (options.markdownOutPath) {
	const lines = [
		`Compared ${rows.length} overlapping ${options.label} case(s).`,
		"",
		`Potential regressions detected in ${regressions} case(s) (>5% p50/p95/max-RT).`,
		"",
		"| case | p50 last ms | p95 last ms | max rt% | sample count |",
		"|---|---:|---:|---:|---:|",
	];
	for (const row of rows) {
		lines.push(
			`| ${row.key} | ${formatDelta(row.p50Delta)} | ${formatDelta(row.p95Delta)} | ${formatDelta(row.maxRtDelta)} | ${formatDelta(row.sampleDelta)} |`,
		);
	}
	await writeFile(options.markdownOutPath, `${lines.join("\n")}\n`, "utf8");
}

if (options.failOnRegressions && regressions > 0) {
	process.exit(1);
}
