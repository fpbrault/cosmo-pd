import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Page, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

const e2eDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = path.resolve(e2eDir, "../../../..");
const rootPackageJson = JSON.parse(
	fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
) as { version?: string };
const CURRENT_VERSION = rootPackageJson.version ?? "0.0.0";

async function mockRelease(
	page: Page,
	tag: string,
	overrides?: { prerelease?: boolean; draft?: boolean },
) {
	await page.addInitScript(
		({ release }) => {
			window.__CZ_TEST_LATEST_RELEASE__ = release;
		},
		{
			release: {
				tag_name: tag,
				html_url: `https://github.com/fpbrault/cosmo-pd/releases/tag/${tag}`,
				prerelease: false,
				draft: false,
				...overrides,
			},
		},
	);
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
		await mockRelease(page, `v${CURRENT_VERSION}`);
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
