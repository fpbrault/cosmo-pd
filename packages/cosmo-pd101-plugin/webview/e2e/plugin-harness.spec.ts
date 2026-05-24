import { expect, type Page, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

async function revealMainVolumeValueBubble(page: Page) {
	const knob = page.getByRole("spinbutton", { name: "Main Volume" });
	await expect(knob).toBeVisible();
	await knob.hover();
	return page.getByRole("button", { name: "Main Volume value" });
}

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("Harness shell", () => {
	test("test harness root element is present", async ({ page }) => {
		await expect(page.getByTestId("test-harness")).toBeVisible();
	});

	test("debug panel toggle opens and closes the panel", async ({ page }) => {
		const toggle = page.getByTestId("debug-panel-toggle");
		const panel = page.getByTestId("debug-panel");

		// Panel starts closed (VITE_DEBUG_PANEL=0)
		await expect(panel).not.toBeVisible();
		// Click toggle to open
		await toggle.click();
		await expect(panel).toBeVisible();
		// Click toggle to close
		await toggle.click();
		await expect(panel).not.toBeVisible();
	});

	test("debug panel push controls send an inbound update", async ({ page }) => {
		const panel = page.getByTestId("debug-panel");
		if (!(await panel.isVisible())) {
			await page.getByTestId("debug-panel-toggle").click();
		}

		// Wait for the debug panel inputs to be visible and ready
		await page.getByTestId("debug-push-id").waitFor({ state: "visible" });
		await page.getByTestId("debug-push-value").waitFor({ state: "visible" });

		await page.getByTestId("debug-push-id").fill("0");
		await page.getByTestId("debug-push-value").fill("0.9");
		await page.getByTestId("debug-push-btn").click();

		await expect(await revealMainVolumeValueBubble(page)).toContainText("90%", {
			timeout: 2000,
		});
	});
});
