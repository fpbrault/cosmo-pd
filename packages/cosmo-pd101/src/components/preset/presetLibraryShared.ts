import type { PresetEntry } from "@/features/synth/types/presetEntry";

export type SortKey = "star" | "favorite" | "name" | "author" | "tags";
export type SortDirection = "asc" | "desc";

export type VirtualPresetRow = {
	id: string;
	kind: "entry";
	entry: PresetEntry;
};

const ENTRY_ROW_HEIGHT = 52;
export const VIRTUAL_OVERSCAN_PX = ENTRY_ROW_HEIGHT * 8;

export function getVirtualRowHeight() {
	return ENTRY_ROW_HEIGHT;
}

export function getEntrySearchText(entry: PresetEntry) {
	return `${entry.label} ${entry.bankName ?? ""} ${entry.sourceLabel} ${entry.author} ${entry.tags.join(" ")}`.toLowerCase();
}

export function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable || target.closest("[contenteditable='true']"))
		return true;
	if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") return true;
	if (target.tagName !== "INPUT") return false;
	const input = target as HTMLInputElement;
	return !(
		input.type === "range" ||
		input.type === "checkbox" ||
		input.type === "radio" ||
		input.type === "button"
	);
}
