import { expect, type Locator, type Page, test } from "@playwright/test";
import {
	setupPluginPage,
	waitForMessageMatching,
} from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await setupPluginPage(page);
});

test.describe("Algo controls plugin bridge", () => {
	const setLineAlgoToBend = async (page: Page, line: 1 | 2) => {
		const algoStateKey = line === 1 ? "warpAAlgo" : "warpBAlgo";
		await page.evaluate(
			({ targetLine }) => {
				window.__testSetAlgo?.(targetLine, "bend");
			},
			{ targetLine: line },
		);
		await expect
			.poll(() =>
				page.evaluate(({ stateKey }) => window.__testGetParam?.(stateKey), {
					stateKey: algoStateKey,
				}),
			)
			.toBe("bend");
	};

	const dragCurveKnobUp = async (page: Page, curveKnob: Locator) => {
		await curveKnob.focus();
		await curveKnob.press("Home");

		const box = await curveKnob.boundingBox();
		if (!box) throw new Error("Algo Curve knob not found in layout");

		const cx = box.x + box.width / 2;
		const cy = box.y + box.height / 2;
		await page.mouse.move(cx, cy);
		await page.mouse.down();
		await page.mouse.move(cx, cy - 120, { steps: 12 });
		await page.mouse.up();
	};

	test("Line 1 Algo A and Algo B knob edits should invoke setAlgoControls for bend controls", async ({
		page,
	}) => {
		await setLineAlgoToBend(page, 1);

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());

		const curveKnobA = page
			.getByRole("spinbutton", { name: /^curve$/i })
			.first();
		await expect(curveKnobA).toBeVisible();
		await curveKnobA.press("ArrowUp");

		await waitForMessageMatching(
			page,
			(message) =>
				message.type === "invoke" &&
				message.method === "setAlgoControls" &&
				Array.isArray(message.args) &&
				message.args[0] === 1 &&
				message.args[1] === "a" &&
				Array.isArray(message.args[2]) &&
				message.args[2].some(
					(control: { id?: string; value?: number }) =>
						control.id === "bendCurve" && typeof control.value === "number",
				),
		);

		const blendKnob = page
			.getByRole("spinbutton", { name: /^blend$/i })
			.first();
		await expect(blendKnob).toBeVisible();
		await blendKnob.press("ArrowUp");

		const nextAlgoButtonB = page
			.getByRole("button", { name: /^next algorithm$/i })
			.nth(1);
		await expect(nextAlgoButtonB).toBeVisible();
		await nextAlgoButtonB.click({ force: true });

		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());

		const curveKnobB = page
			.getByRole("spinbutton", { name: /^curve$/i })
			.first();
		await expect(curveKnobB).toBeVisible();
		await curveKnobB.press("ArrowUp");

		await waitForMessageMatching(
			page,
			(message) =>
				message.type === "invoke" &&
				message.method === "setAlgoControls" &&
				Array.isArray(message.args) &&
				message.args[0] === 1 &&
				(message.args[1] === "a" || message.args[1] === "b") &&
				Array.isArray(message.args[2]) &&
				message.args[2].some(
					(control: { id?: string; value?: number }) =>
						control.id === "bendCurve" && typeof control.value === "number",
				),
		);
	});

	test("hovering an algo control knob should update the bottom info bar", async ({
		page,
	}) => {
		await setLineAlgoToBend(page, 1);

		const curveKnob = page.getByRole("spinbutton", { name: /^curve$/i });
		await expect(curveKnob).toBeVisible();
		await curveKnob.hover();

		await expect(
			page.getByText(
				/changes how aggressively the phase bends along the curve/i,
			),
		).toBeVisible();
	});

	test("Line 1 algo control knob edits should invoke setAlgoControls with line 1", async ({
		page,
	}) => {
		await setLineAlgoToBend(page, 1);

		const curveKnob = page
			.getByRole("spinbutton", { name: /^curve$/i })
			.first();
		await expect(curveKnob).toBeVisible();
		await dragCurveKnobUp(page, curveKnob);
		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await dragCurveKnobUp(page, curveKnob);

		await waitForMessageMatching(
			page,
			(message) =>
				message.type === "invoke" &&
				message.method === "setAlgoControls" &&
				Array.isArray(message.args) &&
				message.args[0] === 1,
		);
	});

	test("Line 2 algo control knob edits should invoke setAlgoControls with line 2", async ({
		page,
	}) => {
		await page
			.getByRole("button", { name: /wave\s*form/i })
			.nth(2)
			.click();
		await setLineAlgoToBend(page, 2);

		const curveKnob = page
			.getByRole("spinbutton", { name: /^curve$/i })
			.first();
		await expect(curveKnob).toBeVisible();
		await dragCurveKnobUp(page, curveKnob);
		await page.evaluate(() => window.__MOCK_BRIDGE__?.clearMessages());
		await dragCurveKnobUp(page, curveKnob);

		await waitForMessageMatching(
			page,
			(message) =>
				message.type === "invoke" &&
				message.method === "setAlgoControls" &&
				Array.isArray(message.args) &&
				message.args[0] === 2,
		);
	});
});
