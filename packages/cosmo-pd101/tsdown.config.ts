import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: "esm",
	dts: true,
	outDir: "lib-dist",
	clean: true,
	noBundle: true,
	loader: { ".png": "dataurl" },
});
