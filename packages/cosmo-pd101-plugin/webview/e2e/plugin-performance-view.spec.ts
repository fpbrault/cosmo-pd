import { expect, test } from "@playwright/test";
import { setupPluginPage, waitForBridge } from "./helpers/pluginBridge";

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 1368, height: 912 });
	await setupPluginPage(page, { keyboard: true });
});

test.describe("Simple workspace", () => {
	test("shows the complete simplified performance surface", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		await expect(page.getByTestId("performance-view")).toBeVisible();
		const controls = page.getByTestId("performance-controls");
		await expect(controls).toBeVisible();
		const controlsBox = await controls.boundingBox();
		expect(controlsBox?.height).toBeGreaterThanOrEqual(235);
		expect(controlsBox?.height).toBeLessThanOrEqual(245);
		await expect(page.getByText("Macros", { exact: true })).toBeVisible();
		await expect(page.getByTestId("simple-sound-panel")).toBeVisible();
		await expect(page.getByTestId("simple-routing-controls")).toBeVisible();
		await expect(page.getByTestId("simple-envelope-dco")).toHaveCount(0);
		await expect(page.getByTestId("simple-line-parameters")).toContainText(
			"Volume",
		);
		await expect(page.getByTestId("simple-line-parameters")).toContainText(
			"DCW",
		);
		await expect(page.getByTestId("simple-line-parameters")).toContainText(
			"Tune",
		);
		await expect(page.getByTestId("simple-line-parameters")).toContainText(
			"L2 Detune",
		);
		await expect(page.getByTestId("simple-envelope-summary")).toBeVisible();
		await expect(page.getByTestId("simple-effects-summary")).toBeVisible();
		await page.getByRole("button", { name: "Expand Envelope section" }).click();
		await expect(page.getByTestId("simple-envelope-panel")).toBeVisible();
		await expect(page.getByTestId("simple-envelope-dco")).toBeVisible();
		await expect(page.getByTestId("simple-envelope-dcw")).toBeVisible();
		await expect(page.getByTestId("simple-envelope-dca")).toBeVisible();
		const soundSummaryBox = await page
			.getByTestId("simple-sound-summary")
			.boundingBox();
		const effectsSummaryBox = await page
			.getByTestId("simple-effects-summary")
			.boundingBox();
		expect(soundSummaryBox?.height).toBe(effectsSummaryBox?.height);
		await page.getByRole("button", { name: "Expand Effects section" }).click();
		await expect(
			page.getByTestId("performance-fx-slots").locator(":scope > *"),
		).toHaveCount(6);
		const keyboard = page.getByTestId("mini-keyboard-overlay");
		const resizeHandle = page.getByTestId("simple-keyboard-resize");
		const before = await keyboard.boundingBox();
		const handleBox = await resizeHandle.boundingBox();
		expect(before).not.toBeNull();
		expect(handleBox).not.toBeNull();
		if (before && handleBox) {
			await page.mouse.move(
				handleBox.x + handleBox.width / 2,
				handleBox.y + handleBox.height / 2,
			);
			await page.mouse.down();
			await page.mouse.move(
				handleBox.x + handleBox.width / 2,
				handleBox.y - 48,
			);
			await page.mouse.up();
			const after = await keyboard.boundingBox();
			expect(after?.height).toBeGreaterThan(before.height + 20);
		}
	});

	test("opens detailed effect controls and supports bypass and removal", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		await page.getByRole("button", { name: "Expand Effects section" }).click();
		const slots = page.getByTestId("performance-fx-slots");
		await slots.getByRole("button", { name: /add effect in slot 1/i }).click();
		await page
			.getByRole("dialog", { name: "Select effect type" })
			.getByRole("button", { name: "Vibrato", exact: true })
			.click();
		const power = slots.locator('[role="switch"]').first();
		await expect(power).toHaveAttribute("aria-checked", "true");
		await power.click();
		await expect(power).toHaveAttribute("aria-checked", "false");
		await expect(
			slots.locator('[aria-roledescription="sortable"]'),
		).toHaveCount(0);

		await slots
			.getByRole("button", { name: /^edit /i })
			.first()
			.click();
		const editor = page.getByRole("dialog", { name: /^edit /i });
		await expect(editor).toBeVisible();
		await editor.getByRole("button", { name: /^remove /i }).click();
		await expect(
			page.getByRole("button", { name: /add effect in slot 1/i }),
		).toBeVisible();
	});

	test("edits compact line routing without conflating the edit target", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		await page.getByRole("button", { name: /line select:/i }).click();
		await page
			.getByRole("dialog", { name: "Line Select" })
			.getByRole("button", { name: "L1", exact: true })
			.click();

		await page.getByRole("button", { name: /line mod:/i }).click();
		const modPicker = page.getByRole("dialog", { name: "Line Mod" });
		await expect(
			modPicker.getByRole("button", { name: "Ring" }),
		).toBeDisabled();
		await expect(
			modPicker.getByRole("button", { name: "Noise" }),
		).toBeDisabled();
		await page.keyboard.press("Escape");

		await expect(
			page.getByRole("button", { name: "Edit line 2" }),
		).toBeDisabled();
		await expect(
			page.getByRole("button", { name: "Edit line 1" }),
		).toHaveAttribute("aria-pressed", "true");

		await page.getByRole("button", { name: /line select:/i }).click();
		await page
			.getByRole("dialog", { name: "Line Select" })
			.getByRole("button", { name: "L2", exact: true })
			.click();
		await expect(
			page.getByRole("button", { name: "Edit line 1" }),
		).toBeDisabled();
		await expect(
			page.getByRole("button", { name: "Edit line 2" }),
		).toHaveAttribute("aria-pressed", "true");

		await page.getByRole("button", { name: "Expand Envelope section" }).click();
		await expect(page.getByTestId("simple-envelope-panel")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Edit line 2" }),
		).toHaveAttribute("aria-pressed", "true");
		await page.getByRole("button", { name: "Expand Sound section" }).click();
		await expect(
			page.getByRole("button", { name: "Edit line 2" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	test("toggles its display and persists independently from Advanced", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		const waveHistoryTab = page.getByRole("tab", {
			name: "Wave History",
			exact: true,
		});
		await waveHistoryTab.click();
		await expect(waveHistoryTab).toHaveAttribute("aria-selected", "true");
		await expect(page.getByLabel("Audio visualization")).toBeVisible();
		const palette = page.getByRole("button", {
			name: "Toggle scope color theme",
		});
		await expect(palette).toHaveText("Vintage");
		await palette.click();
		await expect(palette).toHaveText("Amber");

		await page.reload({ waitUntil: "domcontentloaded" });
		await waitForBridge(page);
		await expect(page.getByTestId("performance-view")).toBeVisible();
		await expect(
			page.getByRole("tab", { name: "Wave History", exact: true }),
		).toHaveAttribute("aria-selected", "true");
		await expect(page.getByLabel("Audio visualization")).toBeVisible();

		await page.getByRole("button", { name: "Advanced" }).click();
		await expect(page.getByTestId("performance-view")).toHaveCount(0);
		await expect(
			page.getByRole("button", { name: "Main", exact: true }),
		).toBeVisible();
	});
});
