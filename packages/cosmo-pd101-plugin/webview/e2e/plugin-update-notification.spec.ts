import { expect, type Page, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

const GITHUB_API = "**/api.github.com/repos/fpbrault/cosmo-pd/releases/latest";

async function mockRelease(
	page: Page,
	tag: string,
	overrides?: { prerelease?: boolean; draft?: boolean },
) {
	await page.route(GITHUB_API, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				tag_name: tag,
				html_url: `https://github.com/fpbrault/cosmo-pd/releases/tag/${tag}`,
				prerelease: false,
				draft: false,
				...overrides,
			}),
		});
	});
}

test.describe("UpdateNotification plugin integration (E2E)", () => {
	const BADGE_TEXT = "New Version Available!";

	test("shows update badge in bottom bar when newer version exists", async ({
		page,
	}) => {
		await mockRelease(page, "v99.99.99");
		await setupPluginPage(page);

		const badge = page.getByRole("link", { name: BADGE_TEXT });
		await expect(badge).toBeVisible({ timeout: 10000 });
		await expect(badge).toHaveAttribute(
			"href",
			`https://github.com/fpbrault/cosmo-pd/releases/tag/v99.99.99`,
		);
	});

	test("hides badge when version matches latest release", async ({ page }) => {
		await mockRelease(page, "v0.1.0");
		await setupPluginPage(page);

		const badge = page.getByText(BADGE_TEXT);
		await expect(badge).not.toBeVisible({ timeout: 10000 });
	});

	test("ignores prerelease releases", async ({ page }) => {
		await mockRelease(page, "v99.99.99", { prerelease: true });
		await setupPluginPage(page);

		const badge = page.getByText(BADGE_TEXT);
		await expect(badge).not.toBeVisible({ timeout: 10000 });
	});

	test("screenshot: update badge in full plugin UI", async ({
		page,
	}, testInfo) => {
		await mockRelease(page, "v99.99.99");
		await setupPluginPage(page);

		const badge = page.getByRole("link", { name: BADGE_TEXT });
		await expect(badge).toBeVisible({ timeout: 10000 });

		await page.screenshot({
			path: testInfo.outputPath("plugin-update-notification.png"),
			fullPage: true,
		});
	});
});
