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
		// Delay addModule on each AudioContext instance so the worklet stays loading
		// long enough for the overlay to render and be interacted with. Patching the
		// instance (not AudioWorklet.prototype) is necessary because window.AudioWorklet
		// is not exposed as a standalone constructor in Chrome.
		await page.addInitScript(() => {
			localStorage.setItem(
				"cz101.factory-presets.onboarding.v1",
				JSON.stringify("declined"),
			);

			const NativeAudioContext = window.AudioContext;
			const audioContexts: AudioContext[] = [];

			window.AudioContext = class TrackingAudioContext extends NativeAudioContext {
				constructor(options?: AudioContextOptions) {
					super(options);

					const origAddModule = this.audioWorklet.addModule.bind(
						this.audioWorklet,
					);
					this.audioWorklet.addModule = async (
						moduleURL,
						moduleOptions,
					) => {
						await new Promise((resolve) => setTimeout(resolve, 5_000));
						return origAddModule(moduleURL, moduleOptions);
					};

					audioContexts.push(this);
					window.__cosmoAudioContexts = audioContexts;
				}
			} as typeof AudioContext;
		});

		await page.goto("/lab", { waitUntil: "domcontentloaded" });

		// The overlay must appear while the engine is initialising (audioContextState
		// is null until a statechange fires, which is delayed because addModule is slow).
		const startAudioButton = page.getByRole("button", { name: "Start Audio" });
		await expect(startAudioButton).toBeVisible({ timeout: 30_000 });

		// Click the overlay button.
		await startAudioButton.click();

		// The overlay must disappear immediately on click (resumeAudio syncs
		// audioContextState to React even while the worklet is still loading).
		await expect(startAudioButton).toBeHidden({ timeout: 5_000 });

		// The AudioContext must also reach running state.
		await expect
			.poll(
				() =>
					page.evaluate(() =>
						(window.__cosmoAudioContexts ?? [])
							.filter((c) => c.state !== "closed")
							.map((c) => c.state),
					),
				{
					message:
						"AudioContext should reach 'running' after the prompt is clicked",
					timeout: 10_000,
				},
			)
			.toContain("running");
	});
});
