#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";

function median(values) {
	if (values.length === 0) return null;
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function readMetric(summaries, key) {
	return median(
		summaries
			.map((summary) => summary[key])
			.filter((value) => Number.isFinite(value)),
	);
}

function readSummary(report) {
	const grouped = new Map();
	for (const entry of report.cases ?? []) {
		const profile = entry.profile ?? "default";
		const key = `${profile}:${entry.mode}:${entry.voices}`;
		const summaries = grouped.get(key) ?? [];
		summaries.push(entry.summary ?? {});
		grouped.set(key, summaries);
	}
	return new Map(
		[...grouped.entries()].map(([key, summaries]) => [
			key,
			{
				fps: readMetric(summaries, "fps"),
				p95GapMs: readMetric(summaries, "p95GapMs"),
				drawP95Ms: readMetric(summaries, "drawP95Ms"),
				canvasPixels: readMetric(summaries, "canvasPixels"),
				qualityTier: summaries.at(-1)?.qualityTier ?? "legacy",
			},
		]),
	);
}

function deltaPercent(current, baseline) {
	if (!Number.isFinite(current) || !Number.isFinite(baseline)) return null;
	return baseline === 0 ? 0 : ((current - baseline) / baseline) * 100;
}

function formatPercent(value) {
	return value === null ? "n/a" : `${value.toFixed(1)}%`;
}

function formatMetricPair(base, next, suffix = "") {
	const format = (value) =>
		Number.isFinite(value) && value > 0
			? `${value.toFixed(suffix === "ms" ? 1 : 0)}${suffix}`
			: "n/a";
	return `${format(base)} -> ${format(next)}`;
}

function tierRank(tier) {
	return { high: 0, balanced: 1, low: 2 }[tier];
}

const args = process.argv.slice(2);
const positional = [];
let markdownOut = "";
for (let index = 0; index < args.length; index += 1) {
	const arg = args[index];
	if (arg === "--markdown-out" && args[index + 1]) {
		markdownOut = args[index + 1];
		index += 1;
	} else {
		positional.push(arg);
	}
}

const [baselinePath, currentPath] = positional;
if (!baselinePath || !currentPath) {
	console.error(
		"Usage: bun ./scripts/perf-display-compare.mjs <baseline.json> <current.json> [--markdown-out path]",
	);
	process.exit(2);
}

const [baseline, current] = await Promise.all([
	readFile(baselinePath, "utf8").then(JSON.parse),
	readFile(currentPath, "utf8").then(JSON.parse),
]);
const baselineCases = readSummary(baseline);
const currentCases = readSummary(current);
const keys = [...currentCases.keys()]
	.filter((key) => baselineCases.has(key))
	.sort();
if (keys.length === 0) {
	console.error("No overlapping display benchmark cases found.");
	process.exit(1);
}

const missingCurrentCases = [...baselineCases.keys()].filter(
	(key) => !currentCases.has(key),
);
let failures = missingCurrentCases.length;
if (missingCurrentCases.length > 0) {
	console.error(
		`Missing current display benchmark cases: ${missingCurrentCases.join(", ")}`,
	);
}
console.log("case\tfps delta\tp95 gap delta\tdraw p95\tcanvas pixels\ttier");
const markdownRows = [];
for (const key of keys) {
	const base = baselineCases.get(key);
	const next = currentCases.get(key);
	if (!base || !next) continue;
	const fpsDelta = deltaPercent(next.fps, base.fps);
	const gapDelta = deltaPercent(next.p95GapMs, base.p95GapMs);
	const baseTierRank = tierRank(base.qualityTier);
	const nextTierRank = tierRank(next.qualityTier);
	const tierRegressed =
		baseTierRank !== undefined &&
		nextTierRank !== undefined &&
		nextTierRank > baseTierRank;
	if (fpsDelta < -10 || gapDelta > 15 || tierRegressed) failures++;
	markdownRows.push(
		`| ${key} | ${formatPercent(fpsDelta)} | ${formatPercent(gapDelta)} | ${formatMetricPair(base.drawP95Ms, next.drawP95Ms, "ms")} | ${formatMetricPair(base.canvasPixels, next.canvasPixels)} | ${base.qualityTier} -> ${next.qualityTier} |`,
	);
	console.log(
		`${key}\t${formatPercent(fpsDelta)}\t${formatPercent(gapDelta)}\t${formatMetricPair(base.drawP95Ms, next.drawP95Ms, "ms")}\t${formatMetricPair(base.canvasPixels, next.canvasPixels)}\t${base.qualityTier} -> ${next.qualityTier}`,
	);
}

if (markdownOut) {
	const markdown = [
		"| Case | FPS delta | P95 RAF gap delta | Draw p95 (base -> PR) | Canvas pixels (base -> PR) | Final tier |",
		"| --- | ---: | ---: | ---: | ---: | --- |",
		...markdownRows,
		...(missingCurrentCases.length > 0
			? ["", `Missing current cases: ${missingCurrentCases.join(", ")}`]
			: []),
		"",
		failures > 0
			? `Display benchmark regressions: ${failures}`
			: "No display benchmark regressions detected.",
	].join("\n");
	await writeFile(markdownOut, `${markdown}\n`, "utf8");
}

if (failures > 0) {
	console.error(`\nDisplay benchmark regressions: ${failures}`);
	process.exit(1);
}
console.log("\nNo display benchmark regressions detected.");
