import { expect, test } from "@playwright/test";
import { waitForBridge } from "./helpers/pluginBridge";

const LATEST_RELEASE_URL =
	"https://api.github.com/repos/fpbrault/cosmo-pd/releases/latest";

test.beforeEach(async ({ page }) => {
	await page.route(LATEST_RELEASE_URL, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				tag_name: "v0.0.0",
				html_url: "https://github.com/fpbrault/cosmo-pd/releases/tag/v0.0.0",
			}),
		});
	});
});

test.describe("Preset name persistence", () => {
	test("restores preset name from IPC on mount", async ({ page }) => {
		await page.addInitScript(() => {
			window.__CZ_MOCK_PRESET_NAME = "Warm Pad";
		});
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await waitForBridge(page);
		await expect(page.getByText("COSMO").first()).toBeVisible({
			timeout: 5000,
		});

		const presetButton = page.getByRole("button", { name: /^preset /i });
		await expect(presetButton).toContainText("Warm Pad", { timeout: 5000 });
	});

	test("preset name is saved via IPC after host selection", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await waitForBridge(page);
		await expect(page.getByText("COSMO").first()).toBeVisible({
			timeout: 5000,
		});

		await page.waitForFunction(
			() => typeof window.__czOnHostPresetSelected === "function",
			{ timeout: 5000 },
		);

		await page.evaluate(() => {
			window.__czOnHostPresetSelected?.("Factory Brass");
		});

		const storedName = await page.evaluate(async () => {
			const name = await window.__czGetPresetName?.();
			return typeof name === "string" ? name : null;
		});
		expect(storedName).toBe("Factory Brass");
	});
});
