import { describe, expect, it } from "vitest";
import { isEditableKeyboardTarget } from "./keyboard";

describe("isEditableKeyboardTarget", () => {
	it("detects form and editable targets", () => {
		expect(isEditableKeyboardTarget(document.createElement("input"))).toBe(
			true,
		);
		expect(isEditableKeyboardTarget(document.createElement("textarea"))).toBe(
			true,
		);
		expect(isEditableKeyboardTarget(document.createElement("select"))).toBe(
			true,
		);

		const editable = document.createElement("div");
		editable.contentEditable = "true";
		expect(isEditableKeyboardTarget(editable)).toBe(true);
	});

	it("allows non-editable elements", () => {
		expect(isEditableKeyboardTarget(document.createElement("button"))).toBe(
			false,
		);
		expect(isEditableKeyboardTarget(null)).toBe(false);
	});
});
