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
			__czGetParamsVersion: getParamsVersion,
		});

		await window.__czGetParamsVersion?.();

		expect(getParamsVersion).toHaveBeenCalledOnce();
		expect(invokeMock).not.toHaveBeenCalledWith("getParamsVersion");
	});
});
