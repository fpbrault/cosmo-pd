import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	__resetHostLoggerForTests,
	installGlobalHostErrorHandlers,
	postHostLog,
} from "./hostLogger";

describe("hostLogger", () => {
	const originalIpc = window.ipc;

	beforeEach(() => {
		window.ipc = { postMessage: vi.fn() };
		__resetHostLoggerForTests();
	});

	afterEach(() => {
		window.ipc = originalIpc;
		__resetHostLoggerForTests();
	});

	it("posts structured host logs over ipc", () => {
		postHostLog("error", "boom");

		expect(window.ipc?.postMessage).toHaveBeenCalledWith(
			JSON.stringify({
				id: 0,
				method: "clientLog",
				args: ["error", "boom"],
			}),
		);
	});

	it("logs uncaught window errors", () => {
		installGlobalHostErrorHandlers();

		window.dispatchEvent(
			new ErrorEvent("error", {
				message: "kaboom",
				filename: "app.js",
				lineno: 12,
				colno: 4,
			}),
		);

		expect(window.ipc?.postMessage).toHaveBeenCalledWith(
			expect.stringContaining('"window.onerror: kaboom @ app.js:12:4"'),
		);
	});

	it("logs unhandled promise rejections", () => {
		installGlobalHostErrorHandlers();

		const event = new Event("unhandledrejection") as PromiseRejectionEvent;
		Object.defineProperty(event, "reason", {
			value: new Error("async boom"),
			configurable: true,
		});
		window.dispatchEvent(event);

		expect(window.ipc?.postMessage).toHaveBeenCalledWith(
			expect.stringContaining('"unhandledrejection: Error: async boom'),
		);
	});

	it("forwards console warnings and errors to the host log", () => {
		installGlobalHostErrorHandlers();
		const errorSpy = vi.spyOn(console, "error");
		const warnSpy = vi.spyOn(console, "warn");

		console.warn("warned");
		console.error("failed", new Error("bad"));

		expect(warnSpy).toHaveBeenCalledWith("warned");
		expect(errorSpy).toHaveBeenCalledWith("failed", expect.any(Error));
		expect(window.ipc?.postMessage).toHaveBeenCalledWith(
			expect.stringContaining('"console.warn: warned"'),
		);
		expect(window.ipc?.postMessage).toHaveBeenCalledWith(
			expect.stringContaining('"console.error: failed Error: bad'),
		);
	});
});
