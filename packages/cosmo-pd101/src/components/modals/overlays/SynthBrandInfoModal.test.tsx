import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SynthBrandInfoModal } from "./SynthBrandInfoModal";

vi.mock("@/assets/logo.png", () => ({ default: "logo.png" }));

describe("SynthBrandInfoModal", () => {
	it("renders when open and closes on escape", () => {
		const onClose = vi.fn();
		render(<SynthBrandInfoModal open onClose={onClose} appVersion="0.2.0" />);
		expect(
			screen.getByRole("dialog", { name: "Synthesizer lab information" }),
		).toBeInTheDocument();
		expect(screen.getByText("Version: 0.2.0")).toBeInTheDocument();
		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalled();
	});
});
