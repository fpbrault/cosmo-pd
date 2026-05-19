#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(import.meta.url), "..");
const rootDir = resolve(scriptDir, "..");

function run(cmd, args, opts = {}) {
	const result = spawnSync(cmd, args, {
		cwd: rootDir,
		stdio: "inherit",
		...opts,
	});
	if (result.error) {
		throw new Error(`${cmd} ${args.join(" ")} failed: ${result.error.message}`);
	}
	if (result.status !== 0) {
		throw new Error(
			`${cmd} ${args.join(" ")} exited with code ${result.status}`,
		);
	}
}

function parseArgs() {
	const args = process.argv.slice(2);
	let versionArg;
	let dryRun = false;
	let push = false;

	for (const arg of args) {
		if (arg === "--dry-run") {
			dryRun = true;
			continue;
		}
		if (arg === "--push") {
			push = true;
			continue;
		}
		if (!arg.startsWith("--")) {
			versionArg = arg;
		}
	}

	if (!versionArg) {
		console.error(
			"Usage: create-release.mjs <major|minor|patch|version> [--dry-run] [--push]",
		);
		process.exit(1);
	}

	return { versionArg, dryRun, push };
}

function main() {
	const { versionArg, dryRun, push } = parseArgs();
	const bumpScript = resolve(scriptDir, "bump-version.mjs");

	const resolveResult = execFileSync(
		process.execPath,
		[bumpScript, versionArg, "--print-version"],
		{ cwd: rootDir, encoding: "utf8" },
	);
	const newVersion = resolveResult.trim();

	if (dryRun) {
		console.log(
			`[dry-run] Would bump to v${newVersion}, commit, tag,${push ? " push," : ""} and release.`,
		);
		return;
	}

	run(process.execPath, [bumpScript, newVersion]);

	run("git", ["add", "-A"]);
	run("git", ["commit", "-m", `chore(release): v${newVersion}`]);

	run("git", ["tag", `v${newVersion}`]);

	console.log(`Created release v${newVersion}`);

	if (push) {
		run("git", ["push"]);
		run("git", ["push", "--tags"]);
		console.log("Pushed to remote");
	}
}

main();
