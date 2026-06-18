import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(repoRoot, "packages", "cosmo-pd101-plugin");
const auv3Dir = join(repoRoot, "packages", "cosmo-pd101-plugin-auv3");
const artifactsDir = join(auv3Dir, "Artifacts");
const artifactsHeadersDir = join(artifactsDir, "Headers");
const buildDir = join(auv3Dir, "Build");
const clangModuleCacheDir = join(buildDir, "ClangModuleCache");
const xcodeDerivedDataDir = join(buildDir, "XcodeDerivedData");
const xcodeProductsDir = join(buildDir, "XcodeProducts");
const stagedAppPath = join(buildDir, "Cosmo PD-101.app");
const installAppPath = join(
	process.env.HOME ?? "",
	"Applications",
	"Cosmo PD-101.app",
);
const hostProject = join(auv3Dir, "CosmoPD101Host", "CosmoPD101Host.xcodeproj");
const cargoConfigPath = join(repoRoot, ".cargo", "config.toml");
const hostExtensionUiDir = join(
	auv3Dir,
	"CosmoPD101Host",
	"CosmoPD101AUv3Ext-macOSExtension",
	"UI",
);
const iosDeploymentTarget = "18.6";
const macScheme = "CosmoPD101Host";
const macConfiguration = "Release";

function parseArgs(argv) {
	const options = {
		release: true,
		iosXcframework: false,
		webviewOnly: false,
		bundle: false,
		install: false,
	};
	for (const arg of argv) {
		if (arg === "--debug") options.release = false;
		if (arg === "--ios-xcframework") options.iosXcframework = true;
		if (arg === "--webview-only") options.webviewOnly = true;
		if (arg === "--bundle") options.bundle = true;
		if (arg === "--install") {
			options.bundle = true;
			options.install = true;
		}
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

async function resolveTruceAuHeader() {
	const proc = Bun.spawn(["cargo", "metadata", "--format-version", "1"], {
		cwd: repoRoot,
		env: process.env,
		stdout: "pipe",
		stderr: "inherit",
	});
	const metadata = await new Response(proc.stdout).json();
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		throw new Error(`cargo metadata exited with ${exitCode}`);
	}
	const shimPackage = metadata.packages.find(
		(pkg) => pkg.name === "truce-shim-types",
	);
	if (!shimPackage) {
		throw new Error("cargo metadata did not resolve truce-shim-types");
	}
	return join(dirname(shimPackage.manifest_path), "include", "au_shim_types.h");
}

async function loadCargoConfigEnv() {
	try {
		const contents = await readFile(cargoConfigPath, "utf8");
		const envSection = contents.match(/\[env\]([\s\S]*)/);
		if (!envSection) {
			return {};
		}

		const values = {};
		for (const line of envSection[1].split("\n")) {
			const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"([^"]*)"/);
			if (match) {
				values[match[1]] = match[2];
			}
		}
		return values;
	} catch {
		return {};
	}
}

function extractTeamId(identity) {
	const match = identity?.match(/\(([A-Z0-9]+)\)\s*$/);
	return match?.[1] ?? null;
}

function resolveMacSigning(configEnv) {
	const rawIdentity =
		process.env.TRUCE_IOS_SIGNING_IDENTITY ??
		configEnv.TRUCE_IOS_SIGNING_IDENTITY ??
		null;
	const identity =
		rawIdentity && /(?:Apple|Mac) Development:/.test(rawIdentity)
			? "Apple Development"
			: null;
	const teamId =
		process.env.TRUCE_IOS_TEAM_ID ??
		configEnv.TRUCE_IOS_TEAM_ID ??
		process.env.TEAM_ID ??
		configEnv.TEAM_ID ??
		extractTeamId(rawIdentity) ??
		null;
	return { identity, teamId };
}

async function resetDirectoryContents(dir) {
	await mkdir(dir, { recursive: true });
	for (const entry of await readdir(dir)) {
		await rm(join(dir, entry), { recursive: true, force: true });
	}
}

async function copyWebview() {
	const webviewDistDir = join(pluginDir, "webview", "dist");
	await resetDirectoryContents(hostExtensionUiDir);
	for (const entry of await readdir(webviewDistDir)) {
		await cp(join(webviewDistDir, entry), join(hostExtensionUiDir, entry), {
			recursive: true,
		});
	}
}

async function stageMacArtifacts(options) {
	const profile = options.release ? "auv3" : "debug";
	const truceAuHeader = await resolveTruceAuHeader();
	await run(
		"cargo",
		[
			"build",
			"-p",
			"cosmo-pd101-plugin",
			...(options.release ? ["--profile", "auv3"] : []),
			"--no-default-features",
			"--features",
			"au",
		],
		repoRoot,
		{ CLANG_MODULE_CACHE_PATH: clangModuleCacheDir },
	);

	await mkdir(artifactsDir, { recursive: true });
	await cp(
		join(repoRoot, "target", profile, "libcosmo_pd101_plugin.a"),
		join(artifactsDir, "libcosmo_pd101_plugin.a"),
	);
	await cp(
		join(pluginDir, "include", "cosmo_pd101_ffi.h"),
		join(artifactsDir, "cosmo_pd101_ffi.h"),
	);
	await cp(truceAuHeader, join(artifactsDir, "au_shim_types.h"));

	const xcframeworkPath = join(artifactsDir, "CosmoPd101Plugin.xcframework");
	await rm(xcframeworkPath, { recursive: true, force: true });
	await run("xcodebuild", [
		"-create-xcframework",
		"-library",
		join(artifactsDir, "libcosmo_pd101_plugin.a"),
		"-output",
		xcframeworkPath,
	]);
}

