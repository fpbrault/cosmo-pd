import { describe, expect, it, vi } from "vitest";
import { postPluginIpc } from "./postPluginIpc";

describe("postPluginIpc", () => {
	const postMessage = vi.fn<(message: string) => void>();

	it("sends canonical envelope with payload for payload methods", () => {
		postPluginIpc(postMessage, "clientLog", {
			level: "info",
			message: "test",
		});
		expect(postMessage).toHaveBeenCalledWith(
			JSON.stringify({
				id: 0,
				method: "clientLog",
				payload: { level: "info", message: "test" },
			}),
		);
	});

	it("omits payload key for no-payload methods", () => {
		postPluginIpc(postMessage, "panic");
		expect(postMessage).toHaveBeenCalledWith(
			JSON.stringify({ id: 0, method: "panic" }),
		);
	});

	it("omits payload key for getParams", () => {
		postPluginIpc(postMessage, "getParams");
		expect(postMessage).toHaveBeenCalledWith(
			JSON.stringify({ id: 0, method: "getParams" }),
		);
	});

	it("never emits args key", () => {
		const captured: string[] = [];
		const capture = (msg: string) => {
			captured.push(msg);
		};
		postPluginIpc(capture, "getParams");
		postPluginIpc(capture, "clientLog", {
			level: "warn",
			message: "test",
		});
		postPluginIpc(capture, "panic");
		for (const json of captured) {
			expect(JSON.parse(json)).not.toHaveProperty("args");
		}
	});

	it("sends noteOn with correct payload shape", () => {
		postPluginIpc(postMessage, "noteOn", { note: 60, velocity: 0.75 });
		expect(postMessage).toHaveBeenCalledWith(
			JSON.stringify({
				id: 0,
				method: "noteOn",
				payload: { note: 60, velocity: 0.75 },
			}),
		);
	});

	describe("type-level constraints", () => {
		it("no-payload methods reject null argument", () => {
			// @ts-expect-error - getParams takes no arguments
			postPluginIpc(postMessage, "getParams", null);
		});

		it("noteOn rejects extra fields like frequency", () => {
			postPluginIpc(postMessage, "noteOn", {
				// @ts-expect-error - noteOn payload rejects unknown fields
				frequency: 440,
				note: 60,
				velocity: 0.8,
			});
		});

		it("clientLog rejects positional args", () => {
			// @ts-expect-error - clientLog expects {level,message} object
			postPluginIpc(postMessage, "clientLog", "info", "hello");
		});

		it("rejects unknown method name", () => {
			// @ts-expect-error - notAMethod is not in PluginIpcMethods
			postPluginIpc(postMessage, "notAMethod", {});
		});
	});
});
