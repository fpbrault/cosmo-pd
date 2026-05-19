#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(import.meta.url), "..");
const rootDir = resolve(scriptDir, "..");

const CARGO_TOML = resolve(rootDir, "Cargo.toml");

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

function getDevVersion() {
	const result = execFileSync(
		process.execPath,
		[resolve(scriptDir, "dev-version.mjs")],
		{ cwd: rootDir, encoding: "utf8" },
	);
	return result.trim();
}

function getCurrentCargoVersion() {
	const content = readFileSync(CARGO_TOML, "utf8");
	const match = content.match(
		/\[workspace\.package\][^[]*?version\s*=\s*"([^"]+)"/,
	);
	if (!match) {
		throw new Error("Could not find workspace version in Cargo.toml");
	}
	return match[1];
}

function patchCargoVersion(newVersion) {
	const content = readFileSync(CARGO_TOML, "utf8");
	const updated = content.replace(
		/(\[workspace\.package\][^[]*?)version\s*=\s*"([^"]+)"/,
		(_match, before) => `${before}version = "${newVersion}"`,
	);
	writeFileSync(CARGO_TOML, updated);
}

function main() {
	const truceArgs = process.argv.slice(2).filter((a) => a !== "--dev");
	const currentVersion = getCurrentCargoVersion();
	const devVersion = getDevVersion();

	const backupPath = `${CARGO_TOML}.bak`;
	copyFileSync(CARGO_TOML, backupPath);

	try {
		patchCargoVersion(devVersion);
		console.log(`Patched Cargo.toml: ${currentVersion} → ${devVersion}`);

		run("cargo", ["truce", "package", ...truceArgs]);
	} finally {
		copyFileSync(backupPath, CARGO_TOML);
		unlinkSync(backupPath);
		console.log(
			`Restored Cargo.toml: ${devVersion} → ${getCurrentCargoVersion()}`,
		);
	}
}

main();
