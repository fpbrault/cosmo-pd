import { afterEach, describe, expect, it, vi } from "vitest";
import { attachResumeOnUserGesture } from "./useAudioEngine";

type MockContext = {
	state: AudioContextState;
	resume: ReturnType<typeof vi.fn<[], Promise<void>>>;
};

describe("attachResumeOnUserGesture", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("resumes context and removes listeners after first successful gesture", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				ctx.state = "running";
			}),
		};

		attachResumeOnUserGesture(ctx);

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).toHaveBeenCalledTimes(1);

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).toHaveBeenCalledTimes(1);
	});

	it("stops listening when cleanup is called", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				ctx.state = "running";
			}),
		};

		const cleanup = attachResumeOnUserGesture(ctx);
		cleanup();

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).not.toHaveBeenCalled();
	});
});
