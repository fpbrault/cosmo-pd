import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const webviewDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = path.resolve(webviewDir, "../../..");
const cosmoPd101Src = path.join(webviewDir, "src");
const cosmoPd101LibEntry = fileURLToPath(
	new URL("../../cosmo-pd101/lib-dist/index.mjs", import.meta.url),
);
const rootPackageJsonPath = path.join(repoRoot, "package.json");
const rootPackageJson = JSON.parse(
	fs.readFileSync(rootPackageJsonPath, "utf8"),
) as {
	version?: string;
};
const packageVersion = rootPackageJson.version ?? "0.0.0";

function safeGit(cmd: string): string | null {
	try {
		return execSync(cmd, { cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] })
			.toString("utf8")
			.trim();
	} catch {
		return null;
	}
}

const refName = process.env.GITHUB_REF_NAME?.trim();
const refType = process.env.GITHUB_REF_TYPE?.trim();
const explicitTag =
	refType === "tag" && refName && refName.length > 0
		? refName
		: safeGit("git describe --tags --exact-match");

const appVersion = explicitTag?.replace(/^v/i, "") || packageVersion;
const buildLabel =
	explicitTag || safeGit("git rev-parse --short HEAD") || `v${packageVersion}`;

function getManualChunkName(id: string): string | undefined {
	if (id.includes("/cosmo-pd101/lib-dist/")) {
		return "vendor-cosmo-pd101";
	}

	if (!id.includes("node_modules")) {
		return undefined;
	}

	if (id.includes("/react/") || id.includes("/react-dom/")) {
		return "vendor-react";
	}

	if (id.includes("/i18next/") || id.includes("/react-i18next/")) {
		return "vendor-i18n";
	}

	if (id.includes("/motion/")) {
		return "vendor-motion";
	}

	if (id.includes("/zustand/")) {
		return "vendor-state";
	}

	return "vendor";
}

export default defineConfig(({ command }) => ({
	plugins: [react(), tailwindcss()],
	define: {
		__CZ_APP_VERSION__: JSON.stringify(appVersion),
		__CZ_BUILD_LABEL__: JSON.stringify(buildLabel),
		__RUST_BUILD_PROFILE__: JSON.stringify(
			command === "build" ? "release" : "debug",
		),
	},
	resolve: {
		alias: [
			{ find: "@cosmo/cosmo-pd101", replacement: cosmoPd101LibEntry },
			{ find: "@", replacement: cosmoPd101Src },
		],
		dedupe: ["react", "react-dom"],
	},
	server: {
		fs: {
			allow: [repoRoot],
		},
	},
	base: "./",
	build: {
		outDir: "dist",
		sourcemap: true,
		rollupOptions: {
			output: {
				assetFileNames: "assets/[name][extname]",
				chunkFileNames: "assets/[name].js",
				entryFileNames: "assets/[name].js",
				manualChunks: getManualChunkName,
			},
		},
	},
}));
