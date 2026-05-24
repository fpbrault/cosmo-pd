import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePresetLibraryImport } from "./usePresetLibraryImport";

class FileReaderMock {
	result: string | null = null;
	onload: ((event: { target: { result: string } }) => void) | null = null;

	readAsText(file: File) {
		this.result = file.name.includes("bad") ? "{bad" : '{"ok":true}';
		this.onload?.({ target: { result: this.result } });
	}
}

describe("usePresetLibraryImport", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("invokes import callback on valid json and clears input value", () => {
		const onImportPreset = vi.fn();
		const setImportError = vi.fn();
		vi.stubGlobal("FileReader", FileReaderMock);
		const { result } = renderHook(() =>
			usePresetLibraryImport({ onImportPreset, setImportError }),
		);
		const event = {
			target: {
				files: [new File(["{}"], "preset.json", { type: "application/json" })],
				value: "x",
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;
		act(() => result.current.handleImportFile(event));
		expect(onImportPreset).toHaveBeenCalledWith('{"ok":true}', "preset");
		expect(setImportError).toHaveBeenCalledWith(null);
		expect(event.target.value).toBe("");
	});

	it("sets import error when callback throws", () => {
		vi.stubGlobal("FileReader", FileReaderMock);
		const onImportPreset = vi.fn(() => {
			throw new Error("bad");
		});
		const setImportError = vi.fn();
		const { result } = renderHook(() =>
			usePresetLibraryImport({ onImportPreset, setImportError }),
		);
		const event = {
			target: {
				files: [new File(["{}"], "bad.json", { type: "application/json" })],
				value: "x",
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;
		act(() => result.current.handleImportFile(event));
		expect(setImportError).toHaveBeenCalledWith("Invalid preset file.");
	});
});
