#!/usr/bin/env bun
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const auv3Dir = join(repoRoot, "packages", "cosmo-pd101-plugin-auv3");

const xcframeworkPath = join(
	auv3Dir,
	"Artifacts",
	"CosmoPd101Plugin.xcframework",
);

const stampPath = join(auv3Dir, "Build", "ios-xcframework.inputs.sha256");

const log = (message) => console.log(`[auv3-xcframework] ${message}`);

const xcframeworkInputPathspecs = [
	"package.json",
	"bun.lock",
	"scripts/build-plugin-auv3.mjs",
	"scripts/xcode-build-auv3-ios-xcframework-if-needed.mjs",

	"packages/cosmo-pd101-plugin-auv3/package.json",

	"packages/cosmo-pd101-plugin/webview/package.json",
	"packages/cosmo-pd101-plugin/webview/tsconfig.json",
	"packages/cosmo-pd101-plugin/webview/vite.config.ts",
	"packages/cosmo-pd101-plugin/webview/index.html",
	"packages/cosmo-pd101-plugin/webview/src",
	"packages/cosmo-pd101-plugin/webview/public",

	"packages/cosmo-pd101/package.json",
	"packages/cosmo-pd101/tsconfig.json",
	"packages/cosmo-pd101/tsdown.config.ts",
	"packages/cosmo-pd101/scripts",
	"packages/cosmo-pd101/src",

	"packages/cosmo-pd101-presets/Cargo.toml",
	"packages/cosmo-pd101-presets/src",
	"packages/cosmo-pd101-presets/factory-presets",

	"Cargo.toml",
	"Cargo.lock",

	"packages/cosmo-pd101-plugin/Cargo.toml",
	"packages/cosmo-pd101-plugin/build.rs",
	"packages/cosmo-pd101-plugin/src",
	"packages/cosmo-pd101-plugin/include",

	"packages/cosmo-synth-engine/Cargo.toml",
	"packages/cosmo-synth-engine/src",
	"packages/cosmo-synth-engine/export_specta_bindings.rs",

	"packages/cosmo-pd101-bridge-types/Cargo.toml",
	"packages/cosmo-pd101-bridge-types/src",
	"packages/cosmo-pd101-bridge-types/export_specta_bindings.rs",
];

const environmentInputNames = [
	"GITHUB_REF_NAME",
	"GITHUB_REF_TYPE",
	"RUSTFLAGS",
	"CARGO_ENCODED_RUSTFLAGS",
	"DEVELOPER_DIR",
	"SDKROOT",
	"CC",
	"CFLAGS",
	"AR",
	"IPHONEOS_DEPLOYMENT_TARGET",
];

async function runText(command, args, options = {}) {
	const proc = Bun.spawn([command, ...args], {
		cwd: repoRoot,
		stdout: "pipe",
		stderr: options.ignoreErrors ? "pipe" : "inherit",
		env: process.env,
	});

	const stdout = await new Response(proc.stdout).text();
	const stderr = proc.stderr ? await new Response(proc.stderr).text() : "";
	const exitCode = await proc.exited;

	if (exitCode !== 0) {
		if (options.ignoreErrors) {
			return options.fallback ?? "<unavailable>";
		}
		throw new Error(
			`${command} ${args.join(" ")} exited with ${exitCode}\n${stderr}`,
		);
	}

	return stdout.trim() || "<empty>";
}

async function runInherited(command, args) {
	log(`$ ${[command, ...args].join(" ")}`);

	const proc = Bun.spawn([command, ...args], {
		cwd: repoRoot,
		env: process.env,
		stdout: "inherit",
		stderr: "inherit",
	});

	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		throw new Error(`${command} exited with ${exitCode}`);
	}
}

async function gitTrackedFiles(pathspecs) {
	const output = await runText("git", ["ls-files", ...pathspecs]);
	return output
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.sort();
}

async function addTextInput(hash, key, value) {
	hash.update("text");
	hash.update("\0");
	hash.update(key);
	hash.update("\0");
	hash.update(value);
	hash.update("\0");
}

async function computeFingerprint() {
	const hash = createHash("sha256");

	const files = await gitTrackedFiles(xcframeworkInputPathspecs);
	log(`Included ${files.length} tracked input files`);

	for (const file of files) {
		const absolutePath = join(repoRoot, file);
		hash.update("file");
		hash.update("\0");
		hash.update(file);
		hash.update("\0");
		hash.update(await readFile(absolutePath));
		hash.update("\0");
	}

	const commandInputs = [
		["git rev-parse HEAD", "git", ["rev-parse", "HEAD"], false],
		[
			"git describe --tags --exact-match",
			"git",
			["describe", "--tags", "--exact-match"],
			true,
		],
		["bun --version", "bun", ["--version"], false],
		["cargo --version", "cargo", ["--version"], false],
		["rustc -Vv", "rustc", ["-Vv"], false],
		[
			"rustup show active-toolchain",
			"rustup",
			["show", "active-toolchain"],
			false,
		],
		["xcodebuild -version", "xcodebuild", ["-version"], false],
		[
			"xcrun --sdk iphoneos --show-sdk-version",
			"xcrun",
			["--sdk", "iphoneos", "--show-sdk-version"],
			false,
		],
		[
			"xcrun --sdk iphonesimulator --show-sdk-version",
			"xcrun",
			["--sdk", "iphonesimulator", "--show-sdk-version"],
			false,
		],
	];

	for (const [key, command, args, ignoreErrors] of commandInputs) {
		const value = await runText(command, args, {
			ignoreErrors,
			fallback: "<none>",
		});
		await addTextInput(hash, key, value);
	}

	for (const name of environmentInputNames) {
		await addTextInput(hash, `env:${name}`, process.env[name] ?? "<unset>");
	}

	return hash.digest("hex");
}

async function main() {
	log("Checking CosmoPd101Plugin.xcframework");

	const frameworkExists = existsSync(xcframeworkPath);
	const currentFingerprint = await computeFingerprint();

	let previousFingerprint = "";
	if (existsSync(stampPath)) {
		previousFingerprint = (await readFile(stampPath, "utf8")).trim();
	}

	log(`Previous fingerprint: ${previousFingerprint || "<none>"}`);
	log(`Current fingerprint:  ${currentFingerprint}`);

	if (frameworkExists && previousFingerprint === currentFingerprint) {
		log("CosmoPd101Plugin.xcframework is up to date. Skipping build.");
		return;
	}

	if (!frameworkExists) {
		log("CosmoPd101Plugin.xcframework is missing.");
	} else {
		log("Inputs changed.");
	}

	log("Running bun run build:plugin:auv3:ios...");
	await runInherited("bun", ["run", "build:plugin:auv3:ios"]);

	// The build does not mutate tracked inputs (webview dist/ and UI/ are gitignored),
	// so the pre-build fingerprint is still valid. Write it as the new stamp.
	await mkdir(dirname(stampPath), { recursive: true });
	await writeFile(stampPath, `${currentFingerprint}\n`);

	log("Updated xcframework fingerprint stamp.");
}

await main();
