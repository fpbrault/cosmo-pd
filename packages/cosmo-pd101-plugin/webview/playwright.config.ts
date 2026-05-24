/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";

const playwrightPort = process.env.PLAYWRIGHT_WEB_PORT ?? "5175";
const baseUrl = `http://127.0.0.1:${playwrightPort}`;

/**
 * Playwright E2E config for the cosmo-pd101 webview mock-host harness.
 *
 * Run with:   bun run test:e2e
 * Interactive: bun run test:e2e:ui
 *
 * The Vite dev server is started automatically with VITE_TEST_HARNESS=1 so
 * the mock bridge is installed before React renders.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false, // plugin tests share a single virtual DSP state
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	timeout: 10_000,
	reporter: process.env.CI ? "github" : "list",

	use: {
		baseURL: baseUrl,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command: `bun --filter @cosmo/cosmo-pd101 build:lib && bunx --bun vite --host 127.0.0.1 --port ${playwrightPort} --strictPort`,
		url: baseUrl,
		reuseExistingServer: !process.env.CI,
		env: {
			VITE_TEST_HARNESS: "1",
			VITE_DEBUG_PANEL: "0",
		},
	},
});
