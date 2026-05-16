import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(repoRoot, "packages", "cosmo-pd101-plugin");
const auv3Dir = join(repoRoot, "packages", "cosmo-pd101-plugin-auv3");
const artifactsDir = join(auv3Dir, "Artifacts");
const hostExtensionUiDir = join(
	auv3Dir,
	"CosmoPD101Host",
	"CosmoPD101AUv3Ext-macOSExtension",
	"UI",
);

const iosDeploymentTarget = "18.6";

function parseArgs(argv) {
	const options = {
		release: true,
		iosXcframework: false,
		webviewOnly: false,
	};
	for (const arg of argv) {
		if (arg === "--debug") options.release = false;
		if (arg === "--ios-xcframework") options.iosXcframework = true;
		if (arg === "--webview-only") options.webviewOnly = true;
	}
	return options;
}

async function run(command, args, cwd = repoRoot, env = {}) {
	console.log(`$ ${[command, ...args].join(" ")}`);
	const proc = Bun.spawn([command, ...args], {
		cwd,
		env: { ...process.env, ...env },
		stdout: "inherit",
		stderr: "inherit",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		throw new Error(`${command} exited with ${exitCode}`);
	}
}

async function copyWebview() {
	const webviewDistDir = join(pluginDir, "webview", "dist");
	for (const entry of await fs.readdir(hostExtensionUiDir)) {
		await rm(join(hostExtensionUiDir, entry), { recursive: true, force: true });
	}
	for (const entry of await fs.readdir(webviewDistDir)) {
		await cp(join(webviewDistDir, entry), join(hostExtensionUiDir, entry), {
			recursive: true,
		});
	}
}

async function createIosXcframework(options) {
	const profile = options.release ? "auv3" : "debug";
	const deviceTarget = "aarch64-apple-ios";
	const simulatorTarget = "aarch64-apple-ios-sim";
	const outputPath = join(artifactsDir, "CosmoPd101Plugin.xcframework");

	await run("rustup", ["target", "add", deviceTarget, simulatorTarget]);
	await run(
		"cargo",
		[
			"build",
			"-p",
			"cosmo-pd101-plugin",
			...(options.release ? ["--profile", "auv3"] : []),
			"--target",
			deviceTarget,
		],
		repoRoot,
		{ IPHONEOS_DEPLOYMENT_TARGET: iosDeploymentTarget },
	);
	await run(
		"cargo",
		[
			"build",
			"-p",
			"cosmo-pd101-plugin",
			...(options.release ? ["--profile", "auv3"] : []),
			"--target",
			simulatorTarget,
		],
		repoRoot,
		{ IPHONEOS_DEPLOYMENT_TARGET: iosDeploymentTarget },
	);

	await mkdir(artifactsDir, { recursive: true });
	await rm(outputPath, { recursive: true, force: true });
	await run("xcodebuild", [
		"-create-xcframework",
		"-library",
		join(repoRoot, "target", deviceTarget, profile, "libcosmo_pd101_plugin.a"),
		"-headers",
		join(pluginDir, "include"),
		"-library",
		join(
			repoRoot,
			"target",
			simulatorTarget,
			profile,
			"libcosmo_pd101_plugin.a",
		),
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

	console.log(
		"Usage: build-plugin-auv3.mjs [--webview-only] [--ios-xcframework] [--debug]",
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
