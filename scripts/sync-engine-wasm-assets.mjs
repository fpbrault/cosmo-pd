#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(dirname(fileURLToPath(import.meta.url)));
const rootDir = resolve(scriptDir, "..");

const sourceDir = resolve(
	rootDir,
	"packages/cosmo-pd101/site/public/cosmo-synth-engine-wasm",
);
const targetDir = resolve(
	rootDir,
	"packages/cosmo-pd101-plugin/webview/public/cosmo-synth-engine-wasm",
);

if (!existsSync(sourceDir)) {
	throw new Error(`Missing source WASM directory: ${sourceDir}`);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Synced engine WASM assets: ${sourceDir} -> ${targetDir}`);
