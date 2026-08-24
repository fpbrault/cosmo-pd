#!/usr/bin/env bun
import { readFile, writeFile } from "node:fs/promises";

const COMMENT_MARKER = "<!-- perf-benchmark-comment -->";
const DEFAULT_HEAVY_PRESET_NAMES = ["Rise", "Flute", "Chants"];

function parseArgs(argv) {
	const options = {
		engineComparePath: "",
		uiComparePath: "",
		out: "",
		baseRef: "main",
		marker: COMMENT_MARKER,
		uiOnly: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const next = argv[index + 1];
		if (arg === "--engine-compare" && next) {
			options.engineComparePath = next;
			index += 1;
		} else if (arg === "--ui-compare" && next) {
			options.uiComparePath = next;
			index += 1;
		} else if (arg === "--out" && next) {
			options.out = next;
			index += 1;
		} else if (arg === "--base-ref" && next) {
			options.baseRef = next;
			index += 1;
		} else if (arg === "--marker" && next) {
			options.marker = next;
			index += 1;
		} else if (arg === "--ui-only") {
			options.uiOnly = true;
		}
	}

	if (!options.out) {
		throw new Error("Missing required --out argument");
	}

	return options;
}

async function readOptionalText(filePath) {
	if (!filePath) {
		return null;
	}

	try {
		return await readFile(filePath, "utf8");
	} catch {
		return null;
	}
}

function renderSection(title, body) {
	const trimmed = body?.trim();
	if (!trimmed) {
		return `### ${title}\nUnavailable.`;
	}

	let normalized = trimmed;
	if (normalized.includes("\\n")) {
		normalized = normalized.replaceAll("\\n", "\n");
	}

	return `### ${title}\n\n${normalized}`;
}

const options = parseArgs(process.argv.slice(2));
const [engineCompare, uiCompare] = await Promise.all([
	readOptionalText(options.engineComparePath),
	readOptionalText(options.uiComparePath),
]);

const markdown = options.uiOnly
	? [
			options.marker,
			`## Web Display Benchmarks vs ${options.baseRef}`,
			"",
			renderSection("Display comparison", uiCompare),
			"",
			`_Updated: ${new Date().toISOString()}_`,
		].join("\n")
	: [
			options.marker,
			`## Engine Benchmarks vs ${options.baseRef}`,
			"",
			`Web UI presets: \`${DEFAULT_HEAVY_PRESET_NAMES.join("`, `")}\``,
			"",
			renderSection("Rust Engine", engineCompare),
			"",
			renderSection("Web UI", uiCompare),
			"",
			`_Updated: ${new Date().toISOString()}_`,
		].join("\n");

await writeFile(options.out, `${markdown}\n`, "utf8");
console.log(markdown);
