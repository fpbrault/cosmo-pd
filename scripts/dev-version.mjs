#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(import.meta.url), "..");
const rootDir = resolve(scriptDir, "..");

function readWorkspaceVersion() {
	const cargoToml = readFileSync(resolve(rootDir, "Cargo.toml"), "utf8");
	const match = cargoToml.match(
		/\[workspace\.package\][^[]*?version\s*=\s*"([^"]+)"/,
	);
	if (!match) {
		throw new Error("Could not find [workspace.package].version in Cargo.toml");
	}
	return match[1];
}

function getShortHash() {
	return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
		cwd: rootDir,
		encoding: "utf8",
	}).trim();
}

function main() {
	const version = readWorkspaceVersion();
	const hash = getShortHash();
	process.stdout.write(`${version}-dev.g${hash}`);
}

main();
