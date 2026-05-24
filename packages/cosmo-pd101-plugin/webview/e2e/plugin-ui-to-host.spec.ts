import { expect, type Page, test } from "@playwright/test";
import {
	getMessages,
	setupPluginPage,
	waitForMessage,
} from "./helpers/pluginBridge";

async function revealMainVolumeValueBubble(page: Page) {
	const knob = page.getByRole("spinbutton", { name: "Main Volume" });
	await expect(knob).toBeVisible();
	await knob.hover();
	return page.getByRole("button", { name: "Main Volume value" });
}

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("UI to host outbound messages", () => {
	test("changing Line 1 algo records a param:set message for l1_warp_algo", async ({
		page,
	}) => {
		const algoPicker = page
			.getByRole("button", { name: /algorithm \d+:/i })
			.first();
		await expect(algoPicker).toBeVisible();
		await algoPicker.click();

		const bendAlgoButton = page
			.getByRole("button", { name: /^bend$/i })
			.first();
		await expect(bendAlgoButton).toBeVisible();
		await bendAlgoButton.click();

		await waitForMessage(page, "param:set", "l1_warp_algo");

		const messages = await getMessages(page);
		const paramSetMessage = messages.find(
			(message) =>
				message.type === "param:set" && message.stringId === "l1_warp_algo",
		);
		expect(paramSetMessage).toBeDefined();
		expect(typeof paramSetMessage?.value).toBe("number");
	});

	test("dragging DCW Amt records a param:set message for l1_dcw_base", async ({
		page,
	}) => {
		const dcwAmtKnob = page
			.getByRole("spinbutton", { name: /dcw amt/i })
			.first();
		await expect(dcwAmtKnob).toBeVisible();

		await dcwAmtKnob.focus();
		await dcwAmtKnob.press("ArrowUp");

		await waitForMessage(page, "param:set", "l1_dcw_base");
	});

	test("editing the Volume display value records begin/set/end sequence", async ({
		page,
	}) => {
		const debugPanel = page.getByTestId("debug-panel");
		if (await debugPanel.isVisible()) {
			await page.getByTestId("debug-panel-toggle").click();
			await expect(debugPanel).not.toBeVisible();
		}

		await page.evaluate(() => window.__MOCK_BRIDGE__?.pushParamUpdate(0, 0.8));
		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());

		const displayButton = await revealMainVolumeValueBubble(page);
		await expect(displayButton).toBeVisible();
		await displayButton.dblclick();

		const editInput = page.getByRole("textbox", { name: "Main Volume value" });
		await expect(editInput).toBeVisible();
		await editInput.fill("0.5");
		await editInput.press("Enter");

		await waitForMessage(page, "param:set", "volume");

		const messages = await getMessages(page);
		const types = messages.map((message) => message.type);
		expect(types).toContain("param:begin");
		expect(types).toContain("param:set");
		expect(types).toContain("param:end");

		const volumeMessages = messages.filter(
			(message) => message.stringId === "volume",
		);
		expect(volumeMessages.length).toBeGreaterThanOrEqual(3);
	});
});
