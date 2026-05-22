#!/usr/bin/env node

import { readdirSync, readFileSync, renameSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.resolve(fileURLToPath(import.meta.url), "..");
const rootDir = path.resolve(scriptDir, "..");
const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function readWorkspaceVersion() {
	const cargoToml = readFileSync(path.join(rootDir, "Cargo.toml"), "utf8");
	const match = cargoToml.match(
		/\[workspace\.package\][^[]*?version\s*=\s*"([^"]+)"/,
	);
	if (!match) {
		throw new Error("Could not find [workspace.package].version in Cargo.toml");
	}
	return match[1];
}

function parseArgs(args) {
	const parsed = {};
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg.startsWith("--")) {
			continue;
		}
		const key = arg.slice(2);
		const next = args[index + 1];
		if (!next || next.startsWith("--")) {
			parsed[key] = "true";
			continue;
		}
		parsed[key] = next;
		index += 1;
	}
	return parsed;
}

function resolveVersion(currentVersion, releaseType) {
	const parts = currentVersion.split(".").map(Number);
	if (parts.length !== 3 || parts.some(Number.isNaN)) {
		throw new Error(`Invalid current version: ${currentVersion}`);
	}

	if (releaseType === "major") {
		return `${parts[0] + 1}.0.0`;
	}
	if (releaseType === "minor") {
		return `${parts[0]}.${parts[1] + 1}.0`;
	}
	if (releaseType === "patch") {
		return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
	}

	throw new Error(`Unsupported release type: ${releaseType}`);
}

function isPrerelease(version) {
	return version.includes("-");
}

function assertValidVersion(version, label) {
	if (!version || !VERSION_RE.test(version)) {
		throw new Error(`Invalid ${label}: ${version || "(empty)"}`);
	}
}

function emitOutputs(outputs) {
	for (const [key, value] of Object.entries(outputs)) {
		process.stdout.write(`${key}=${value}\n`);
	}
}

function cmdResolve(args) {
	const parsed = parseArgs(args);
	const releaseType = parsed["release-type"];
	const exactVersion = parsed["exact-version"]?.trim() ?? "";
	const prereleaseRequested = (parsed.prerelease ?? "false") === "true";
	const currentVersion = readWorkspaceVersion();

	if (
		!releaseType ||
		!["major", "minor", "patch", "exact"].includes(releaseType)
	) {
		throw new Error("release-type must be one of: major, minor, patch, exact");
	}

	let version;
	let versionSource;
	if (releaseType === "exact") {
		assertValidVersion(exactVersion, "exact_version");
		version = exactVersion;
		versionSource = "exact";
	} else {
		if (prereleaseRequested) {
			throw new Error(
				"prerelease=true is only allowed with release_type=exact",
			);
		}
		version = resolveVersion(currentVersion, releaseType);
		versionSource = "bumped";
	}

	const prereleaseDetected = isPrerelease(version);
	if (prereleaseDetected && !prereleaseRequested) {
		throw new Error(
			`Version ${version} is a prerelease. Set prerelease=true for exact prerelease releases.`,
		);
	}
	if (!prereleaseDetected && prereleaseRequested) {
		throw new Error(
			"prerelease=true requires an exact_version with an alpha/beta/rc suffix",
		);
	}

	emitOutputs({
		current_workspace_version: currentVersion,
		version,
		tag: `v${version}`,
		is_prerelease: prereleaseDetected ? "true" : "false",
		version_source: versionSource,
	});
}

function renameArtifact(filePath, fromVersion, toVersion) {
	const dirname = path.dirname(filePath);
	const basename = path.basename(filePath);
	if (!basename.includes(fromVersion)) {
		return null;
	}

	const renamed = basename.replaceAll(fromVersion, toVersion);
	if (renamed === basename) {
		return null;
	}

	const nextPath = path.join(dirname, renamed);
	renameSync(filePath, nextPath);
	return nextPath;
}

function cmdRenameArtifacts(args) {
	const parsed = parseArgs(args);
	const releaseVersion = parsed["release-version"]?.trim();
	const distDir = path.resolve(rootDir, parsed["dist-dir"] ?? "target/dist");
	const workspaceVersion =
		parsed["workspace-version"]?.trim() ?? readWorkspaceVersion();

	assertValidVersion(releaseVersion, "release_version");
	assertValidVersion(workspaceVersion, "workspace_version");

	if (releaseVersion === workspaceVersion) {
		process.stdout.write(
			"No rename needed: release version matches workspace version.\n",
		);
		return;
	}

	const candidates = readdirSync(distDir)
		.filter((name) => name.endsWith(".pkg") || name.endsWith(".exe"))
		.map((name) => path.join(distDir, name));

	let renamedCount = 0;
	for (const filePath of candidates) {
		const renamedPath = renameArtifact(
			filePath,
			workspaceVersion,
			releaseVersion,
		);
		if (renamedPath) {
			renamedCount += 1;
			process.stdout.write(
				`Renamed ${path.basename(filePath)} -> ${path.basename(renamedPath)}\n`,
			);
		}
	}

	if (renamedCount === 0) {
		throw new Error(
			`No .pkg or .exe artifacts in ${distDir} contained version ${workspaceVersion}`,
		);
	}
}

function main() {
	const [command, ...args] = process.argv.slice(2);
	if (!command) {
		throw new Error(
			"Usage: release-workflow.mjs <resolve|rename-artifacts> [...]",
		);
	}

	if (command === "resolve") {
		cmdResolve(args);
		return;
	}

	if (command === "rename-artifacts") {
		cmdRenameArtifacts(args);
		return;
	}

	throw new Error(`Unknown command: ${command}`);
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
