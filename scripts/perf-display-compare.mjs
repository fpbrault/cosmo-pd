#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";

function median(values) {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function readSummary(report) {
	const grouped = new Map();
	for (const entry of report.cases ?? []) {
		const key = `${entry.mode}:${entry.voices}`;
		const summaries = grouped.get(key) ?? [];
		summaries.push(entry.summary ?? {});
		grouped.set(key, summaries);
	}
	return new Map(
		[...grouped.entries()].map(([key, summaries]) => [
			key,
			{
				fps: median(
					summaries.map((summary) => summary.fps).filter(Number.isFinite),
				),
				p95GapMs: median(
					summaries.map((summary) => summary.p95GapMs).filter(Number.isFinite),
				),
				qualityTier: summaries.at(-1)?.qualityTier ?? "unknown",
			},
		]),
	);
}

function deltaPercent(current, baseline) {
	return baseline === 0 ? 0 : ((current - baseline) / baseline) * 100;
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
console.log("case\tfps delta\tp95 gap delta\ttier");
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
		`| ${key} | ${fpsDelta.toFixed(1)}% | ${gapDelta.toFixed(1)}% | ${base.qualityTier} -> ${next.qualityTier} |`,
	);
	console.log(
		`${key}\t${fpsDelta.toFixed(1)}%\t${gapDelta.toFixed(1)}%\t${base.qualityTier} -> ${next.qualityTier}`,
	);
}

if (markdownOut) {
	const markdown = [
		"| Case | FPS delta | P95 RAF gap delta | Final tier |",
		"| --- | ---: | ---: | --- |",
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
