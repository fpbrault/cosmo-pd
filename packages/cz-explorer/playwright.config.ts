/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? "github" : "list",

	use: {
		baseURL: "http://127.0.0.1:1421",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		launchOptions: {
			args: ["--autoplay-policy=user-gesture-required"],
		},
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command:
			"bun --filter @cosmo/cosmo-pd101 build:lib && bunx --bun vite --host 127.0.0.1 --port 1421 --strictPort",
		url: "http://127.0.0.1:1421",
		reuseExistingServer: false,
	},
});
