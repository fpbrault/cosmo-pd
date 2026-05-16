#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const packageDir = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(packageDir, "../..");
const targetComponent = path.join(
	workspaceRoot,
	"target/bundles/Cosmo PD-101.component",
);
const installedComponent = path.join(
	homedir(),
	"Library/Audio/Plug-Ins/Components/Cosmo PD-101.component",
);

const args = new Set(process.argv.slice(2));
const components = args.has("--installed")
	? [installedComponent]
	: args.has("--all")
		? [targetComponent, installedComponent]
		: [targetComponent];

function run(command, commandArgs, options = {}) {
	const result = spawnSync(command, commandArgs, {
		encoding: "utf8",
		stdio: options.capture ? "pipe" : "inherit",
	});
	if (result.status !== 0) {
		const details = [result.stdout, result.stderr].filter(Boolean).join("\n");
		throw new Error(
			`${command} ${commandArgs.join(" ")} failed${details ? `\n${details}` : ""}`,
		);
	}
	return result.stdout?.trim() ?? "";
}

function plistExecutable(componentPath) {
	const plistPath = path.join(componentPath, "Contents/Info.plist");
	const plist = readFileSync(plistPath, "utf8");
	const match = plist.match(
		/<key>CFBundleExecutable<\/key>\s*<string>([^<]+)<\/string>/,
	);
	if (!match) {
		throw new Error(`CFBundleExecutable not found in ${plistPath}`);
	}
	return match[1];
}

function machoFileType(binaryPath) {
	return run("otool", ["-hv", binaryPath], { capture: true });
}

function dylibNameFor(executableName) {
	const safeName = executableName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
	return `lib${safeName}_au.dylib`;
}

function cString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function repairComponent(componentPath) {
	if (!existsSync(componentPath)) {
		console.log(`AUv2 repair: skipping missing ${componentPath}`);
		return;
	}

	const executableName = plistExecutable(componentPath);
	const macosDir = path.join(componentPath, "Contents/MacOS");
	const executablePath = path.join(macosDir, executableName);
	const dylibName = dylibNameFor(executableName);
	const dylibPath = path.join(macosDir, dylibName);
	const header = machoFileType(executablePath);
	if (header.includes(" BUNDLE ")) {
		const symbols = run("nm", ["-gU", executablePath], { capture: true });
		if (symbols.includes("_TruceAUFactory")) {
			writeFileSync(path.join(componentPath, "Contents/PkgInfo"), "BNDL????");
			run("codesign", ["--force", "--deep", "--sign", "-", componentPath]);
			console.log(
				`AUv2 repair: ${componentPath} already contains a Mach-O bundle`,
			);
			return;
		}
		if (!existsSync(dylibPath)) {
			throw new Error(
				`AUv2 repair: ${executablePath} is already a bundle but exports no TruceAUFactory`,
			);
		}
	} else if (header.includes(" DYLIB ")) {
		cpSync(executablePath, dylibPath);
		run("install_name_tool", ["-id", `@rpath/${dylibName}`, dylibPath]);
	} else {
		throw new Error(
			`AUv2 repair: expected DYLIB or BUNDLE at ${executablePath}`,
		);
	}

	const archOutput = run("lipo", ["-archs", dylibPath], { capture: true });
	const archs = archOutput.split(/\s+/).filter(Boolean);
	if (archs.length === 0) {
		throw new Error(
			`AUv2 repair: unable to determine architectures for ${dylibPath}`,
		);
	}

	const tmpDir = path.join(workspaceRoot, "target/tmp/repair-auv2");
	mkdirSync(tmpDir, { recursive: true });
	const sourcePath = path.join(tmpDir, `${dylibName}.c`);
	writeFileSync(
		sourcePath,
		`
#include <dlfcn.h>
#include <stdio.h>

typedef void *(*TruceAUFactoryFn)(const void *);

__attribute__((visibility("default")))
void *TruceAUFactory(const void *desc) {
	static void *handle = NULL;
	static TruceAUFactoryFn factory = NULL;
	if (factory == NULL) {
		handle = dlopen("@loader_path/${cString(dylibName)}", RTLD_NOW | RTLD_LOCAL);
		if (handle == NULL) {
			fprintf(stderr, "Cosmo AUv2: dlopen failed: %s\\n", dlerror());
			return NULL;
		}
		factory = (TruceAUFactoryFn)dlsym(handle, "TruceAUFactory");
		if (factory == NULL) {
			fprintf(stderr, "Cosmo AUv2: dlsym failed: %s\\n", dlerror());
			return NULL;
		}
	}
	return factory(desc);
}
`.trimStart(),
	);

	const clangArgs = archs.flatMap((arch) => ["-arch", arch]);
	run("clang", [
		...clangArgs,
		"-bundle",
		"-fvisibility=hidden",
		"-o",
		executablePath,
		sourcePath,
	]);
	writeFileSync(path.join(componentPath, "Contents/PkgInfo"), "BNDL????");
	run("codesign", ["--force", "--deep", "--sign", "-", componentPath]);
	console.log(`AUv2 repair: wrapped ${componentPath}`);
}

for (const component of components) {
	repairComponent(component);
}
