#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(import.meta.url), "..");
const rootDir = resolve(scriptDir, "..");

const PACKAGE_JSON_PATHS = [
	"package.json",
	"packages/cosmo-pd101/package.json",
	"packages/cosmo-pd101-plugin/package.json",
	"packages/cosmo-pd101-plugin-auv3/package.json",
	"packages/cosmo-pd101-docs/package.json",
	"packages/cosmo-synth-engine/package.json",
];
const XCODE_PROJECT_PATHS = [
	"packages/cosmo-pd101-plugin-auv3/CosmoPD101Host/CosmoPD101Host.xcodeproj/project.pbxproj",
];

function readCurrentVersion() {
	const cargoToml = readFileSync(resolve(rootDir, "Cargo.toml"), "utf8");
	const match = cargoToml.match(
		/\[workspace\.package\][^[]*?version\s*=\s*"([^"]+)"/,
	);
	if (!match) {
		throw new Error("Could not find [workspace.package].version in Cargo.toml");
	}
	return match[1];
}

function resolveVersion(current, arg) {
	if (/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(arg)) {
		return arg;
	}

	const parts = current.split(".").map(Number);
	if (parts.length !== 3 || parts.some(Number.isNaN)) {
		throw new Error(`Invalid current version: ${current}`);
	}

	if (arg === "major") return `${parts[0] + 1}.0.0`;
	if (arg === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
	if (arg === "patch") return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;

	throw new Error(
		`Invalid version argument: '${arg}'. Use major, minor, patch, or a semver like 0.2.0.`,
	);
}

function updateCargoVersion(newVersion) {
	const filePath = resolve(rootDir, "Cargo.toml");
	const content = readFileSync(filePath, "utf8");
	const updated = content.replace(
		/(\[workspace\.package\][^[]*?)version\s*=\s*"([^"]+)"/,
		(_match, before) => `${before}version = "${newVersion}"`,
	);
	if (updated === content) {
		throw new Error("Could not find [workspace.package].version in Cargo.toml");
	}
	writeFileSync(filePath, updated);
}

function updatePackageJson(filePath, newVersion) {
	const fullPath = resolve(rootDir, filePath);
	const content = readFileSync(fullPath, "utf8");
	const pkg = JSON.parse(content);
	const oldVersion = pkg.version;
	pkg.version = newVersion;
	const updated = `${JSON.stringify(pkg, null, "\t")}\n`;
	writeFileSync(fullPath, updated);
	return oldVersion;
}

function updateXcodeMarketingVersion(filePath, newVersion) {
	const fullPath = resolve(rootDir, filePath);
	const content = readFileSync(fullPath, "utf8");
	const updated = content.replaceAll(
		/MARKETING_VERSION = [^;]+;/g,
		`MARKETING_VERSION = ${newVersion};`,
	);
	if (updated === content) {
		throw new Error(`Could not find MARKETING_VERSION in ${filePath}`);
	}
	writeFileSync(fullPath, updated);
}

function main() {
	const args = process.argv.slice(2);
	const printVersionOnly = args.includes("--print-version");
	const dryRun = args.includes("--dry-run");
	const versionArg = args.find((a) => !a.startsWith("--"));

	if (!versionArg) {
		console.error(
			"Usage: bump-version.mjs <major|minor|patch|version> [--dry-run] [--print-version]",
		);
		process.exit(1);
	}

	const currentVersion = readCurrentVersion();
	const newVersion = resolveVersion(currentVersion, versionArg);

	if (printVersionOnly) {
		process.stdout.write(newVersion);
		return;
	}

	console.log(`Bumping version: ${currentVersion} → ${newVersion}`);

	if (dryRun) {
		console.log("[dry-run] Would update:");
		console.log(`  Cargo.toml: ${currentVersion} → ${newVersion}`);
		for (const pkgPath of PACKAGE_JSON_PATHS) {
			const fullPath = resolve(rootDir, pkgPath);
			const pkg = JSON.parse(readFileSync(fullPath, "utf8"));
			console.log(`  ${pkgPath}: ${pkg.version} → ${newVersion}`);
		}
		for (const xcodePath of XCODE_PROJECT_PATHS) {
			console.log(`  ${xcodePath}: MARKETING_VERSION → ${newVersion}`);
		}
		return;
	}

	updateCargoVersion(newVersion);
	console.log(`  Cargo.toml: ${currentVersion} → ${newVersion}`);

	for (const pkgPath of PACKAGE_JSON_PATHS) {
		const old = updatePackageJson(pkgPath, newVersion);
		console.log(`  ${pkgPath}: ${old} → ${newVersion}`);
	}

	for (const xcodePath of XCODE_PROJECT_PATHS) {
		updateXcodeMarketingVersion(xcodePath, newVersion);
		console.log(`  ${xcodePath}: MARKETING_VERSION → ${newVersion}`);
	}
}

main();
