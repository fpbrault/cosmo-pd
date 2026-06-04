import { expect, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

const LATEST_RELEASE_URL =
	"https://api.github.com/repos/fpbrault/cosmo-pd/releases/latest";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.clear();
		sessionStorage.clear();
	});
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
	await setupPluginPage(page);
});

test.describe("Preset management", () => {
	test("loading a preset does not mark it dirty", async ({ page }) => {
		const presetButton = page.getByRole("button", { name: /^preset /i });
		await presetButton.click();

		await page
			.getByRole("button", { name: "Factory Brass", exact: true })
			.click();

		await expect(presetButton).toContainText("Factory Brass");
		await expect(presetButton).not.toContainText("*");
	});

	test.skip("saves, renames, and deletes a local preset", async ({ page }) => {
		await page.getByRole("button", { name: /^preset /i }).click();

		const pendingModifiedPresetDialog = page
			.locator("dialog")
			.filter({ hasText: "Save modified preset?" });
		if (await pendingModifiedPresetDialog.isVisible()) {
			await pendingModifiedPresetDialog
				.getByRole("button", { name: "Discard" })
				.click();
			await page.getByRole("button", { name: /^preset /i }).click();
		}

		const libraryList = page.getByRole("listbox", { name: "Preset library" });
		const currentStateSection = page
			.locator("section")
			.filter({ has: page.getByRole("heading", { name: "Current State" }) });

		await currentStateSection.getByRole("button", { name: "Save As" }).click();
		const saveAsDialog = page
			.locator("dialog[open]")
			.filter({ has: page.getByRole("heading", { name: "Save preset as" }) });
		await saveAsDialog.getByPlaceholder("New preset name").fill("E2E Patch");
		await saveAsDialog.getByRole("button", { name: "Confirm save as" }).click();

		await expect(
			libraryList.getByRole("button", { name: "E2E Patch", exact: true }),
		).toBeVisible();
		await expect
			.poll(() =>
				page.evaluate(() => localStorage.getItem("cz101-preset-E2E Patch")),
			)
			.not.toBeNull();

		await page.getByRole("button", { name: "Rename E2E Patch" }).click();
		const renameInput = page.locator("dialog[open]").getByRole("textbox");
		await renameInput.fill("Renamed Patch");
		await renameInput.press("Enter");

		await expect(
			libraryList.getByRole("button", { name: "Renamed Patch", exact: true }),
		).toBeVisible();
		await expect
			.poll(() =>
				page.evaluate(() => ({
					original: localStorage.getItem("cz101-preset-E2E Patch"),
					renamed: localStorage.getItem("cz101-preset-Renamed Patch"),
				})),
			)
			.toEqual({ original: null, renamed: expect.any(String) });

		await page.getByRole("button", { name: "Delete Renamed Patch" }).click();
		await page.getByRole("button", { name: "Confirm delete" }).click();
		await expect(
			libraryList.getByRole("button", { name: "Renamed Patch", exact: true }),
		).toHaveCount(0);
		await expect
			.poll(() =>
				page.evaluate(() => localStorage.getItem("cz101-preset-Renamed Patch")),
			)
			.toBeNull();
	});
});
