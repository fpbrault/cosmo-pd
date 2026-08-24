#!/usr/bin/env bun
import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const DEFAULT_MODES = ["advanced", "scope", "waterfall"];
const DEFAULT_VOICES = [1, 4, 8];

function parseArgs(argv) {
	const options = {
		host: "127.0.0.1",
		port: "4174",
		url: "",
		out: "target/perf/ui/display-current.json",
		cpuRate: 6,
		warmupMs: 2_000,
		durationMs: 3_000,
		repeats: 3,
		modes: [...DEFAULT_MODES],
		voices: [...DEFAULT_VOICES],
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const next = argv[index + 1];
		if (arg === "--host" && next) {
			options.host = next;
			index += 1;
		} else if (arg === "--port" && next) {
			options.port = next;
			index += 1;
		} else if (arg === "--url" && next) {
			options.url = next;
			index += 1;
		} else if (arg === "--out" && next) {
			options.out = next;
			index += 1;
		} else if (arg === "--cpu-rate" && next) {
			options.cpuRate = Number(next);
			index += 1;
		} else if (arg === "--warmup-ms" && next) {
			options.warmupMs = Number(next);
			index += 1;
		} else if (arg === "--duration-ms" && next) {
			options.durationMs = Number(next);
			index += 1;
		} else if (arg === "--repeats" && next) {
			options.repeats = Number(next);
			index += 1;
		} else if (arg === "--mode" && next) {
			options.modes = [next];
			index += 1;
		} else if (arg === "--voices" && next) {
			options.voices = [Number(next)];
			index += 1;
		}
	}

	if (!Number.isFinite(options.cpuRate) || options.cpuRate < 1) {
		throw new Error("--cpu-rate must be a number greater than or equal to 1");
	}
	return options;
}

async function waitForServer(url, timeoutMs) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
		} catch {
			// Keep polling until the timeout expires.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(`Timed out waiting for ${url}`);
}

