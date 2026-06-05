import { expect, type Page } from "@playwright/test";
import type { MockBridgeMessage } from "../../src/test/mockPluginBridge";

export async function waitForBridge(page: Page): Promise<void> {
	await page.waitForFunction(
		() =>
			typeof window.__MOCK_BRIDGE__ !== "undefined" &&
			typeof (window as Window & { __czOnParams?: (json: string) => void })
				.__czOnParams !== "undefined",
		{ timeout: 5000 },
	);
}

export async function setupPluginPage(
	page: Page,
	{ keyboard = false }: { keyboard?: boolean } = {},
): Promise<void> {
	await page.addInitScript(
		({ keyboardVisible }) => {
			// Keep test state deterministic across retries/workers.
			localStorage.setItem(
				"cosmo-pd101-ui-state",
				JSON.stringify({ state: { keyboardVisible }, version: 0 }),
			);
			localStorage.setItem("cz-plugin-ui-scale", "100");
			sessionStorage.removeItem("cosmo-pd101.update.latestNotified");

			// Clear persisted preset/session state that can asynchronously re-apply
			// params after mount and race test interactions.
			localStorage.removeItem("cz101-current-state");
			localStorage.removeItem("cz101-current-preset-session");
			localStorage.removeItem("cz101-show-library-presets");
			for (const key of Object.keys(localStorage)) {
				if (key.startsWith("cz101-preset-")) {
					localStorage.removeItem(key);
				}
			}
		},
		{ keyboardVisible: keyboard },
	);
	await page.goto("/", { waitUntil: "domcontentloaded" });
	await waitForBridge(page);
	await expect(page.getByText("COSMO").first()).toBeVisible({ timeout: 5000 });
	await page.evaluate(() => {
		// Prime __czOnParams once so outbound sync unlocks deterministically in tests.
		window.__MOCK_BRIDGE__?.pushParamUpdate("volume", 0.8);
		window.__MOCK_BRIDGE__?.clearMessages();
	});
}

export async function getMessages(page: Page): Promise<MockBridgeMessage[]> {
	return page.evaluate(
		() => (window.__MOCK_BRIDGE__?.getMessages() ?? []) as MockBridgeMessage[],
	);
}

export async function waitForMessage(
	page: Page,
	type: MockBridgeMessage["type"],
	stringId?: string,
): Promise<void> {
	await expect
		.poll(
			async () => {
				const messages = await getMessages(page);
				return messages.some(
					(message) =>
						message.type === type &&
						(stringId === undefined || message.stringId === stringId),
				);
			},
			{ timeout: 6000, intervals: [100, 200, 500] },
		)
		.toBe(true);
}

export async function waitForMessageMatching(
	page: Page,
	matcher: (message: MockBridgeMessage) => boolean,
): Promise<void> {
	await expect
		.poll(
			async () => {
				const messages = await getMessages(page);
				return messages.some(matcher);
			},
			{ timeout: 6000, intervals: [100, 200, 500] },
		)
		.toBe(true);
}
