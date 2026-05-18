import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplyModulePresetRequest } from "./modulePresetEvents";
import {
	requestApplyModulePreset,
	subscribeApplyModulePreset,
} from "./modulePresetEvents";

describe("requestApplyModulePreset", () => {
	beforeEach(() => {
		vi.stubGlobal("window", window);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("dispatches CustomEvent with correct type and detail", () => {
		const addEventListenerSpy = vi.spyOn(window, "addEventListener");
		const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

		const request: ApplyModulePresetRequest = {
			module: "chorus",
			preset: "classicWide",
			patch: { rate: 0.5, depth: 0.3 },
		};

		requestApplyModulePreset(request);

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		const event = dispatchEventSpy.mock
			.calls[0][0] as CustomEvent<ApplyModulePresetRequest>;
		expect(event.type).toBe("cz-apply-module-preset");
		expect(event.detail).toEqual(request);

		addEventListenerSpy.mockRestore();
		dispatchEventSpy.mockRestore();
	});

	it("subscriber receives dispatched events", () => {
		const handler = vi.fn();
		const unsubscribe = subscribeApplyModulePreset(handler);

		const request: ApplyModulePresetRequest = {
			module: "delay",
			preset: "tapeEcho",
			patch: { time: 0.5, feedback: 0.3 },
		};

		requestApplyModulePreset(request);

		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith(request);

		unsubscribe();
	});

	it("unsubscribe stops receiving events", () => {
		const handler = vi.fn();
		const unsubscribe = subscribeApplyModulePreset(handler);

		unsubscribe();

		requestApplyModulePreset({
			module: "reverb",
			preset: "plateAir",
			patch: { mix: 0.5 },
		});

		expect(handler).not.toHaveBeenCalled();
	});

	it("subscribe ignores events with null/undefined detail", () => {
		const handler = vi.fn();
		const unsubscribe = subscribeApplyModulePreset(handler);

		window.dispatchEvent(
			new CustomEvent("cz-apply-module-preset", { detail: null }),
		);
		window.dispatchEvent(new CustomEvent("cz-apply-module-preset"));

		expect(handler).not.toHaveBeenCalled();

		unsubscribe();
	});

	it("does nothing when window is undefined", () => {
		vi.stubGlobal("window", undefined);

		const request: ApplyModulePresetRequest = {
			module: "chorus",
			preset: "classicWide",
			patch: { rate: 0.5 },
		};

		expect(() => requestApplyModulePreset(request)).not.toThrow();
	});
});
