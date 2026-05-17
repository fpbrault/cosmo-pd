#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_HEAVY_PRESET_NAMES = ["Rise", "Flute", "Chants"];

import { chromium } from "playwright";

function parseArgs(argv) {
	const options = {
		url: "",
		out: "",
		presetNames: [],
		scenarioIds: [],
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const next = argv[index + 1];
		if (arg === "--url" && next) {
			options.url = next;
			index += 1;
		} else if (arg === "--out" && next) {
			options.out = next;
			index += 1;
		} else if (arg === "--preset" && next) {
			options.presetNames.push(next);
			index += 1;
		} else if (arg === "--scenario" && next) {
			options.scenarioIds.push(next);
			index += 1;
		}
	}

	if (!options.url) {
		throw new Error("Missing required --url argument");
	}

	if (options.presetNames.length === 0) {
		options.presetNames = [...DEFAULT_HEAVY_PRESET_NAMES];
	}

	return options;
}

const options = parseArgs(process.argv.slice(2));
const browser = await chromium.launch({ headless: true });

try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1100 },
	});
	page.on("console", (message) => {
		if (message.type() === "error") {
			console.error(`[browser] ${message.text()}`);
		}
	});

	await page.goto(options.url, { waitUntil: "networkidle" });
	await page.waitForFunction(
		() => typeof window.__czBenchmark?.runAll === "function",
		{
			timeout: 30_000,
		},
	);

	const reports = [];
	for (const presetName of options.presetNames) {
		const report = await page.evaluate(
			async ({ presetName, scenarioIds }) => {
				return await window.__czBenchmark.runAll({
					presetName:
						presetName && presetName !== "Current State"
							? presetName
							: undefined,
					scenarioIds: scenarioIds.length > 0 ? scenarioIds : undefined,
				});
			},
			{
				presetName,
				scenarioIds: options.scenarioIds,
			},
		);
		reports.push(report);
	}

	const report = {
		mode: reports[0]?.mode ?? "web",
		generatedAt: new Date().toISOString(),
		cases: reports.flatMap((entry) => entry?.cases ?? []),
		metadata: {
			presetNames: options.presetNames,
		},
	};

	const output = JSON.stringify(report, null, 2);
	if (options.out) {
		await mkdir(path.dirname(options.out), { recursive: true });
		await writeFile(options.out, `${output}\n`, "utf8");
	}

	console.log(output);
} finally {
	await browser.close();
}
