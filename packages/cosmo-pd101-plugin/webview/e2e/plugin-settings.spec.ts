import { expect, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 1368, height: 912 });
	await setupPluginPage(page, { keyboard: true });
});

test.describe("Synth settings", () => {
	test("exposes tempo and voice allocation from simple mode", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		await page.getByRole("button", { name: "Open synth settings" }).click();

		const settings = page.getByRole("dialog", { name: "Synth settings" });
		await expect(settings).toBeVisible();
		await expect(
			settings.getByText("Performance", { exact: true }),
		).toBeVisible();
		await expect(
			settings.getByText("Transport", { exact: true }),
		).toBeVisible();
		await expect(
			settings.getByText("Voice Allocation", { exact: true }),
		).toBeVisible();
		await expect(settings.getByRole("spinbutton")).toBeVisible();
		await expect(
			settings.getByRole("combobox", { name: /Voice limit:/i }),
		).toBeVisible();
	});
});
