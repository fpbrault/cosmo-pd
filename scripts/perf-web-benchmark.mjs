#!/usr/bin/env bun
import { spawn, spawnSync } from "node:child_process";

function parseArgs(argv) {
	const options = {
		host: "127.0.0.1",
		port: "4173",
		out: "target/perf/ui/web-current.json",
		presetNames: [],
		scenarioIds: [],
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

	return options;
}

async function waitForServer(url, timeoutMs) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch {
			// Keep polling until the timeout expires.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(`Timed out waiting for ${url}`);
}

const options = parseArgs(process.argv.slice(2));

const build = spawnSync("bun", ["run", "build:web"], {
	stdio: "inherit",
	shell: process.platform === "win32",
});

if (build.status !== 0) {
	process.exit(build.status ?? 1);
}

const preview = spawn(
	"bun",
	[
		"--filter",
		"@cosmo/cosmo-pd101-plugin-webview",
		"preview",
		"--host",
		options.host,
		"--port",
		options.port,
	],
	{
		stdio: "inherit",
		shell: process.platform === "win32",
	},
);

const shutdown = (signal = "SIGTERM") => {
	if (!preview.killed) {
		preview.kill(signal);
	}
};

try {
	const baseUrl = `http://${options.host}:${options.port}`;
	await waitForServer(baseUrl, 30_000);

	const runnerArgs = [
		"run",
		"./scripts/perf-ui-benchmark.mjs",
		"--url",
		`${baseUrl}/synth-renderer`,
		"--out",
		options.out,
	];

	for (const presetName of options.presetNames) {
		runnerArgs.push("--preset", presetName);
	}
	for (const scenarioId of options.scenarioIds) {
		runnerArgs.push("--scenario", scenarioId);
	}

	const run = spawnSync("bun", runnerArgs, {
		stdio: "inherit",
		shell: process.platform === "win32",
	});

	process.exit(run.status ?? 0);
} finally {
	shutdown();
}
