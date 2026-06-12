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
		const presetButton = page.getByRole("button", { name: /^preset /i });
		await presetButton.click();

		await page
			.getByRole("button", { name: "Factory Brass", exact: true })
			.click();

		await expect(presetButton).toContainText("Factory Brass");
		await expect(presetButton).not.toContainText("*");
	});

	test("persists a user preset description and finds it in search", async ({
		page,
	}) => {
		await page.getByRole("button", { name: /^preset /i }).click();

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

		const renameInput = page.getByPlaceholder("Preset name");
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
