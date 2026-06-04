import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePresetLibraryNavigation } from "./usePresetLibraryNavigation";

const entries = [
	{
		id: "a",
		label: "A",
		type: "library" as const,
		source: "cosmo-factory" as const,
		sourceLabel: "Cosmo Library",
		author: "",
		starred: false,
		favorite: false,
		tags: [],
	},
	{
		id: "b",
		label: "B",
		type: "library" as const,
		source: "cosmo-factory" as const,
		sourceLabel: "Cosmo Library",
		author: "",
		starred: false,
		favorite: false,
		tags: [],
	},
];

describe("usePresetLibraryNavigation", () => {
	it("handles arrow navigation and enter selection", () => {
		const setFocusedEntryId = vi.fn();
		const handleLoad = vi.fn();
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			usePresetLibraryNavigation({
				isOpen: true,
				isPluginRuntime: false,
				focusedEntryId: "a",
				setFocusedEntryId,
				focusedEntry: entries[0],
				sortedEntries: entries,
				virtualRows: entries.map((entry) => ({
					id: entry.id,
					kind: "entry" as const,
					entry,
				})),
				virtualOffsets: [0, 52],
				scrollContainerRef: { current: document.createElement("div") },
				handleLoad,
				onClose,
			}),
		);

		act(() =>
			result.current.handleListKeyDown({
				key: "ArrowDown",
				preventDefault: vi.fn(),
				target: document.body,
			} as unknown as React.KeyboardEvent<HTMLDivElement>),
		);
		expect(setFocusedEntryId).toHaveBeenCalledWith("b");
		expect(handleLoad).toHaveBeenCalledWith(entries[1]);

		act(() =>
			result.current.handleListKeyDown({
				key: "Enter",
				preventDefault: vi.fn(),
				target: document.body,
			} as unknown as React.KeyboardEvent<HTMLDivElement>),
		);
		expect(handleLoad).toHaveBeenCalledWith(entries[0]);

		act(() =>
			result.current.handleListKeyDown({
				key: "Escape",
				preventDefault: vi.fn(),
				target: document.body,
			} as unknown as React.KeyboardEvent<HTMLDivElement>),
		);
		expect(onClose).toHaveBeenCalled();
	});
});
