import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePresetLibraryImport } from "./usePresetLibraryImport";

describe("usePresetLibraryImport", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("reads multiple selected files as binary import sources", async () => {
		const onImportPresetFiles = vi.fn().mockResolvedValue({
			importedCount: 2,
			failures: [],
		});
		const onImportComplete = vi.fn();
		const onImportFailure = vi.fn();
		const { result } = renderHook(() =>
			usePresetLibraryImport({
				onImportPresetFiles,
				onImportComplete,
				onImportFailure,
			}),
		);
		const event = {
			target: {
				files: [
					new File([new Uint8Array([0xf0])], "one.syx"),
					new File(['{"ok":true}'], "two.json"),
				],
				value: "x",
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		await act(async () => result.current.handleImportFile(event));

		expect(onImportPresetFiles).toHaveBeenCalledWith([
			expect.objectContaining({
				filename: "one.syx",
				data: expect.any(Uint8Array),
			}),
			expect.objectContaining({
				filename: "two.json",
				data: expect.any(Uint8Array),
			}),
		]);
		expect(onImportComplete).toHaveBeenCalledWith({
			importedCount: 2,
			failures: [],
		});
		expect(onImportFailure).not.toHaveBeenCalled();
		expect(event.target.value).toBe("");
	});

	it("handles dropped files and resets the drag state", async () => {
		const onImportPresetFiles = vi.fn().mockResolvedValue({
			importedCount: 1,
			failures: [],
		});
		const { result } = renderHook(() =>
			usePresetLibraryImport({
				onImportPresetFiles,
				onImportComplete: vi.fn(),
				onImportFailure: vi.fn(),
			}),
		);
		const file = new File([new Uint8Array([0xf0])], "drop.syx");
		const event = {
			preventDefault: vi.fn(),
			dataTransfer: {
				types: ["Files"],
				files: [file],
				dropEffect: "none",
			},
		} as unknown as React.DragEvent<HTMLDivElement>;

		act(() => result.current.handleDragEnter(event));
		expect(result.current.isDragActive).toBe(true);
		await act(async () => result.current.handleDrop(event));
		expect(result.current.isDragActive).toBe(false);
		expect(onImportPresetFiles).toHaveBeenCalledTimes(1);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it("reports file-read or import failures", async () => {
		const onImportFailure = vi.fn();
		const { result } = renderHook(() =>
			usePresetLibraryImport({
				onImportPresetFiles: vi.fn().mockRejectedValue(new Error("bad")),
				onImportComplete: vi.fn(),
				onImportFailure,
			}),
		);

		await act(async () =>
			result.current.handleImportFile({
				target: {
					files: [new File(["{}"], "bad.json")],
					value: "x",
				},
			} as unknown as React.ChangeEvent<HTMLInputElement>),
		);

		expect(onImportFailure).toHaveBeenCalled();
	});
});
