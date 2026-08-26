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
		await expect(page.getByTestId("simple-line-1-section")).toBeVisible();
		await expect(page.getByTestId("simple-line-2-section")).toBeVisible();
		const lineEditor = page.locator(
			'[data-testid="simple-line-editor"][data-line-index="1"]',
		);
		await expect(lineEditor).toBeVisible();
		await expect(
			page.locator('[data-testid="simple-line-editor"][data-line-index="2"]'),
		).toBeVisible();
		await expect(
			lineEditor.getByTestId("simple-algorithm-slot-a"),
		).toBeVisible();
		await expect(
			lineEditor.getByTestId("simple-algorithm-slot-b"),
		).toBeVisible();
		await expect(page.getByTestId("simple-line-select-section")).toBeVisible();
		await expect(page.getByTestId("simple-modulation-section")).toBeVisible();
		await expect(page.getByTestId("simple-voice-section")).toBeVisible();
		await expect(page.getByTestId("simple-detune-section")).toBeVisible();
		await expect(page.getByTestId("simple-voice-rack")).toBeVisible();
		await expect(page.getByText("VOICE", { exact: true })).toBeVisible();
		await expect(page.getByTestId("simple-envelope-dco")).toHaveCount(0);
		await expect(lineEditor.getByText("Volume", { exact: true })).toBeVisible();
		await expect(lineEditor.getByText("DCW", { exact: true })).toBeVisible();
		await expect(lineEditor.getByText("Oct", { exact: true })).toBeVisible();
		await expect(
			lineEditor.getByRole("slider", { name: "Blend" }),
		).toBeVisible();
		await expect(
			lineEditor.getByRole("button", { name: "Edit line 1 algorithm A" }),
		).toHaveCount(1);
		await expect(
			lineEditor.getByRole("button", { name: "Edit line 1 algorithm B" }),
		).toHaveCount(1);
		await expect(
			lineEditor.getByRole("button", {
				name: "Edit line 1 algorithm A controls",
			}),
		).toHaveCount(1);
		await lineEditor
			.getByRole("button", { name: "Edit line 1 algorithm A controls" })
			.click();
		await expect(
			page.getByRole("dialog", {
				name: "Edit line 1 algorithm A controls",
			}),
		).toBeVisible();
		await page.keyboard.press("Escape");
		await lineEditor
			.getByRole("button", { name: "Edit line 1 algorithm A" })
			.click();
		await expect(
			page.getByRole("dialog", { name: "Edit line 1 algorithm A" }),
		).toBeVisible();
		await page.keyboard.press("Escape");
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

	test("edits CZ line routing without conflating the edit target", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "Simple" }).click();
		const lineSelect = page.getByRole("button", { name: /Line Select:/i });
		const ring = page.getByRole("button", { name: "Modulation: Ring" });
		const noise = page.getByRole("button", { name: "Modulation: Noise" });
		const detune = page.getByRole("button", { name: "Detune" });
		await expect(lineSelect).toHaveAccessibleName(/1\+2′/i);
		await expect(detune).toBeEnabled();
		await detune.click();
		await expect(
			page.getByRole("dialog", { name: "Detune" }).getByRole("slider"),
		).toHaveCount(3);
		await page.keyboard.press("Escape");
		await expect(ring).toBeEnabled();
		await ring.click();
		await expect(ring).toHaveAttribute("aria-pressed", "true");
		await ring.click();
		await expect(ring).toHaveAttribute("aria-pressed", "false");
		await lineSelect.click();
		await expect(lineSelect).toHaveAccessibleName(/1\+1′/i);
		await lineSelect.click();
		await expect(lineSelect).toHaveAccessibleName(/Line Select: 1$/i);
		await expect(ring).toBeDisabled();
		await expect(noise).toBeDisabled();
		await expect(detune).toBeDisabled();

		const voiceMode = page.getByRole("button", { name: /Voice: Mono/i });
		await expect(voiceMode).toHaveAttribute("aria-pressed", "false");
		await voiceMode.click();
		await expect(voiceMode).toHaveAttribute("aria-pressed", "true");
		const portamento = page.getByRole("button", {
			name: /Portamento: Off/i,
		});
		await portamento.click();
		await expect(
			page.getByRole("button", { name: /Portamento: On/i }),
		).toHaveAttribute("aria-pressed", "true");
		const timeButton = page.getByRole("button", { name: "Portamento time" });
		await timeButton.click();
		const timePopover = page.getByRole("dialog", { name: "Portamento time" });
		await expect(timePopover).toBeVisible();
		await timePopover
			.getByRole("button", { name: "Portamento time: Time" })
			.click();
		await expect(
			timePopover.getByRole("slider", { name: "Rate" }),
		).toBeVisible();
		await page.keyboard.press("Escape");

		const lineEditor = page.locator(
			'[data-testid="simple-line-editor"][data-line-index="1"]',
		);
		const line2Editor = page.locator(
			'[data-testid="simple-line-editor"][data-line-index="2"]',
		);
		await expect(lineEditor).toBeVisible();
		await expect(line2Editor).toBeVisible();
		await expect(
			lineEditor.getByRole("button", { name: /Edit line 1 algorithm/i }),
		).toHaveCount(2);
		await expect(
			line2Editor.getByRole("button", { name: "Edit line 2 algorithm A" }),
		).toBeDisabled();
		await expect(line2Editor).toHaveAttribute("data-line-index", "2");
		await expect(
			line2Editor.getByTestId("simple-algorithm-slot-a"),
		).toBeVisible();
		await lineSelect.click();
		await expect(lineSelect).toHaveAccessibleName(/Line Select: 2$/i);
		await expect(lineEditor).toBeVisible();
		await expect(line2Editor).toBeVisible();
		await expect(
			lineEditor.getByRole("button", { name: "Edit line 1 algorithm A" }),
		).toBeDisabled();
		await expect(
			line2Editor.getByRole("button", { name: "Edit line 2 algorithm A" }),
		).toBeEnabled();

		const line2AlgoB = line2Editor.getByRole("button", {
			name: "Edit line 2 algorithm B",
		});
		await line2AlgoB.click();
		await page
			.getByRole("dialog", { name: "Edit line 2 algorithm B" })
			.getByRole("button", { name: "Pinch" })
			.click();
		await expect(
			line2Editor.getByRole("slider", { name: "Blend" }),
		).toBeEnabled();
		await line2AlgoB.click();
		await page
			.getByRole("dialog", { name: "Edit line 2 algorithm B" })
			.getByRole("button", { name: "None" })
			.click();
		await expect(
			line2Editor.getByRole("slider", { name: "Blend" }),
		).toHaveCount(0);

		await page.getByRole("button", { name: "Expand Envelope section" }).click();
		await expect(page.getByTestId("simple-envelope-panel")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Edit line 2", exact: true }),
		).toHaveAttribute("aria-pressed", "true");
		await page.getByRole("button", { name: "Expand Sound section" }).click();
		await expect(line2Editor).toHaveAttribute("data-line-index", "2");
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
