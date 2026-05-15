import { execSync } from "node:child_process";
import { existsSync, rmSync, watch } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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

const spectaTsBindingsOutFile = fileURLToPath(
	new URL("../src/lib/synth/bindings/synth.ts", import.meta.url),
);
const cosmoSynthEngineDir = fileURLToPath(
	new URL("../../cosmo-synth-engine", import.meta.url),
);

function spectaBindingsDevPlugin() {
	const wasmSrcDir = fileURLToPath(
		new URL("../../cosmo-synth-engine/src", import.meta.url),
	);
	const exportBindings = () => {
		console.log("[specta-bindings] Exporting TypeScript bindings...");
		try {
			execSync(
				`cargo run ${releaseCargoForDev ? "--release" : ""} --features specta-bindings --bin export-specta-bindings`,
				{
					stdio: "inherit",
					cwd: cosmoSynthEngineDir,
					env: {
						...process.env,
						CARGO_TARGET_DIR: wasmCargoTargetDir,
						SPECTA_TS_EXPORT_PATH: spectaTsBindingsOutFile,
					},
				},
			);
			console.log("[specta-bindings] TypeScript bindings updated.");
		} catch {
			console.error("[specta-bindings] TypeScript bindings export failed.");
		}
	};

	return {
		name: "specta-bindings-dev",
		apply: "serve",
		configureServer(server) {
			exportBindings();
			let debounce: ReturnType<typeof setTimeout> | undefined;
			watch(wasmSrcDir, { recursive: true }, () => {
				clearTimeout(debounce);
				debounce = setTimeout(() => {
					exportBindings();
					server.ws.send({ type: "full-reload" });
				}, 500);
			});
		},
	};
}

export default defineConfig(async ({ command }) => ({
	publicDir: "public",
	plugins: [spectaBindingsDevPlugin(), wasmDevPlugin(), react(), tailwindcss()],
	define: {
		__WASM_BUILD_PROFILE__: JSON.stringify(
			command === "build" || releaseCargoForDev ? "release" : "debug",
		),
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
