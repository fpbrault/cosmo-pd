#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const requireFromExplorer = createRequire(
	new URL("../packages/cz-explorer/package.json", import.meta.url),
);
const { chromium } = requireFromExplorer("playwright");

function parseArgs(argv) {
	const options = {
		url: "",
		out: "",
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
		} else if (arg === "--scenario" && next) {
			options.scenarioIds.push(next);
			index += 1;
		}
	}

	if (!options.url) {
		throw new Error("Missing required --url argument");
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
		() => typeof window.__czBridgeBench?.runAll === "function",
		{
			timeout: 30_000,
		},
	);

	const report = await page.evaluate(
		async ({ scenarioIds }) => {
			if (scenarioIds.length > 0) {
				const cases = [];
				for (const id of scenarioIds) {
					cases.push(await window.__czBridgeBench.runCase(id));
				}
				return {
					generatedAt: new Date().toISOString(),
					cases,
				};
			}
			return await window.__czBridgeBench.runAll();
		},
		{
			scenarioIds: options.scenarioIds,
		},
	);

	const output = JSON.stringify(report, null, 2);
	if (options.out) {
		await mkdir(path.dirname(options.out), { recursive: true });
		await writeFile(options.out, `${output}\n`, "utf8");
	}

	console.log(output);
} finally {
	await browser.close();
}
