import { expect, type Page, test } from "@playwright/test";
import {
	setupPluginPage,
	waitForMessageMatching,
} from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

async function expectAddRouteForDestination(
	page: Page,
	options: {
		controlName: RegExp;
		modulationButtonName: RegExp;
		dialogName: RegExp;
		expectedDestination: string;
		beforeAdd?: () => Promise<void>;
	},
): Promise<void> {
	await options.beforeAdd?.();

	const control = page.getByRole("spinbutton", { name: options.controlName });
	await expect(control.first()).toBeVisible();
	await control.first().hover();

	const modulationButton = page.getByRole("button", {
		name: options.modulationButtonName,
	});
	await expect(modulationButton.first()).toBeVisible();

	await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
	await modulationButton.first().click();

	const modulationMenu = page.getByRole("dialog", {
		name: options.dialogName,
	});
	await expect(modulationMenu.first()).toBeVisible();
	await modulationMenu.first().getByRole("button", { name: /^add$/i }).click();

	await waitForMessageMatching(page, (message) => {
		if (message.type !== "invoke" || message.method !== "setModMatrix") {
			return false;
		}
		if (!Array.isArray(message.args) || message.args.length < 1) {
			return false;
		}
		const payload = message.args[0];
		if (payload === null || typeof payload !== "object") {
			return false;
		}
		const routes = (payload as { routes?: unknown[] }).routes;
		if (!Array.isArray(routes) || routes.length < 1) {
			return false;
		}
		const firstRoute = routes[0];
		if (firstRoute === null || typeof firstRoute !== "object") {
			return false;
		}
		const route = firstRoute as {
			source?: unknown;
			destination?: unknown;
			enabled?: unknown;
		};
		return (
			route.source === "lfo1" &&
			route.destination === options.expectedDestination &&
			route.enabled === true
		);
	});
}

test.describe("Mod matrix plugin bridge", () => {
	test("adding a mod route should invoke setModMatrix", async ({ page }) => {
		await expectAddRouteForDestination(page, {
			controlName: /^main volume$/i,
			modulationButtonName: /modulation for main volume/i,
			dialogName: /modulation for main volume/i,
			expectedDestination: "volume",
		});
	});

	test("adding a route from an algo control should target line 1 algo params", async ({
		page,
	}) => {
		await expectAddRouteForDestination(page, {
			controlName: /^curve$/i,
			modulationButtonName: /modulation for curve/i,
			dialogName: /modulation for curve/i,
			expectedDestination: "line1AlgoParam1",
			beforeAdd: async () => {
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
			},
		});
	});

	test("adding a route from a main line parameter should target line 1 DCW", async ({
		page,
	}) => {
		await expectAddRouteForDestination(page, {
			controlName: /^dcw amt$/i,
			modulationButtonName: /modulation for dcw amt/i,
			dialogName: /modulation for dcw amt/i,
			expectedDestination: "line1DcwBase",
		});
	});

	test("adding a route from an FX param should target the FX modulation destination", async ({
		page,
	}) => {
		await expectAddRouteForDestination(page, {
			controlName: /^mix$/i,
			modulationButtonName: /modulation for mix/i,
			dialogName: /modulation for mix/i,
			expectedDestination: "chorusMix",
			beforeAdd: async () => {
				await page.getByRole("button", { name: /^fx$/i }).click();
				const addEffectButton = page
					.getByRole("button", { name: /add effect to slot/i })
					.first();
				await expect(addEffectButton).toBeVisible();
				await addEffectButton.click();

				const selector = page.getByRole("dialog", {
					name: /select effect type/i,
				});
				await expect(selector).toBeVisible();
				await selector.getByRole("button", { name: /^chorus$/i }).click();
			},
		});
	});
});
