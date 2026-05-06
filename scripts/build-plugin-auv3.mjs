import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(repoRoot, "packages", "cosmo-pd101-plugin");
const auv3Dir = join(repoRoot, "packages", "cosmo-pd101-plugin-auv3");
const artifactsDir = join(auv3Dir, "Artifacts");
const buildDir = join(auv3Dir, "Build");
const hostExtensionUiDir = join(
	auv3Dir,
	"CosmoPD101Host",
	"CosmoPD101AUv3Ext-macOSExtension",
	"UI",
);
const xcodeProjectPath = join(
	auv3Dir,
	"CosmoPD101Host",
	"CosmoPD101Host.xcodeproj",
);
const xcodeContainerScheme = "CosmoPD101AUv3Ext-macOS";
const xcodeDerivedDataDir = join(buildDir, "XcodeDerivedData");

function parseArgs(argv) {
	const options = {
		release: true,
		swiftBuild: false,
		bundle: false,
		install: false,
		iosXcframework: false,
		webviewOnly: false,
		rustTarget: process.env.RUST_TARGET ?? "",
	};
	for (const arg of argv) {
		if (arg === "--debug") options.release = false;
		if (arg === "--swift-build") options.swiftBuild = true;
		if (arg === "--ios-xcframework") options.iosXcframework = true;
		if (arg === "--webview-only") options.webviewOnly = true;
		if (arg === "--bundle") options.bundle = true;
		if (arg === "--install") {
			options.bundle = true;
			options.install = true;
		}
		if (arg.startsWith("--target="))
			options.rustTarget = arg.slice("--target=".length);
	}
	return options;
}

