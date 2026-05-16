#!/usr/bin/env bun

import { spawnSync } from "node:child_process";

const mode = process.argv[2] ?? "build";
const flags = new Set(process.argv.slice(3));

const isBuild = mode === "build";
const isInstall = mode === "install";

if (!isBuild && !isInstall) {
	console.error(`Unsupported mode: ${mode}`);
	process.exit(1);
}

const debug = flags.has("--debug");
const includeAu3 = flags.has("--au3");

const formats = [
	{
		name: "vst3",
		args: [
			isBuild ? "build" : "install",
			"--vst3",
			...(debug ? ["--debug"] : []),
		],
		env: {
			WRY_CUSTOM_SCHEME: "cosmopd101vst3",
			WRY_OBJC_CLASS_PREFIX: "CosmoPd101Vst3",
		},
	},
	{
		name: "vst2",
		args: [
			isBuild ? "build" : "install",
			"--vst2",
			...(debug ? ["--debug"] : []),
		],
		env: {
			WRY_CUSTOM_SCHEME: "cosmopd101vst2",
			WRY_OBJC_CLASS_PREFIX: "CosmoPd101Vst2",
		},
	},
	{
		name: "clap",
		args: [
			isBuild ? "build" : "install",
			"--clap",
			...(debug ? ["--debug"] : []),
		],
		env: {
			WRY_CUSTOM_SCHEME: "cosmopd101clap",
			WRY_OBJC_CLASS_PREFIX: "CosmoPd101Clap",
		},
	},
	{
		name: "au2",
		args: [
			isBuild ? "build" : "install",
			"--au2",
			...(debug ? ["--debug"] : []),
		],
		env: {
			WRY_CUSTOM_SCHEME: "cosmopd101au2",
			WRY_OBJC_CLASS_PREFIX: "CosmoPd101Au2",
		},
		after() {
			run("bun", [
				"run",
				"repair:au2",
				...(isInstall ? ["--", "--installed"] : []),
			]);
		},
	},
];

if (includeAu3) {
	formats.splice(3, 0, {
		name: "au3",
		args: [
			isBuild ? "build" : "install",
			"--au3",
			...(debug ? ["--debug"] : []),
		],
		env: {
			WRY_CUSTOM_SCHEME: "cosmopd101au3",
			WRY_OBJC_CLASS_PREFIX: "CosmoPd101Au3",
		},
	});
}

for (const format of formats) {
	console.log(`\n==> ${mode} ${format.name}`);
	run("cargo", ["truce", ...format.args], format.env);
	format.after?.();
}

function run(command, args, extraEnv = {}) {
	const result = spawnSync(command, args, {
		stdio: "inherit",
		env: {
			...process.env,
			...extraEnv,
		},
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
