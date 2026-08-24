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
		expect(controlsBox?.height).toBeGreaterThanOrEqual(187);
		expect(controlsBox?.height).toBeLessThanOrEqual(197);
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
		await page
			.getByRole("button", { name: "Edit Line 1 DCW envelope" })
			.click();
		const envelopeEditor = page.getByRole("dialog", {
			name: "Edit Line 1 DCW envelope",
		});
		await expect(envelopeEditor).toBeVisible();
		await expect(
			envelopeEditor.getByText("Line 1 DCW", { exact: true }),
		).toBeVisible();
		await expect(
			envelopeEditor.getByRole("button", { name: /envelope presets/i }),
		).toBeVisible();
		await expect(
			envelopeEditor.getByText("Key Follow", { exact: true }),
		).toBeVisible();
		await expect(
			envelopeEditor.getByText("Loop", { exact: true }),
		).toBeVisible();
		await page.getByText("Macros", { exact: true }).click();
		await expect(envelopeEditor).toBeVisible();
		await envelopeEditor
			.getByRole("button", { name: "Close Line 1 DCW envelope editor" })
			.click();
		await expect(envelopeEditor).toBeHidden();

		await page.getByRole("button", { name: /DCO envelope preset:/i }).click();
		await expect(
			page.getByRole("listbox", { name: "DCO envelope presets" }),
		).toBeVisible();
		await page.keyboard.press("Escape");

		const soundSummaryBox = await page
			.getByTestId("simple-sound-summary")
			.boundingBox();
		expect(
			await page
				.getByTestId("simple-sound-summary")
				.locator("fieldset")
				.count(),
		).toBe(2);
		const effectsSummaryBox = await page
			.getByTestId("simple-effects-summary")
			.boundingBox();
		expect(soundSummaryBox?.height).toBe(effectsSummaryBox?.height);
		await page.getByRole("button", { name: "Expand Effects section" }).click();
		await expect(
			page.getByTestId("simple-envelope-summary").locator("canvas"),
		).toHaveCount(3);
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

		const settingsButton = slots
			.getByRole("button", { name: /^edit /i })
			.first();
		await settingsButton.click();
		const editor = page.getByRole("dialog", { name: /^edit /i });
		await expect(editor).toBeVisible();
		await expect(settingsButton).toHaveAttribute("aria-expanded", "true");
		await expect(settingsButton).toHaveClass(/text-cz-light-blue/);
		await settingsButton.click();
		await expect(editor).toBeHidden();
		await expect(settingsButton).toHaveAttribute("aria-expanded", "false");
		await settingsButton.click();
		await expect(editor).toBeVisible();
		await page.getByText("Macros", { exact: true }).click();
		await expect(editor).toBeVisible();
		await editor.getByRole("button", { name: /^close .* editor$/i }).click();
		await expect(editor).toBeHidden();
		await settingsButton.click();
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
			page.getByRole("button", {
				name: "Edit line 1 algorithm A",
				exact: true,
			}),
		).toHaveAttribute("aria-pressed", "true");
		await expect(
			page.getByRole("button", {
				name: "Edit line 2 algorithm A",
				exact: true,
			}),
		).toBeEnabled();
		await page
			.getByRole("button", {
				name: "Edit line 1 algorithm B",
				exact: true,
			})
			.click();
		await expect(
			page.getByText("Algorithm B is currently inactive at the current blend."),
		).toBeVisible();
		await page
			.getByRole("button", {
				name: "Edit line 2 algorithm A",
				exact: true,
			})
			.click();
		await expect(
			page.getByText("Line 2 is currently inactive in L1 mode."),
		).toBeVisible();
		await page
			.getByRole("button", {
				name: "Edit line 1 algorithm A",
				exact: true,
			})
			.click();

		await page.getByRole("button", { name: /line select:/i }).click();
		await page
			.getByRole("dialog", { name: "Line Select" })
			.getByRole("button", { name: "L2", exact: true })
			.click();
		await expect(
			page.getByRole("button", {
				name: "Edit line 2 algorithm A",
				exact: true,
			}),
		).toHaveAttribute("aria-pressed", "true");
		await expect(
			page.getByRole("button", {
				name: "Edit line 1 algorithm A",
				exact: true,
			}),
		).toBeEnabled();

		await page.getByRole("button", { name: "Expand Envelope section" }).click();
		await expect(page.getByTestId("simple-envelope-panel")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Edit line 2", exact: true }),
		).toHaveAttribute("aria-pressed", "true");
		await page.getByRole("button", { name: "Expand Sound section" }).click();
		await expect(
			page.getByRole("button", {
				name: "Edit line 2 algorithm A",
				exact: true,
			}),
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
