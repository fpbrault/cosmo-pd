#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(scriptDir, "..");
const repoRoot = resolve(packageDir, "..", "..");

const outputPath = resolve(packageDir, "src/lib/synth/bindings/synth.ts");
const beamerManifestPath = resolve(
	repoRoot,
	"vendor/beamer/crates/beamer/Cargo.toml",
);

const cargoArgs = [
	"run",
	"--features",
	"specta-bindings",
	"--bin",
	"export-specta-bindings",
	"--manifest-path",
	"../cosmo-synth-engine/Cargo.toml",
];

const runCargo = () => {
	const result = spawnSync("cargo", cargoArgs, {
		cwd: packageDir,
		env: {
			...process.env,
			SPECTA_TS_EXPORT_PATH: "./src/lib/synth/bindings/synth.ts",
		},
		stdio: "inherit",
	});

	if (result.error) {
		console.error("[gen:bindings] Failed to execute cargo:", result.error);
		process.exit(1);
	}

	if ((result.status ?? 1) !== 0) {
		process.exit(result.status ?? 1);
	}
};

if (existsSync(beamerManifestPath)) {
	runCargo();
	process.exit(0);
}

if (!existsSync(outputPath)) {
	console.error(
		"[gen:bindings] vendor/beamer is missing and synth bindings file does not exist.",
	);
	console.error("[gen:bindings] Cannot continue without generating bindings.");
	process.exit(1);
}

console.warn(
	"[gen:bindings] Skipping Rust bindings generation because vendor/beamer is missing.",
);
console.warn(
	"[gen:bindings] Using committed src/lib/synth/bindings/synth.ts for this build.",
);
