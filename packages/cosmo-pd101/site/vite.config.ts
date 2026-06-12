import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const rootPackageJsonPath = path.resolve(
	fileURLToPath(new URL("../../../package.json", import.meta.url)),
);
const rootPackageJson = JSON.parse(
	existsSync(rootPackageJsonPath)
		? readFileSync(rootPackageJsonPath, "utf8")
		: '{"version": "0.0.0"}',
) as { version?: string };
const packageVersion = rootPackageJson.version ?? "0.0.0";

const wasmOutDir = fileURLToPath(
	new URL("./public/cosmo-synth-engine-wasm", import.meta.url),
);
const wasmCargoTargetDir = fileURLToPath(
	new URL("../../cosmo-synth-engine/target", import.meta.url),
);
const releaseCargoForDev = process.env.COSMO_DEV_RELEASE === "1";

function wasmDevPlugin() {
	const wasmSrcDir = fileURLToPath(
		new URL("../../cosmo-synth-engine/src", import.meta.url),
	);
	const buildWasm = () => {
		console.log("[wasm-dev] Building WASM...");
		try {
			execSync(
				`wasm-pack build ../../cosmo-synth-engine ${releaseCargoForDev ? "--release" : ""} --target no-modules --out-dir ${wasmOutDir} --features wasm`,
				{
					stdio: "inherit",
					env: {
						...process.env,
						CARGO_TARGET_DIR: wasmCargoTargetDir,
					},
				},
			);
			const generatedGitignore = `${wasmOutDir}/.gitignore`;
			if (existsSync(generatedGitignore)) {
				rmSync(generatedGitignore);
			}
			console.log("[wasm-dev] WASM build complete.");
		} catch {
			console.error("[wasm-dev] WASM build failed.");
		}
	};

	return {
		name: "wasm-dev",
		apply: "serve",
		configureServer(server) {
			buildWasm();
			let debounce: ReturnType<typeof setTimeout> | undefined;
			watch(wasmSrcDir, { recursive: true }, () => {
				clearTimeout(debounce);
				debounce = setTimeout(() => {
					buildWasm();
					server.ws.send({ type: "full-reload" });
				}, 300);
			});
		},
	};
}

const spectaSynthOutFile = fileURLToPath(
	new URL("../src/lib/synth/bindings/synth.ts", import.meta.url),
);
const spectaBridgeOutFile = fileURLToPath(
	new URL("../src/lib/synth/bindings/plugin-bridge.ts", import.meta.url),
);
const cosmoSynthEngineDir = fileURLToPath(
	new URL("../../cosmo-synth-engine", import.meta.url),
);
const cosmoBridgeTypesDir = fileURLToPath(
	new URL("../../cosmo-pd101-bridge-types", import.meta.url),
);

function spectaBindingsDevPlugin() {
	const synthSrcDir = fileURLToPath(
		new URL("../../cosmo-synth-engine/src", import.meta.url),
	);
	const bridgeTypesSrcDir = fileURLToPath(
		new URL("../../cosmo-pd101-bridge-types/src", import.meta.url),
	);
	const bridgeTypesExportFile = fileURLToPath(
		new URL(
			"../../cosmo-pd101-bridge-types/export_specta_bindings.rs",
			import.meta.url,
		),
	);

	const exportSynthBindings = () => {
		console.log("[specta-bindings] Exporting synth TypeScript bindings...");
		try {
			execSync(
				`cargo run ${releaseCargoForDev ? "--release" : ""} --features specta-bindings --bin export-specta-bindings`,
				{
					stdio: "inherit",
					cwd: cosmoSynthEngineDir,
					env: {
						...process.env,
						CARGO_TARGET_DIR: wasmCargoTargetDir,
						SPECTA_TS_EXPORT_PATH: spectaSynthOutFile,
					},
				},
			);
			console.log("[specta-bindings] Synth bindings updated.");
		} catch {
			console.error("[specta-bindings] Synth bindings export failed.");
		}
	};

	const exportBridgeBindings = () => {
		console.log("[specta-bindings] Exporting bridge TypeScript bindings...");
		try {
			execSync(
				`cargo run ${releaseCargoForDev ? "--release" : ""} --features specta-bindings --bin export-specta-bindings`,
				{
					stdio: "inherit",
					cwd: cosmoBridgeTypesDir,
					env: {
						...process.env,
						CARGO_TARGET_DIR: wasmCargoTargetDir,
						SPECTA_TS_EXPORT_PATH: spectaBridgeOutFile,
					},
				},
			);
			console.log("[specta-bindings] Bridge bindings updated.");
		} catch {
			console.error("[specta-bindings] Bridge bindings export failed.");
		}
	};

	return {
		name: "specta-bindings-dev",
		apply: "serve",
		configureServer(server) {
			// Initial exports
			exportSynthBindings();
			exportBridgeBindings();

			// Watch synth-engine sources
			let synthDebounce: ReturnType<typeof setTimeout> | undefined;
			watch(synthSrcDir, { recursive: true }, () => {
				clearTimeout(synthDebounce);
				synthDebounce = setTimeout(() => {
					exportSynthBindings();
					server.ws.send({ type: "full-reload" });
				}, 500);
			});

			// Watch bridge-types sources + export script
			let bridgeDebounce: ReturnType<typeof setTimeout> | undefined;
			const watchPaths = [bridgeTypesSrcDir, bridgeTypesExportFile];
			for (const p of watchPaths) {
				watch(p, { recursive: p === bridgeTypesSrcDir }, () => {
					clearTimeout(bridgeDebounce);
					bridgeDebounce = setTimeout(() => {
						exportBridgeBindings();
						server.ws.send({ type: "full-reload" });
					}, 500);
				});
			}
		},
	};
}

export default defineConfig(async ({ command }) => ({
	publicDir: "public",
	plugins: [
		spectaBindingsDevPlugin(),
		wasmDevPlugin(),
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: ["icon-192.png", "icon-512.png"],
			manifest: {
				name: "Cosmo PD Synth",
				short_name: "Cosmo PD",
				description:
					"Experimental phase distortion synthesizer – play, tweak, and explore unique waveforms in your browser",
				theme_color: "#0f0f0f",
				background_color: "#0f0f0f",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "icon-512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
	define: {
		__WASM_BUILD_PROFILE__: JSON.stringify(
			command === "build" || releaseCargoForDev ? "release" : "debug",
		),
		__CZ_APP_VERSION__: JSON.stringify(packageVersion),
	},
	resolve: {
		alias: [
			{
				find: "@",
				replacement: fileURLToPath(new URL("../src", import.meta.url)),
			},
		],
	},
	build: {
		rollupOptions: {
			input: {
				main: fileURLToPath(new URL("./index.html", import.meta.url)),
			},
		},
	},
	clearScreen: false,
	server: {
		port: 1421,
		strictPort: true,
		host: "0.0.0.0",
	},
}));
