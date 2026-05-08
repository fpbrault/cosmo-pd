import { expect, test } from "@playwright/test";
import {
	setupPluginPage,
	waitForMessageMatching,
} from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("Mod matrix route management", () => {
	test("add, adjust, disable, and remove route emits setModMatrix payloads", async ({
		page,
	}) => {
		await page.getByRole("button", { name: /^mod$/i }).click();
		const addRouteButton = page.getByRole("button", { name: /^add route$/i });
		const modMatrixPanel = addRouteButton.locator("xpath=ancestor::section[1]");
		await expect(modMatrixPanel).toBeVisible();

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await addRouteButton.click();
		await expect(
			page.getByRole("button", { name: /close route editor/i }),
		).toBeVisible();
		await page.getByRole("button", { name: /^add\s+(?!route$)/i }).click();
		await waitForMessageMatching(page, (message) => {
			if (message.type !== "invoke" || message.method !== "setModMatrix") {
				return false;
			}
			if (!Array.isArray(message.args) || message.args.length < 1) {
				return false;
			}
			const payload = message.args[0] as {
				routes?: Array<{ source?: string }>;
			};
			return (
				Array.isArray(payload.routes) &&
				payload.routes.some((route) => route?.source === "lfo1")
			);
		});

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await modMatrixPanel
			.getByRole("checkbox", { name: /disable route|enable route/i })
			.first()
			.click({ force: true });
		await waitForMessageMatching(page, (message) => {
			if (message.type !== "invoke" || message.method !== "setModMatrix") {
				return false;
			}
			if (!Array.isArray(message.args) || message.args.length < 1) {
				return false;
			}
			const payload = message.args[0] as {
				routes?: Array<{ enabled?: boolean }>;
			};
			return (
				Array.isArray(payload.routes) &&
				payload.routes.some((route) => route?.enabled === false)
			);
		});
	});
});
