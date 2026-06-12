#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(scriptDir, "..");
const bindingsDir = resolve(packageDir, "src/lib/synth/bindings");

const releaseBindings = process.env.COSMO_BINDINGS_RELEASE === "1";
const checkMode = process.argv.includes("--check");

/** Run one export binary via its manifest path (relative to packageDir). */
function runExport(outputFile, manifestRelative) {
	const result = spawnSync(
		"cargo",
		[
			"run",
			...(releaseBindings ? ["--release"] : []),
			"--features",
			"specta-bindings",
			"--bin",
			"export-specta-bindings",
			"--manifest-path",
			manifestRelative,
		],
		{
			cwd: packageDir,
			env: {
				...process.env,
				SPECTA_TS_EXPORT_PATH: outputFile,
			},
			stdio: "inherit",
		},
	);

	if (result.error) {
		console.error(`[gen:bindings] Failed to execute cargo: ${result.error}`);
		process.exit(1);
	}

	if ((result.status ?? 1) !== 0) {
		process.exit(result.status ?? 1);
	}
}

// Synth engine bindings → synth.ts
runExport(
	"./src/lib/synth/bindings/synth.ts",
	"../cosmo-synth-engine/Cargo.toml",
);

// Bridge-types bindings → plugin-bridge.ts
runExport(
	"./src/lib/synth/bindings/plugin-bridge.ts",
	"../cosmo-pd101-bridge-types/Cargo.toml",
);

// Verify both files exist
const required = ["synth.ts", "plugin-bridge.ts"];
for (const file of required) {
	const p = resolve(bindingsDir, file);
	if (!existsSync(p)) {
		console.error(
			`[gen:bindings] Expected bindings output was not generated at ${file}.`,
		);
		process.exit(1);
	}
}

// Stale binding check: re-generate, then compare with committed state
if (checkMode) {
	const bindingPaths = required.map((f) => resolve(bindingsDir, f));
	const diff = spawnSync("git", ["diff", "--exit-code", "--", ...bindingPaths]);

	if (diff.status === 0) {
		console.log("[gen:bindings] Generated bindings are up to date.");
	} else {
		console.error(
			"\n[gen:bindings] Generated bindings are STALE." +
				"\n  Rust source was modified without regenerating TypeScript bindings." +
				"\n  Run `bun run gen:bindings` locally and commit the updated files." +
				"\n",
		);
		process.exit(1);
	}
}
