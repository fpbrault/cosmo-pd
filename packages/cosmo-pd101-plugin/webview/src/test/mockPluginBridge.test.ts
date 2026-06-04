/**
 * mockPluginBridge.test.ts — Unit tests for the mock bridge core logic.
 *
 * Runs in happy-dom (no real browser needed) because we exercise the bridge
 * data structures directly without rendering React.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	installMockPluginBridge,
	type MockBridgeMessage,
} from "./mockPluginBridge";

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
	// Reset globals that installMockPluginBridge writes to.
	window.__MOCK_BRIDGE__ = undefined;
	window.ipc = undefined as unknown as typeof window.ipc;
	window.__czOnParams = undefined;
	installMockPluginBridge();
});

afterEach(() => {
	window.__MOCK_BRIDGE__?.reset();
});

// ---------------------------------------------------------------------------
// Installation
// ---------------------------------------------------------------------------

describe("installMockPluginBridge", () => {
	it("installs window.__MOCK_BRIDGE__", () => {
		expect(window.__MOCK_BRIDGE__).toBeDefined();
	});
});

// ---------------------------------------------------------------------------
// params.set — outbound recording
// ---------------------------------------------------------------------------

describe("params.set", () => {
	it("records a param:set message with correct shape", () => {
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.5);

		const msgs = window.__MOCK_BRIDGE__?.getMessages() ?? [];
		expect(msgs).toHaveLength(1);
		expect(msgs[0]).toMatchObject({
			type: "param:set",
			stringId: "volume",
			value: 0.5,
		});
	});

	it("updates virtual param state", () => {
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.7);
		const state = window.__MOCK_BRIDGE__?.getState() ?? {};
		expect(state.volume).toBeCloseTo(0.7, 5);
	});

	it("records param:begin and param:end events", () => {
		window.ipc?.postMessage(
			JSON.stringify({
				method: "setParams",
				id: 1,
				args: [JSON.stringify({ volume: 0.3 })],
			}),
		);

		const types = (window.__MOCK_BRIDGE__?.getMessages() ?? []).map(
			(m) => m.type,
		);
		expect(types.filter((type) => type.startsWith("param:"))).toEqual([
			"param:begin",
			"param:set",
			"param:end",
		]);
	});

	it("is a no-op for unknown stringIds", () => {
		window.__MOCK_BRIDGE__?.setParameter("unknown_param", 0.5);
		expect(window.__MOCK_BRIDGE__?.getMessages()).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// params.info — read-back
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// invoke
// ---------------------------------------------------------------------------

describe("invoke", () => {
	it("records an invoke message", async () => {
		window.ipc?.postMessage(
			JSON.stringify({ method: "getEnvelopes", id: 1, args: [] }),
		);
		const msgs = window.__MOCK_BRIDGE__?.getMessages() ?? [];
		expect(
			msgs.some((m) => m.type === "invoke" && m.method === "getEnvelopes"),
		).toBe(true);
	});

	it("resolves getEnvelopes immediately", async () => {
		const handler = vi.fn();
		window.__czIpcResponse = handler;
		window.ipc?.postMessage(
			JSON.stringify({ method: "getEnvelopes", id: 1, args: [] }),
		);
		await Promise.resolve();
		expect(handler).toHaveBeenCalledWith({ id: 1, result: {} });
	});

	it("resolves getScopeData with empty samples", async () => {
		const handler = vi.fn();
		window.__czIpcResponse = handler;
		window.ipc?.postMessage(
			JSON.stringify({ method: "getScopeData", id: 1, args: [] }),
		);
		await Promise.resolve();
		expect(handler).toHaveBeenCalledWith({
			id: 1,
			result: { samples: [], sampleRate: 44100, hz: 220 },
		});
	});

	it("allows test to resolve custom invocations via resolveNextInvoke", async () => {
		const handler = vi.fn();
		window.__czIpcResponse = handler;
		window.ipc?.postMessage(
			JSON.stringify({ method: "customMethod", id: 42, args: [] }),
		);
		window.__MOCK_BRIDGE__?.resolveNextInvoke({ ok: true });
		await Promise.resolve();
		expect(handler).toHaveBeenCalledWith({ id: 42, result: { ok: true } });
	});

	it("allows test to reject custom invocations via rejectNextInvoke", async () => {
		const handler = vi.fn();
		window.__czIpcResponse = handler;
		window.ipc?.postMessage(
			JSON.stringify({ method: "failingMethod", id: 7, args: [] }),
		);
		window.__MOCK_BRIDGE__?.rejectNextInvoke("something went wrong");
		await Promise.resolve();
		expect(handler).toHaveBeenCalledWith({
			id: 7,
			error: "something went wrong",
		});
	});
});

// ---------------------------------------------------------------------------
// pushParamUpdate (inbound: host → UI simulation)
// ---------------------------------------------------------------------------

describe("pushParamUpdate", () => {
	it("calls window.__czOnParams with serialised JSON when handler is set", () => {
		const handler = vi.fn();
		window.__czOnParams = handler;

		window.__MOCK_BRIDGE__?.pushParamUpdate("volume", 0.6);

		expect(handler).toHaveBeenCalledTimes(1);
		const sent = JSON.parse(handler.mock.calls[0][0]);
		expect(sent.volume).toBe(0.6);
		expect(sent.line1).toBeDefined();
		expect(sent.line2).toBeDefined();
	});

	it("does not throw when __czOnParams is not set", () => {
		window.__czOnParams = undefined;
		expect(() => window.__MOCK_BRIDGE__?.pushParamUpdate(0, 0.5)).not.toThrow();
	});
});

// ---------------------------------------------------------------------------
// setParameter alias command
// ---------------------------------------------------------------------------

describe("setParameter alias", () => {
	it("falls back to pushParamUpdate when window.ipc is absent", () => {
		const handler = vi.fn();
		window.__czOnParams = handler;
		window.ipc = undefined as unknown as typeof window.ipc;

		window.__MOCK_BRIDGE__?.setParameter("volume", 0.4);

		expect(handler).toHaveBeenCalledTimes(1);
		const sent = JSON.parse(handler.mock.calls[0][0]);
		expect(sent.volume).toBe(0.4);
		expect(sent.line1).toBeDefined();
		expect(sent.line2).toBeDefined();
	});

	it("routes through window.ipc.postMessage when installed", () => {
		const spy = vi.fn();
		window.ipc = { postMessage: spy };

		window.__MOCK_BRIDGE__?.setParameter("volume", 0.9);

		expect(spy).toHaveBeenCalledWith(
			JSON.stringify({ param_id: "volume", value: 0.9 }),
		);
	});
});

// ---------------------------------------------------------------------------
// onMessage subscription
// ---------------------------------------------------------------------------

describe("onMessage", () => {
	it("calls the listener on each recorded message", () => {
		const received: MockBridgeMessage[] = [];
		const bridge = window.__MOCK_BRIDGE__;
		if (!bridge) throw new Error("bridge not installed in beforeEach");
		const unsub = bridge.onMessage((m) => received.push(m));

		window.__MOCK_BRIDGE__?.setParameter("volume", 0.2);
		expect(received).toHaveLength(1);
		expect(received[0].type).toBe("param:set");

		unsub();
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.3);
		// Listener was unsubscribed; still only one message.
		expect(received).toHaveLength(1);
	});
});

// ---------------------------------------------------------------------------
// clearMessages / reset
// ---------------------------------------------------------------------------

describe("clearMessages and reset", () => {
	it("clearMessages empties the log", () => {
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.5);
		expect(window.__MOCK_BRIDGE__?.getMessages()).toHaveLength(1);

		window.__MOCK_BRIDGE__?.clearMessages();
		expect(window.__MOCK_BRIDGE__?.getMessages()).toHaveLength(0);
	});

	it("getLastMessage returns undefined after clear", () => {
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.5);
		window.__MOCK_BRIDGE__?.clearMessages();
		expect(window.__MOCK_BRIDGE__?.getLastMessage()).toBeUndefined();
	});

	it("reset clears messages and stops listeners", () => {
		const received: MockBridgeMessage[] = [];
		const bridge = window.__MOCK_BRIDGE__;
		if (!bridge) throw new Error("bridge not installed in beforeEach");
		bridge.onMessage((m) => received.push(m));
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.5);
		expect(received).toHaveLength(1);

		window.__MOCK_BRIDGE__?.reset();
		expect(window.__MOCK_BRIDGE__?.getMessages()).toHaveLength(0);
		// After reset, listener is removed.
		window.__MOCK_BRIDGE__?.setParameter("volume", 0.6);
		expect(received).toHaveLength(1);
	});
});
