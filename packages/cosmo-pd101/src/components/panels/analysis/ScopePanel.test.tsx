import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScopeMiniDisplay } from "./ScopePanel";

describe("ScopeMiniDisplay", () => {
	it("renders a larger scope canvas without forced pixelated scaling", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const scopeLabel = screen.getByText("Scope");
		const wrapper = scopeLabel.parentElement;
		if (!(wrapper instanceof HTMLElement)) {
			throw new Error("expected scope wrapper element");
		}

		const canvas = wrapper.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.className).toContain("h-20");
		expect(canvas.className).toContain("w-48");
		expect(canvas.style.imageRendering).toBe("");
	});
});
