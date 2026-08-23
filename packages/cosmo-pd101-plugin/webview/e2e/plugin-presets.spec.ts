import { expect, test } from "@playwright/test";
import {
	setupPluginPage,
	waitForMessageMatching,
} from "./helpers/pluginBridge";

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
		const presetScreen = page.getByRole("button", {
			name: /Choose preset\. Current preset:/i,
		});
		await presetScreen.click();

		await page.getByRole("option", { name: /Factory Brass/ }).click();

		await expect(presetScreen).toContainText("Factory Brass");
		await expect(presetScreen).toContainText("Cosmo Factory Library · Factory");
		await expect(presetScreen).not.toContainText("*");
		await expect(
			page.getByRole("img", { name: "Featured preset" }),
		).toBeVisible();

		await page.getByRole("button", { name: "Favorite Factory Brass" }).click();
		await expect(
			page.getByRole("button", { name: "Unfavorite Factory Brass" }),
		).toBeVisible();
	});

	test("persists a user preset description and finds it in search", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Open library" }).click();

		const currentStateSection = page
			.locator("section")
			.filter({ has: page.getByRole("heading", { name: "Current State" }) });
		await currentStateSection.getByRole("button", { name: "Save As" }).click();

		const saveAsDialog = page
			.locator("dialog[open]")
			.filter({ has: page.getByRole("heading", { name: "Save preset as" }) });
		await saveAsDialog
			.getByPlaceholder("New preset name")
			.fill("E2E Description Patch");
		await saveAsDialog.getByRole("button", { name: "Confirm save as" }).click();

		const presetRow = page.getByRole("button", {
			name: "E2E Description Patch",
			exact: true,
		});
		await expect(presetRow).toBeVisible();
		await presetRow.click();

		const description = page.getByPlaceholder("Describe this preset");
		await description.fill("Glassy motion with a slow evolving tail");
		await description.blur();

		const search = page.getByPlaceholder("Search presets");
		await search.fill("slow evolving tail");
		await expect(presetRow).toBeVisible();
	});

	test("saves, renames, and deletes a local preset", async ({ page }) => {
		await page.getByRole("button", { name: "Open library" }).click();

		const pendingModifiedPresetDialog = page
			.locator("dialog")
			.filter({ hasText: "Save modified preset?" });
		if (await pendingModifiedPresetDialog.isVisible()) {
			await pendingModifiedPresetDialog
				.getByRole("button", { name: "Discard" })
				.click();
			await page.getByRole("button", { name: "Open library" }).click();
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

		const savedPreset = libraryList.getByRole("button", {
			name: "E2E Patch",
			exact: true,
		});
		await expect(savedPreset).toBeVisible();
		await waitForMessageMatching(page, (message) => {
			const payload = Array.isArray(message.args) ? message.args[0] : null;
			return (
				message.type === "invoke" &&
				message.method === "savePreset" &&
				typeof payload === "object" &&
				payload !== null &&
				"name" in payload &&
				payload.name === "E2E Patch"
			);
		});
		await savedPreset.click();

		const renameInput = page.getByPlaceholder("Preset name", { exact: true });
		await renameInput.fill("Renamed Patch");
		await renameInput.press("Enter");

		const renamedPreset = libraryList.getByRole("button", {
			name: "Renamed Patch",
			exact: true,
		});
		await expect(renamedPreset).toBeVisible();
		await renamedPreset.click();

		const deleteButton = page.getByRole("button", {
			name: "Delete",
			exact: true,
		});
		await deleteButton.scrollIntoViewIfNeeded();
		await deleteButton.click();
		await expect(
			libraryList.getByRole("button", { name: "Renamed Patch", exact: true }),
		).toHaveCount(0);
	});
});

test.describe("Preset quick select touch", () => {
	test.use({ hasTouch: true, viewport: { width: 1024, height: 768 } });

	test("opens and loads with one-tap targets without focusing search", async ({
		page,
	}) => {
		const presetScreen = page.getByRole("button", {
			name: /Choose preset\. Current preset:/i,
		});
		await presetScreen.tap();

		const search = page
			.getByRole("dialog", { name: "Quick preset select" })
			.getByPlaceholder("Search presets");
		await expect(search).toBeVisible();
		await expect(search).not.toBeFocused();

		await page.getByRole("option", { name: /Factory Brass/ }).tap();
		await expect(presetScreen).toContainText("Factory Brass");
	});
});