async function runCase(page, options, mode, voices) {
	const notes = ["z", "x", "c", "v", "b", "n", "m", ","].slice(0, voices);
	const startAudio = page.getByRole("button", { name: "Start Audio" });
	if (await startAudio.count()) await startAudio.click();
	for (const note of notes) await page.keyboard.down(note);
	await page.waitForTimeout(options.warmupMs);

	try {
		const report = await page.evaluate(
			async ({ mode, durationMs }) => {
				const percentile = (values, fraction) => {
					if (values.length === 0) return 0;
					const sorted = [...values].sort((a, b) => a - b);
					return (
						sorted[
							Math.min(sorted.length - 1, Math.floor(values.length * fraction))
						] ?? 0
					);
				};
				const gaps = [];
				const longTasks = [];
				const drawName = `cz-performance-display-draw-${mode === "advanced" ? "advanced" : mode}`;
				const measuresBefore = performance.getEntriesByName(drawName).length;
				let observer;
				try {
					observer = new PerformanceObserver((list) => {
						for (const entry of list.getEntries())
							longTasks.push(entry.duration);
					});
					observer.observe({ entryTypes: ["longtask"] });
				} catch {
					// Long-task entries are optional in some Chromium builds.
				}

				const startedAt = performance.now();
				let previousFrameAt = startedAt;
				await new Promise((resolve) => {
					const tick = (now) => {
						gaps.push(now - previousFrameAt);
						previousFrameAt = now;
						if (now - startedAt >= durationMs) resolve();
						else requestAnimationFrame(tick);
					};
					requestAnimationFrame(tick);
				});
				observer?.disconnect();

				const elapsedMs = performance.now() - startedAt;
				const measures = performance
					.getEntriesByName(drawName)
					.slice(measuresBefore)
					.map((entry) => entry.duration);
				const tierMarks = performance
					.getEntriesByType("mark")
					.filter((entry) => entry.name.startsWith("cz-performance-tier-"))
					.map((entry) => ({
						tier: entry.name.replace("cz-performance-tier-", ""),
						startTime: entry.startTime,
					}));
				const canvas =
					mode === "advanced"
						? [...document.querySelectorAll("canvas")].find(
								(candidate) => !candidate.dataset.performanceTier,
							)
						: document.querySelector("canvas[data-performance-tier]");
				const sortedGaps = [...gaps].sort((a, b) => a - b);
				return {
					fps: (gaps.length * 1000) / Math.max(1, elapsedMs),
					frameCount: gaps.length,
					p50GapMs: percentile(sortedGaps, 0.5),
					p95GapMs: percentile(sortedGaps, 0.95),
					maxGapMs: Math.max(0, ...gaps),
					missedFramePercent:
						(gaps.filter((gap) => gap > 34).length / Math.max(1, gaps.length)) *
						100,
					drawP50Ms: percentile(measures, 0.5),
					drawP95Ms: percentile(measures, 0.95),
					longTaskCount: longTasks.length,
					longTaskMs: longTasks.reduce((total, value) => total + value, 0),
					canvasPixels: canvas ? canvas.width * canvas.height : 0,
					qualityTier:
						mode === "advanced"
							? "advanced"
							: (canvas?.dataset.performanceTier ?? "unknown"),
					qualityTransitions: tierMarks,
				};
			},
			{ mode, durationMs: options.durationMs },
		);
		return report;
	} finally {
		for (const note of notes) await page.keyboard.up(note);
	}
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	let preview;
	let baseUrl = options.url;

	if (!baseUrl) {
		const build = spawnSync(
			"bun",
			["--filter", "@cosmo/cosmo-pd101-site", "build"],
			{ stdio: "inherit" },
		);
		if (build.status !== 0) process.exit(build.status ?? 1);
		preview = spawn(
			"bun",
			[
				"--filter",
				"@cosmo/cosmo-pd101-site",
				"preview",
				"--host",
				options.host,
				"--port",
				options.port,
			],
			{ stdio: "inherit" },
		);
		baseUrl = `http://${options.host}:${options.port}`;
		await waitForServer(baseUrl, 30_000);
	}

	const browser = await chromium.launch({ headless: true });
	const cases = [];
	try {
		for (const mode of options.modes) {
			for (const voices of options.voices) {
				for (let repeat = 1; repeat <= options.repeats; repeat++) {
					const context = await browser.newContext({
						viewport: { width: 915, height: 412 },
						deviceScaleFactor: 3,
						isMobile: true,
						hasTouch: true,
						userAgent:
							"Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36",
					});
					const page = await context.newPage();
					const client = await context.newCDPSession(page);
					await client.send("Emulation.setCPUThrottlingRate", {
						rate: options.cpuRate,
					});
					await page.addInitScript(
						({ mode }) => {
							localStorage.clear();
							localStorage.setItem(
								"cosmo-pd101-ui-state",
								JSON.stringify({
									state: {
										workspaceMode: mode === "advanced" ? "edit" : "performance",
										performanceDisplayMode:
											mode === "waterfall" ? "waterfall" : "scope",
										keyboardVisible: true,
									},
									version: 0,
								}),
							);
						},
						{ mode },
					);
					try {
						await page.goto(`${baseUrl}/?perf=1`, {
							waitUntil: "domcontentloaded",
						});
						await page.waitForSelector("canvas", { timeout: 30_000 });
						const summary = await runCase(page, options, mode, voices);
						cases.push({ mode, voices, repeat, summary });
						console.log(JSON.stringify({ mode, voices, repeat, summary }));
					} finally {
						await context.close();
					}
				}
			}
		}
	} finally {
		await browser.close();
		preview?.kill("SIGTERM");
	}

	const report = {
		mode: "android-web-display",
		generatedAt: new Date().toISOString(),
		configuration: {
			cpuRate: options.cpuRate,
			warmupMs: options.warmupMs,
			durationMs: options.durationMs,
			repeats: options.repeats,
			viewport: { width: 915, height: 412, deviceScaleFactor: 3 },
		},
		cases,
	};
	const output = JSON.stringify(report, null, 2);
	if (options.out) {
		await mkdir(path.dirname(options.out), { recursive: true });
		await writeFile(options.out, `${output}\n`, "utf8");
	}
	console.log(output);
}

await main();
