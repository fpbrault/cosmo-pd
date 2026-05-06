import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(repoRoot, "packages", "cosmo-pd101-plugin");
const auv3Dir = join(repoRoot, "packages", "cosmo-pd101-plugin-auv3");
const artifactsDir = join(auv3Dir, "Artifacts");
const buildDir = join(auv3Dir, "Build");
const resourceUiDir = join(
	auv3Dir,
	"Sources",
	"CosmoPd101AUv3",
	"Resources",
	"ui",
);
const hostExtensionUiDir = join(
	auv3Dir,
	"CosmoPD101Host",
	"CosmoPD101AUv3Ext-macOSExtension",
	"UI",
);

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
	await mkdir(resourceUiDir, { recursive: true });
	for (const entry of await readdir(resourceUiDir)) {
		await rm(join(resourceUiDir, entry), { recursive: true, force: true });
	}
	for (const entry of await readdir(webviewDistDir)) {
		await cp(join(webviewDistDir, entry), join(resourceUiDir, entry), {
			recursive: true,
		});
	}

	for (const uiDir of [hostExtensionUiDir]) {
		await mkdir(uiDir, { recursive: true });
		for (const entry of await readdir(webviewDistDir)) {
			await cp(join(webviewDistDir, entry), join(uiDir, entry), {
				recursive: true,
			});
		}
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

function appInfoPlist() {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleExecutable</key>
	<string>CosmoPD101</string>
	<key>CFBundleIdentifier</key>
	<string>ca.purraudio.cosmo-pd101.auv3.container</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>Cosmo PD-101</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>0.1.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSMinimumSystemVersion</key>
	<string>13.0</string>
</dict>
</plist>
`;
}

function appexInfoPlist() {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>Cosmo PD-101</string>
	<key>CFBundleExecutable</key>
	<string>CosmoPD101AUv3</string>
	<key>CFBundleIdentifier</key>
	<string>ca.purraudio.cosmo-pd101.auv3.extension</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>Cosmo PD-101 AUv3</string>
	<key>CFBundlePackageType</key>
	<string>XPC!</string>
	<key>CFBundleShortVersionString</key>
	<string>0.1.0</string>
	<key>CFBundleSupportedPlatforms</key>
	<array>
		<string>MacOSX</string>
	</array>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>NSExtension</key>
	<dict>
		<key>NSExtensionPointIdentifier</key>
		<string>com.apple.AudioUnit-UI</string>
		<key>NSExtensionPrincipalClass</key>
		<string>CosmoPd101AUv3.CosmoPd101ViewController</string>
		<key>NSExtensionAttributes</key>
		<dict>
			<key>AudioComponents</key>
			<array>
				<dict>
					<key>type</key>
					<string>aumu</string>
					<key>subtype</key>
					<string>Cpd3</string>
					<key>manufacturer</key>
					<string>PurA</string>
					<key>name</key>
					<string>Purr Audio: Cosmo PD-101 AUv3</string>
					<key>description</key>
					<string>Cosmo PD-101 Phase Distortion Synthesizer</string>
					<key>version</key>
					<integer>65536</integer>
					<key>sandboxSafe</key>
					<true/>
					<key>tags</key>
					<array>
						<string>Synthesizer</string>
					</array>
				</dict>
			</array>
		</dict>
	</dict>
</dict>
</plist>
`;
}

async function swiftSourceFiles() {
	const sourceDir = join(auv3Dir, "Sources", "CosmoPd101AUv3");
	const entries = await readdir(sourceDir);
	return entries
		.filter((entry) => entry.endsWith(".swift"))
		.sort()
		.map((entry) => join(sourceDir, entry));
}

async function standaloneSwiftSourceFiles() {
	return [
		join(auv3Dir, "Sources", "CosmoPd101Standalone", "main.swift"),
		join(auv3Dir, "Sources", "CosmoPd101AUv3", "CosmoPd101Ffi.swift"),
	];
}

async function createAuv3Bundle(options) {
	const appDir = join(buildDir, "Cosmo PD-101.app");
	const contentsDir = join(appDir, "Contents");
	const appMacosDir = join(contentsDir, "MacOS");
	const appResourcesDir = join(contentsDir, "Resources");
	const pluginsDir = join(contentsDir, "PlugIns");
	const appexDir = join(pluginsDir, "CosmoPD101AUv3.appex");
	const appexContentsDir = join(appexDir, "Contents");
	const appexMacosDir = join(appexContentsDir, "MacOS");
	const appexResourcesDir = join(appexContentsDir, "Resources");

	await rm(appDir, { recursive: true, force: true });
	await mkdir(appMacosDir, { recursive: true });
	await mkdir(appResourcesDir, { recursive: true });
	await mkdir(pluginsDir, { recursive: true });
	await mkdir(appexMacosDir, { recursive: true });
	await mkdir(appexResourcesDir, { recursive: true });

	await writeFile(join(contentsDir, "Info.plist"), appInfoPlist());
	await writeFile(join(contentsDir, "PkgInfo"), "APPL????");
	await writeFile(join(appexContentsDir, "Info.plist"), appexInfoPlist());

	const standaloneArgs = [
		"-emit-executable",
		"-module-name",
		"CosmoPd101Standalone",
		...(options.release ? ["-O"] : []),
		...(await standaloneSwiftSourceFiles()),
		join(artifactsDir, "libcosmo_pd101_plugin.a"),
		"-framework",
		"Foundation",
		"-framework",
		"AppKit",
		"-framework",
		"AVFoundation",
		"-framework",
		"AudioToolbox",
		"-framework",
		"CoreMIDI",
		"-framework",
		"WebKit",
		"-o",
		join(appMacosDir, "CosmoPD101"),
	];
	await run("swiftc", standaloneArgs);

	const swiftArgs = [
		"-emit-executable",
		"-module-name",
		"CosmoPd101AUv3",
		"-parse-as-library",
		...(options.release ? ["-O"] : []),
		...(await swiftSourceFiles()),
		join(artifactsDir, "libcosmo_pd101_plugin.a"),
		"-framework",
		"Foundation",
		"-framework",
		"AppKit",
		"-framework",
		"AudioToolbox",
		"-framework",
		"AVFoundation",
		"-framework",
		"CoreAudioKit",
		"-framework",
		"WebKit",
		"-Xlinker",
		"-e",
		"-Xlinker",
		"_NSExtensionMain",
		"-o",
		join(appexMacosDir, "CosmoPD101AUv3"),
	];
	await run("swiftc", swiftArgs);

	await cp(resourceUiDir, join(appResourcesDir, "ui"), { recursive: true });
	await cp(resourceUiDir, join(appexResourcesDir, "ui"), { recursive: true });

	const entitlementsPath = join(
		auv3Dir,
		"Sources",
		"CosmoPd101AUv3",
		"Resources",
		"appex.entitlements",
	);
	await run("codesign", [
		"--force",
		"--sign",
		"-",
		"--entitlements",
		entitlementsPath,
		appexDir,
	]);
	await run("codesign", ["--force", "--sign", "-", appDir]);

	if (options.install) {
		const applicationsDir = join(homedir(), "Applications");
		const installedAppDir = join(applicationsDir, "Cosmo PD-101.app");
		await mkdir(applicationsDir, { recursive: true });
		await rm(installedAppDir, { recursive: true, force: true });
		await cp(appDir, installedAppDir, { recursive: true });
		await run("pluginkit", [
			"-a",
			join(installedAppDir, "Contents", "PlugIns", "CosmoPD101AUv3.appex"),
		]);
		await run("pluginkit", [
			"-e",
			"use",
			"-i",
			"ca.purraudio.cosmo-pd101.auv3.extension",
		]);
		await run("open", [installedAppDir]);
		await run("killall", ["-9", "AudioComponentRegistrar"]);
		console.log(`Installed AUv3 container app to ${installedAppDir}`);
	} else {
		console.log(`AUv3 app bundle created at ${appDir}`);
	}
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
		await createAuv3Bundle(options);
	}

	console.log(`AUv3 assets staged in ${auv3Dir}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
