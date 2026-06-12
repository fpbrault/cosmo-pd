import { expect, test } from "@playwright/test";
import { setupPluginPage, waitForBridge } from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 980 });
	await setupPluginPage(page, { keyboard: true });
});

test.describe("Plugin shell visual smoke", () => {
	test("captures plugin shell at 1152x864", async ({ page }, testInfo) => {
		await page.setViewportSize({ width: 1152, height: 864 });
		await expect(page.getByTestId("test-harness")).toBeVisible();
		await page.screenshot({
			path: testInfo.outputPath("plugin-shell-1152x864.png"),
			fullPage: true,
		});
	});

	test("captures the current plugin shell", async ({ page }, testInfo) => {
		await expect(page.getByTestId("test-harness")).toBeVisible();
		const fxButton = page.getByRole("button", { name: "FX", exact: true });
		await fxButton.click();
		await expect(fxButton).toHaveAttribute("aria-pressed", "true");
		await page.screenshot({
			path: testInfo.outputPath("plugin-shell.png"),
			fullPage: true,
		});
	});

	test("captures the mini keyboard overlay", async ({ page }, testInfo) => {
		await expect(page.getByTestId("test-harness")).toBeVisible();
		await expect(page.getByTestId("mini-keyboard-overlay")).toBeVisible();
		await page.getByRole("button", { name: /Hide Keys/i }).click();
		await page.getByRole("button", { name: /Show Keys/i }).click();
		await expect(page.getByTestId("mini-keyboard-overlay")).toBeVisible();
		await page.screenshot({
			path: testInfo.outputPath("plugin-shell-mini-keyboard.png"),
			fullPage: true,
		});
	});

	test("persists synth shell UI state across reloads", async ({ page }) => {
		await expect(page.getByTestId("test-harness")).toBeVisible();

		const fxButton = page.getByRole("button", { name: "FX", exact: true });
		await fxButton.click();
		await expect(fxButton).toHaveAttribute("aria-pressed", "true");

		const line2EnvButton = page.getByRole("button", { name: "ENV" }).nth(1);
		await line2EnvButton.click();
		await expect(line2EnvButton).toHaveAttribute("aria-pressed", "true");

		await page.getByRole("button", { name: /Hide Keys/i }).click();
		await expect(page.getByTestId("mini-keyboard-overlay")).not.toBeVisible();

		await page.reload({ waitUntil: "domcontentloaded" });
		await waitForBridge(page);

		await expect(fxButton).toHaveAttribute("aria-pressed", "true");
		await expect(line2EnvButton).toHaveAttribute("aria-pressed", "true");
		await expect(page.getByTestId("mini-keyboard-overlay")).not.toBeVisible();
		await expect(
			page.getByRole("button", { name: /Show Keys/i }),
		).toBeVisible();

		await page.getByRole("button", { name: "Main", exact: true }).click();
		await expect(line2EnvButton).toHaveAttribute("aria-pressed", "true");
	});
});
