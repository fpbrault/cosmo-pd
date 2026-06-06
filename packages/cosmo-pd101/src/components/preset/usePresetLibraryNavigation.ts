import { useCallback, useEffect, useRef } from "react";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import {
	getVirtualRowHeight,
	isEditableTarget,
	type VirtualPresetRow,
} from "./presetLibraryShared";

type UsePresetLibraryNavigationOptions = {
	isOpen: boolean;
	isPluginRuntime: boolean;
	focusedEntryId: string | null;
	setFocusedEntryId: (id: string | null) => void;
	focusedEntry?: PresetEntry;
	sortedEntries: PresetEntry[];
	virtualRows: VirtualPresetRow[];
	virtualOffsets: number[];
	scrollContainerRef: React.RefObject<HTMLDivElement | null>;
	handleLoad: (entry: PresetEntry) => void;
	onClose: () => void;
};

export function usePresetLibraryNavigation({
	isOpen,
	isPluginRuntime,
	focusedEntryId,
	setFocusedEntryId,
	focusedEntry,
	sortedEntries,
	virtualRows,
	virtualOffsets,
	scrollContainerRef,
	handleLoad,
	onClose,
}: UsePresetLibraryNavigationOptions) {
	const virtualRowsRef = useRef(virtualRows);
	virtualRowsRef.current = virtualRows;
	const virtualOffsetsRef = useRef(virtualOffsets);
	virtualOffsetsRef.current = virtualOffsets;

	useEffect(() => {
		if (!isOpen) return;
		if (!focusedEntryId) return;
		if (document.activeElement?.tagName === "INPUT") return;

		const rowIndex = virtualRowsRef.current.findIndex(
			(row) => row.kind === "entry" && row.entry.id === focusedEntryId,
		);
		const scrollContainer = scrollContainerRef.current;
		if (rowIndex < 0 || !scrollContainer) return;

		const top = virtualOffsetsRef.current[rowIndex];
		const bottom = top + getVirtualRowHeight();
		if (top < scrollContainer.scrollTop) {
			scrollContainer.scrollTop = top;
		}
		if (bottom > scrollContainer.scrollTop + scrollContainer.clientHeight) {
			scrollContainer.scrollTop = bottom - scrollContainer.clientHeight;
		}
	}, [focusedEntryId, isOpen, scrollContainerRef]);

	const handleKeyboardNavigation = useCallback(
		(event: { key: string; preventDefault: () => void }) => {
			if (sortedEntries.length === 0) return;
			const currentIndex = Math.max(
				0,
				sortedEntries.findIndex((entry) => entry.id === focusedEntryId),
			);
			if (event.key === "ArrowDown") {
				event.preventDefault();
				const nextEntry =
					sortedEntries[(currentIndex + 1) % sortedEntries.length];
				if (nextEntry) {
					setFocusedEntryId(nextEntry.id);
					handleLoad(nextEntry);
				}
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				const prevEntry =
					sortedEntries[
						(currentIndex - 1 + sortedEntries.length) % sortedEntries.length
					];
				if (prevEntry) {
					setFocusedEntryId(prevEntry.id);
					handleLoad(prevEntry);
				}
			}
			if (event.key === "Home") {
				event.preventDefault();
				const firstEntry = sortedEntries[0];
				if (firstEntry) {
					setFocusedEntryId(firstEntry.id);
					handleLoad(firstEntry);
				}
			}
			if (event.key === "End") {
				event.preventDefault();
				const lastEntry = sortedEntries[sortedEntries.length - 1];
				if (lastEntry) {
					setFocusedEntryId(lastEntry.id);
					handleLoad(lastEntry);
				}
			}
			if (event.key === "Enter" && focusedEntry) {
				event.preventDefault();
				handleLoad(focusedEntry);
			}
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		},
		[
			focusedEntry,
			focusedEntryId,
			handleLoad,
			onClose,
			setFocusedEntryId,
			sortedEntries,
		],
	);

	useEffect(() => {
		if (!isOpen) return;
		const handleWindowKeyDown = (event: KeyboardEvent) => {
			if (!document.hasFocus()) return;
			if (event.defaultPrevented) return;
			if (isEditableTarget(event.target)) return;
			if (
				event.key !== "ArrowDown" &&
				event.key !== "ArrowUp" &&
				event.key !== "Home" &&
				event.key !== "End"
			) {
				return;
			}
			handleKeyboardNavigation(event);
		};

		window.addEventListener("keydown", handleWindowKeyDown);
		return () => window.removeEventListener("keydown", handleWindowKeyDown);
	}, [handleKeyboardNavigation, isOpen]);

	const handleListKeyDownCapture = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (!isPluginRuntime) return;
			if (event.key !== " ") return;
			if (isEditableTarget(event.target)) return;
			if (event.target instanceof HTMLElement) {
				event.target.blur();
			}
			event.currentTarget.focus({ preventScroll: true });
		},
		[isPluginRuntime],
	);

	const handleListKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (isEditableTarget(event.target)) return;
			handleKeyboardNavigation(event);
		},
		[handleKeyboardNavigation],
	);

	return {
		handleKeyboardNavigation,
		handleListKeyDownCapture,
		handleListKeyDown,
	};
}
