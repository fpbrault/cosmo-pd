import { expect, type Page, test } from "@playwright/test";
import { setupPluginPage } from "./helpers/pluginBridge";

async function revealMainVolumeValueBubble(page: Page) {
	const knob = page.getByRole("spinbutton", { name: "Main Volume" });
	await expect(knob).toBeVisible();
	await knob.hover();
	return page.getByRole("button", { name: "Main Volume value" });
}

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("Host to UI inbound updates", () => {
	test("batched MIDI CC delivery preserves event order", async ({ page }) => {
		const received = await page.evaluate(async () => {
			const events: number[] = [];
			return await new Promise<number[]>((resolve) => {
				const handler = (event: Event) => {
					events.push((event as CustomEvent).detail.rawValue);
					if (events.length === 3) {
						window.removeEventListener("cz-midi-cc", handler);
						resolve(events);
					}
				};
				window.addEventListener("cz-midi-cc", handler);
				window.__czOnMidiCcBatch?.([
					[0, 74, 10],
					[0, 74, 80],
					[0, 74, 20],
				]);
			});
		});

		expect(received).toEqual([10, 80, 20]);
	});

	test("pushParamUpdate drives volume display to the pushed value", async ({
		page,
	}) => {
		await page.evaluate(() => window.__MOCK_BRIDGE__?.pushParamUpdate(0, 0.6));

		await expect(await revealMainVolumeValueBubble(page)).toHaveText("60%", {
			timeout: 2000,
		});
	});

	test("debug panel DSP state reflects pushed param update", async ({
		page,
	}) => {
		const panel = page.getByTestId("debug-panel");
		if (!(await panel.isVisible())) {
			await page.getByTestId("debug-panel-toggle").click();
		}

		await page.evaluate(() => window.__MOCK_BRIDGE__?.pushParamUpdate(0, 0.42));

		const dspState = page.getByTestId("debug-dsp-state");
		await expect(dspState).toContainText("id:volume", { timeout: 2000 });
	});

	test("pushPluginParamUpdate through mock host path updates the volume display", async ({
		page,
	}) => {
		await page.evaluate(() =>
			window.__MOCK_BRIDGE__?.pushPluginParamUpdate({
				volume: [0.33, 0.33, "33%"],
			}),
		);

		await expect(await revealMainVolumeValueBubble(page)).toHaveText("33%", {
			timeout: 2000,
		});
	});
});
