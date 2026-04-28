import { expect, test } from "@playwright/test";

declare global {
	interface Window {
		__cosmoAudioContexts?: AudioContext[];
	}
}

test.describe("/lab audio startup", () => {
	test("starts audio from the floating prompt on a fresh direct /lab tab", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				"cz101.factory-presets.onboarding.v1",
				JSON.stringify("declined"),
			);

			const NativeAudioContext = window.AudioContext;
			const audioContexts: AudioContext[] = [];

			window.AudioContext =
				class TrackingAudioContext extends NativeAudioContext {
					constructor(options?: AudioContextOptions) {
						super(options);

						const originalAddModule = this.audioWorklet.addModule.bind(
							this.audioWorklet,
						);
						this.audioWorklet.addModule = async (
							moduleURL: string | URL,
							moduleOptions?: WorkletOptions,
						) => {
							await new Promise((resolve) => setTimeout(resolve, 5_000));
							return originalAddModule(moduleURL, moduleOptions);
						};

						audioContexts.push(this);
						window.__cosmoAudioContexts = audioContexts;
					}
				} as typeof AudioContext;
		});

		await page.goto("/lab", { waitUntil: "domcontentloaded" });

		const startAudioButton = page.getByRole("button", { name: "Start Audio" });
		await expect(startAudioButton).toBeVisible({ timeout: 30_000 });

		const startAudioButtonBox = await startAudioButton.boundingBox();
		if (!startAudioButtonBox) {
			throw new Error("Start Audio button is visible but has no bounding box");
		}

		await page.mouse.click(
			startAudioButtonBox.x + startAudioButtonBox.width / 2,
			startAudioButtonBox.y + startAudioButtonBox.height / 2,
		);

		await expect
			.poll(
				async () =>
					page.evaluate(() =>
						(window.__cosmoAudioContexts ?? []).map((ctx) => ctx.state),
					),
				{
					message: "expected the manual start button to resume AudioContext",
					timeout: 10_000,
				},
			)
			.toContain("running");

		await expect(startAudioButton).toBeHidden();
	});
});