async function buildMacHostApp(options) {
	const configEnv = await loadCargoConfigEnv();
	const signing = resolveMacSigning(configEnv);
	await stageMacArtifacts(options);
	await mkdir(buildDir, { recursive: true });
	await rm(xcodeDerivedDataDir, { recursive: true, force: true });
	await rm(xcodeProductsDir, { recursive: true, force: true });
	await rm(stagedAppPath, { recursive: true, force: true });
	await mkdir(xcodeProductsDir, { recursive: true });

	const xcodeArgs = [
		"-project",
		hostProject,
		"-scheme",
		macScheme,
		"-configuration",
		macConfiguration,
		"-derivedDataPath",
		xcodeDerivedDataDir,
		`CONFIGURATION_BUILD_DIR=${xcodeProductsDir}`,
		"CODE_SIGN_STYLE=Automatic",
		"CODE_SIGNING_ALLOWED=YES",
		"CODE_SIGNING_REQUIRED=YES",
		"-allowProvisioningUpdates",
		"build",
	];
	if (signing.teamId) {
		xcodeArgs.splice(-1, 0, `DEVELOPMENT_TEAM=${signing.teamId}`);
	}
	if (signing.identity) {
		xcodeArgs.splice(-1, 0, `CODE_SIGN_IDENTITY=${signing.identity}`);
	}

	await run("xcodebuild", xcodeArgs);

	const builtAppPath = join(xcodeProductsDir, "CosmoPD101AUv3Ext-macOS.app");
	await cp(builtAppPath, stagedAppPath, { recursive: true });
	console.log(`AUv3 macOS app staged at ${stagedAppPath}`);
	return stagedAppPath;
}

async function registerEmbeddedAuv3(appPath) {
	const appexPath = join(
		appPath,
		"Contents",
		"PlugIns",
		"CosmoPD101AUv3Ext-macOSExtension.appex",
	);
	await run("pluginkit", ["-r", appexPath]);
	await run("pluginkit", ["-a", appexPath]);
}

async function installMacHostApp(appPath) {
	if (!installAppPath) {
		throw new Error("HOME must be set to install the AUv3 host app");
	}
	await mkdir(dirname(installAppPath), { recursive: true });
	await rm(installAppPath, { recursive: true, force: true });
	await cp(appPath, installAppPath, { recursive: true });
	await registerEmbeddedAuv3(installAppPath);
	console.log(`AUv3 macOS app installed at ${installAppPath}`);
}

async function createIosXcframework(options) {
	const profile = options.release ? "auv3" : "debug";
	const truceAuHeader = await resolveTruceAuHeader();
	const deviceTarget = "aarch64-apple-ios";
	const simulatorTarget = "aarch64-apple-ios-sim";
	const outputPath = join(artifactsDir, "CosmoPd101Plugin.xcframework");

	await run("rustup", ["target", "add", deviceTarget, simulatorTarget]);
	const iosFeatures = ["--no-default-features", "--features", "au"];
	await run(
		"cargo",
		[
			"build",
			"-p",
			"cosmo-pd101-plugin",
			...(options.release ? ["--profile", "auv3"] : []),
			...iosFeatures,
			"--target",
			deviceTarget,
		],
		repoRoot,
		{
			CLANG_MODULE_CACHE_PATH: clangModuleCacheDir,
			IPHONEOS_DEPLOYMENT_TARGET: iosDeploymentTarget,
		},
	);
	await run(
		"cargo",
		[
			"build",
			"-p",
			"cosmo-pd101-plugin",
			...(options.release ? ["--profile", "auv3"] : []),
			...iosFeatures,
			"--target",
			simulatorTarget,
		],
		repoRoot,
		{
			CLANG_MODULE_CACHE_PATH: clangModuleCacheDir,
			IPHONEOS_DEPLOYMENT_TARGET: iosDeploymentTarget,
		},
	);

	await mkdir(artifactsDir, { recursive: true });
	await resetDirectoryContents(artifactsHeadersDir);
	await cp(
		join(pluginDir, "include", "cosmo_pd101_ffi.h"),
		join(artifactsHeadersDir, "cosmo_pd101_ffi.h"),
	);
	await cp(truceAuHeader, join(artifactsHeadersDir, "au_shim_types.h"));
	await rm(outputPath, { recursive: true, force: true });
	await run("xcodebuild", [
		"-create-xcframework",
		"-library",
		join(repoRoot, "target", deviceTarget, profile, "libcosmo_pd101_plugin.a"),
		"-headers",
		artifactsHeadersDir,
		"-library",
		join(
			repoRoot,
			"target",
			simulatorTarget,
			profile,
			"libcosmo_pd101_plugin.a",
		),
		"-headers",
		artifactsHeadersDir,
		"-output",
		outputPath,
	]);
	await cp(
		join(pluginDir, "include", "cosmo_pd101_ffi.h"),
		join(artifactsDir, "cosmo_pd101_ffi.h"),
	);
	await cp(truceAuHeader, join(artifactsDir, "au_shim_types.h"));
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

	if (options.bundle) {
		const appPath = await buildMacHostApp(options);
		if (options.install) {
			await installMacHostApp(appPath);
		}
		return;
	}

	await stageMacArtifacts(options);
	console.log(`AUv3 macOS assets staged in ${auv3Dir}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
