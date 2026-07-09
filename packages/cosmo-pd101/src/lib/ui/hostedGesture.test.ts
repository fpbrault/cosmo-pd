import { afterEach, describe, expect, it } from "vitest";
import {
	hasGestureExceededSlop,
	isAuv3HostedRuntime,
	isMostlyVerticalGesture,
} from "./hostedGesture";

const hostWindow = window as Window & {
	__czHostPlatform?: "ios" | "macos";
	__czAuv3FitMode?: "fit-bounds" | "fit-width";
};

afterEach(() => {
	delete hostWindow.__czHostPlatform;
	delete window.__czRuntimeMode;
	delete hostWindow.__czAuv3FitMode;
});

describe("hostedGesture", () => {
	it("only identifies the iOS hosted AUv3 runtime", () => {
		hostWindow.__czHostPlatform = "ios";
		window.__czRuntimeMode = "auv3-hosted";
		hostWindow.__czAuv3FitMode = "fit-width";
		expect(isAuv3HostedRuntime()).toBe(true);

		window.__czRuntimeMode = "standalone";
		hostWindow.__czAuv3FitMode = "fit-bounds";
		expect(isAuv3HostedRuntime()).toBe(false);

		hostWindow.__czHostPlatform = "macos";
		window.__czRuntimeMode = "auv3-hosted";
		hostWindow.__czAuv3FitMode = "fit-width";
		expect(isAuv3HostedRuntime()).toBe(false);
	});

	it("uses an eight-pixel movement slop", () => {
		expect(hasGestureExceededSlop(4, 4)).toBe(false);
		expect(hasGestureExceededSlop(8, 0)).toBe(true);
	});

	it("only yields control gestures that are predominantly vertical", () => {
		expect(isMostlyVerticalGesture(3, 9)).toBe(true);
		expect(isMostlyVerticalGesture(9, 3)).toBe(false);
		expect(isMostlyVerticalGesture(5, 5)).toBe(false);
	});
});
