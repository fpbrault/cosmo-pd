import { expect, test } from "@playwright/test";
import {
	setupPluginPage,
	waitForMessageMatching,
} from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("Mod matrix route management", () => {
	test("assign, adjust, and clear a route emits setModMatrix payloads", async ({
		page,
	}) => {
		await page.getByRole("button", { name: /^mod$/i }).click();
		const modMatrixPanel = page
			.getByText("Mod Matrix", { exact: true })
			.locator("xpath=ancestor::section[1]");
		await expect(modMatrixPanel).toBeVisible();

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await modMatrixPanel
			.getByRole("button", { name: "Choose source for row 1" })
			.click();
		await modMatrixPanel
			.getByRole("button", { name: "LFO 1", exact: true })
			.click();
		await modMatrixPanel
			.getByRole("button", { name: "Choose destination for column 1" })
			.click();
		await modMatrixPanel.getByRole("button", { name: /^Global/ }).click();
		await modMatrixPanel
			.getByRole("button", { name: "Volume", exact: true })
			.click();
		const cell = modMatrixPanel.getByRole("button", {
			name: "LFO 1 to Volume modulation cell",
		});
		await expect(cell).toBeVisible();
		await cell.click();
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
		const box = await cell.boundingBox();
		expect(box).not.toBeNull();
		if (!box) {
			return;
		}
		await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.75);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.25);
		await page.mouse.up();
		await waitForMessageMatching(page, (message) => {
			if (message.type !== "invoke" || message.method !== "setModMatrix") {
				return false;
			}
			if (!Array.isArray(message.args) || message.args.length < 1) {
				return false;
			}
			const payload = message.args[0] as {
				routes?: Array<{ amount?: number }>;
			};
			return (
				Array.isArray(payload.routes) &&
				payload.routes.some((route) => Math.abs(route?.amount ?? 0) > 0.1)
			);
		});

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await cell.dblclick();
		await waitForMessageMatching(page, (message) => {
			if (message.type !== "invoke") {
				return false;
			}
			if (!Array.isArray(message.args) || message.args.length < 1) {
				return false;
			}
			if (message.method === "setModMatrix") {
				const payload = message.args[0] as { routes?: unknown[] };
				return Array.isArray(payload.routes) && payload.routes.length === 0;
			}
			if (message.method === "setParams") {
				const payload = message.args[0] as {
					modMatrix?: { routes?: unknown[] };
				};
				return (
					Array.isArray(payload.modMatrix?.routes) &&
					payload.modMatrix.routes.length === 0
				);
			}
			return false;
		});
	});
});
