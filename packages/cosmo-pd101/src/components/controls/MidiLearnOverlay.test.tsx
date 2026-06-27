import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MidiLearnOverlay from "./MidiLearnOverlay";

describe("MidiLearnOverlay", () => {
	it("renders children directly when midiLearnState is null", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState={null}>
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		expect(
			screen.getByRole("button", { name: "Test button" }),
		).toBeInTheDocument();
		const zIndexElements = container.querySelectorAll(".z-10");
		const midiLearnOverlays = Array.from(zIndexElements).filter(
			(el) =>
				el.classList.contains("absolute") && el.classList.contains("inset-0"),
		);
		expect(midiLearnOverlays.length).toBe(0);
	});

	it("renders overlay when midiLearnState is available", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState="available">
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		expect(
			screen.getByRole("button", { name: "Test button" }),
		).toBeInTheDocument();
		const overlays = container.querySelectorAll(".pointer-events-none");
		expect(overlays.length).toBeGreaterThanOrEqual(1);
	});

	it("renders overlay when midiLearnState is mapped", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState="mapped">
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		expect(
			screen.getByRole("button", { name: "Test button" }),
		).toBeInTheDocument();
		const overlays = container.querySelectorAll(".pointer-events-none");
		expect(overlays.length).toBeGreaterThanOrEqual(1);
	});

	it("renders overlay when midiLearnState is targeted", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState="targeted">
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		expect(
			screen.getByRole("button", { name: "Test button" }),
		).toBeInTheDocument();
		const overlays = container.querySelectorAll(".pointer-events-none");
		expect(overlays.length).toBeGreaterThanOrEqual(1);
	});

	it("passes className to the overlay element", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState="available" className="rounded-lg">
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		const overlay = container.querySelector(".rounded-lg");
		expect(overlay).toBeInTheDocument();
	});

	it("wraps children in relative div when overlay is shown", () => {
		const { container } = render(
			<MidiLearnOverlay midiLearnState="available">
				<button type="button">Test button</button>
			</MidiLearnOverlay>,
		);

		const relativeWrapper = container.querySelector(".relative");
		expect(relativeWrapper).toBeInTheDocument();
		expect(relativeWrapper?.contains(screen.getByRole("button"))).toBe(true);
	});
});