async function run(command, args, cwd = repoRoot) {
	console.log(`$ ${[command, ...args].join(" ")}`);
	const proc = Bun.spawn([command, ...args], {
		cwd,
		stdout: "inherit",
		stderr: "inherit",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		throw new Error(`${command} exited with ${exitCode}`);
	}
}

async function createIosXcframework(options) {
	const profile = options.release ? "release" : "debug";
	const deviceTarget = "aarch64-apple-ios";
	const simulatorTarget = "aarch64-apple-ios-sim";
	const outputPath = join(artifactsDir, "CosmoPd101Plugin.xcframework");

	await run("rustup", ["target", "add", deviceTarget, simulatorTarget]);
	await run("cargo", [
		"build",
		"-p",
		"cosmo-pd101-plugin",
		...(options.release ? ["--release"] : []),
		"--target",
		deviceTarget,
	]);
	await run("cargo", [
		"build",
		"-p",
		"cosmo-pd101-plugin",
		...(options.release ? ["--release"] : []),
		"--target",
		simulatorTarget,
	]);

	await mkdir(artifactsDir, { recursive: true });
	await rm(outputPath, { recursive: true, force: true });
	await run("xcodebuild", [
		"-create-xcframework",
		"-library",
		join(repoRoot, "target", deviceTarget, profile, "libcosmo_pd101_plugin.a"),
		"-headers",
		join(pluginDir, "include"),
		"-library",
		join(repoRoot, "target", simulatorTarget, profile, "libcosmo_pd101_plugin.a"),
		"-headers",
		join(pluginDir, "include"),
		"-output",
		outputPath,
	]);
	await cp(
		join(pluginDir, "include", "cosmo_pd101_ffi.h"),
		join(artifactsDir, "cosmo_pd101_ffi.h"),
	);
	console.log(`iOS AUv3 XCFramework created at ${outputPath}`);
}

async function copyWebview() {
	const webviewDistDir = join(pluginDir, "webview", "dist");
	await mkdir(hostExtensionUiDir, { recursive: true });
	for (const entry of await readdir(hostExtensionUiDir)) {
		await rm(join(hostExtensionUiDir, entry), { recursive: true, force: true });
	}
	for (const entry of await readdir(webviewDistDir)) {
		await cp(join(webviewDistDir, entry), join(hostExtensionUiDir, entry), {
			recursive: true,
		});
	}
}

async function copyRustArtifacts(options) {
	const profile = options.release ? "release" : "debug";
	const targetParts = [repoRoot, "target"];
	if (options.rustTarget) targetParts.push(options.rustTarget);
	targetParts.push(profile);
	const targetDir = join(...targetParts);

	await mkdir(artifactsDir, { recursive: true });
	await cp(
		join(targetDir, "libcosmo_pd101_plugin.a"),
		join(artifactsDir, "libcosmo_pd101_plugin.a"),
	);
	await cp(
		join(pluginDir, "include", "cosmo_pd101_ffi.h"),
		join(artifactsDir, "cosmo_pd101_ffi.h"),
	);
}

async function buildMacAuv3AppWithXcode(options) {
	const configuration = options.release ? "Release" : "Debug";
	await rm(xcodeDerivedDataDir, { recursive: true, force: true });
	await run("xcodebuild", [
		"-project",
		xcodeProjectPath,
		"-scheme",
		xcodeContainerScheme,
		"-configuration",
		configuration,
		"-sdk",
		"macosx",
		"-derivedDataPath",
		xcodeDerivedDataDir,
		"build",
	]);

	const productsDir = join(
		xcodeDerivedDataDir,
		"Build",
		"Products",
		`${configuration}-macosx`,
	);
	const builtAppPath = join(productsDir, `${xcodeContainerScheme}.app`);
	const stagedAppPath = join(buildDir, "Cosmo PD-101.app");

	await rm(stagedAppPath, { recursive: true, force: true });
	await mkdir(buildDir, { recursive: true });
	await cp(builtAppPath, stagedAppPath, { recursive: true });

	return stagedAppPath;
}

async function installMacAuv3App(appPath) {
	const applicationsDir = join(homedir(), "Applications");
	const installedAppDir = join(applicationsDir, "Cosmo PD-101.app");
	await mkdir(applicationsDir, { recursive: true });
	await rm(installedAppDir, { recursive: true, force: true });
	await cp(appPath, installedAppDir, { recursive: true });

	const pluginsDir = join(installedAppDir, "Contents", "PlugIns");
	const pluginEntries = await readdir(pluginsDir);
	const extensionName = pluginEntries.find((entry) => entry.endsWith(".appex"));
	if (!extensionName) {
		throw new Error(`No .appex found under ${pluginsDir}`);
	}

	await run("pluginkit", ["-a", join(pluginsDir, extensionName)]);
	await run("pluginkit", [
		"-e",
		"use",
		"-i",
		"ca.purraudio.cosmo-pd101.auv3.extension",
	]);
	await run("open", [installedAppDir]);
	await run("killall", ["-9", "AudioComponentRegistrar"]);

	return installedAppDir;
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	await run("bun", ["--filter", "@cosmo/cosmo-pd101-plugin-webview", "build"]);
	await copyWebview();

	if (options.webviewOnly) {
		console.log(`AUv3 webview assets staged in ${auv3Dir}`);
		return;
	}

	if (options.iosXcframework) {
		await createIosXcframework(options);
		console.log(`AUv3 iOS assets staged in ${auv3Dir}`);
		return;
	}

	const cargoArgs = ["build", "-p", "cosmo-pd101-plugin"];
	if (options.release) cargoArgs.push("--release");
	if (options.rustTarget) cargoArgs.push("--target", options.rustTarget);
	await run("cargo", cargoArgs);
	await copyRustArtifacts(options);

	if (options.swiftBuild) {
		await run("swift", ["build"], auv3Dir);
	}

	if (options.bundle) {
		const stagedAppPath = await buildMacAuv3AppWithXcode(options);
		if (options.install) {
			const installedAppPath = await installMacAuv3App(stagedAppPath);
			console.log(`Installed AUv3 container app to ${installedAppPath}`);
		} else {
			console.log(`AUv3 app bundle created at ${stagedAppPath}`);
		}
	}

	console.log(`AUv3 assets staged in ${auv3Dir}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
