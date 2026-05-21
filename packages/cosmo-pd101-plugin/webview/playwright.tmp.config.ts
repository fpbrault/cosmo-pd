import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	retries: 0,
	timeout: 10_000,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:5175",
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
		command:
			"bun --filter @cosmo/cosmo-pd101 build:lib && bunx --bun vite --host 127.0.0.1 --port 5175 --strictPort",
		url: "http://127.0.0.1:5175",
		reuseExistingServer: false,
		env: {
			VITE_TEST_HARNESS: "1",
			VITE_DEBUG_PANEL: "0",
		},
	},
});
