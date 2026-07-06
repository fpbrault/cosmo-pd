import { afterEach, describe, expect, it, vi } from "vitest";
import { installPluginIpcWindowBridge } from "./installPluginIpcWindowBridge";
import type { PluginIpcInvoke } from "./ipcTypes";

const invokeMock = vi.fn(async () => null);
const invoke = invokeMock as PluginIpcInvoke;

describe("installPluginIpcWindowBridge", () => {
	afterEach(() => {
		invokeMock.mockClear();
	});

	it("maps ergonomic facade arguments to generated IPC payloads", async () => {
		installPluginIpcWindowBridge(invoke);

		await window.__czRenamePreset?.("preset-1", "New Name");
		await window.__czGetPresetLibrary?.("factory");
		window.__czAddMidiBinding?.("filter.cutoff", 2, 74);

		expect(invokeMock).toHaveBeenNthCalledWith(1, "renamePreset", {
			id: "preset-1",
			newName: "New Name",
		});
		expect(invokeMock).toHaveBeenNthCalledWith(2, "getPresetLibrary", {
			source: "factory",
		});
		expect(invokeMock).toHaveBeenNthCalledWith(3, "addMidiBinding", {
			paramKey: "filter.cutoff",
			channel: 2,
			cc: 74,
		});
	});

	it("uses typed platform overrides", async () => {
		const getParamsVersion = vi.fn(async () => 42);
		installPluginIpcWindowBridge(invoke, {
			overrides: { __czGetParamsVersion: getParamsVersion },
		});

		await window.__czGetParamsVersion?.();

		expect(getParamsVersion).toHaveBeenCalledOnce();
		expect(invokeMock).not.toHaveBeenCalledWith("getParamsVersion");
	});

	it("installs every method by default (plugin/standalone)", () => {
		installPluginIpcWindowBridge(invoke);
		expect(typeof window.__czGetPendingParamChanges).toBe("function");
		expect(window.__czBridgeCapabilities?.__czGetPendingParamChanges).not.toBe(
			false,
		);
	});

	it("does not install methods whose capability is explicitly false", () => {
		installPluginIpcWindowBridge(invoke, {
			capabilities: {
				__czGetPendingParamChanges: false,
				__czGetPresetName: false,
				__czSetPresetName: false,
			},
		});

		expect(window.__czGetPendingParamChanges).toBeUndefined();
		expect(window.__czGetPresetName).toBeUndefined();
		expect(window.__czSetPresetName).toBeUndefined();
		expect(window.__czBridgeCapabilities?.__czGetPendingParamChanges).toBe(
			false,
		);
		expect(window.__czBridgeCapabilities?.__czGetPresetName).toBe(false);
		// Untouched capabilities default true and are still installed.
		expect(typeof window.__czGetParams).toBe("function");
	});
});
