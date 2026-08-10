import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModMatrix } from "@/lib/synth/bindings/synth";
import ModMatrixPanel from "./ModMatrixPanel";

const useModMatrixMock = vi.fn();

vi.mock("@/context/ModMatrixContext", () => ({
	useModMatrix: () => useModMatrixMock(),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useOptionalSynthController: () => null,
}));

function layoutWithSlots(): NonNullable<ModMatrix["layout"]> {
	return {
		pages: [
			{
				sources: ["lfo1", null, null, null, null, null, null, null],
				destinations: ["volume", null, null, null, null, null, null, null],
			},
			{
				sources: ["modWheel", null, null, null, null, null, null, null],
				destinations: ["pitch", null, null, null, null, null, null, null],
			},
		],
	};
}

function renderPanel(modMatrix: ModMatrix = { routes: [] }) {
	const setModMatrix = vi.fn();
	useModMatrixMock.mockReturnValue({ modMatrix, setModMatrix });
	return { setModMatrix, ...render(<ModMatrixPanel />) };
}

describe("ModMatrixPanel", () => {
	beforeEach(() => {
		useModMatrixMock.mockReset();
	});

	it("renders a fixed 8 by 8 page with explicit empty slots", () => {
		renderPanel();

		expect(screen.getByText("Mod Matrix")).toBeInTheDocument();
		expect(
			screen.getAllByRole("button", { name: "None to None modulation cell" }),
		).toHaveLength(64);
		expect(
			screen.getByRole("button", { name: "Open modulation matrix page 1" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Open modulation matrix page 2" }),
		).toBeInTheDocument();
	});

	it("opens source selection and persists the chosen row slot", () => {
		const { setModMatrix } = renderPanel();

		fireEvent.click(
			screen.getByRole("button", { name: "Choose source for row 1" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "LFO 1" }));

		expect(setModMatrix).toHaveBeenCalledWith(
			expect.objectContaining({
				layout: expect.objectContaining({
					pages: expect.arrayContaining([
						expect.objectContaining({
							sources: expect.arrayContaining(["lfo1"]),
						}),
					]),
				}),
			}),
		);
	});

	it("creates a zero-depth route when an assigned empty cell is clicked", () => {
		const { setModMatrix } = renderPanel({
			routes: [],
			layout: layoutWithSlots(),
		});

		fireEvent.click(
			screen.getByRole("button", { name: "LFO 1 to Volume modulation cell" }),
		);

		expect(setModMatrix).toHaveBeenCalledWith(
			expect.objectContaining({
				routes: [
					{
						source: "lfo1",
						destination: "volume",
						amount: 0,
						enabled: true,
					},
				],
			}),
		);
	});

	it("opens the inspector for an existing route and exposes depth editing", () => {
		renderPanel({
			routes: [
				{
					source: "lfo1",
					destination: "volume",
					amount: 0.35,
					enabled: true,
				},
			],
			layout: layoutWithSlots(),
		});

		fireEvent.click(
			screen.getByRole("button", { name: "LFO 1 to Volume modulation cell" }),
		);

		expect(screen.getByText("Route inspector")).toBeInTheDocument();
		expect(
			screen.getByRole("spinbutton", { name: "Modulation depth percent" }),
		).toHaveValue(35);
	});

	it("switches to the second persisted page", () => {
		renderPanel({ routes: [], layout: layoutWithSlots() });

		fireEvent.click(
			screen.getByRole("button", { name: "Open modulation matrix page 2" }),
		);

		expect(
			screen.getByRole("button", { name: "Choose source for row 1" }),
		).toHaveTextContent("Mod Wheel");
		expect(
			screen.getByRole("button", { name: "Choose destination for column 1" }),
		).toHaveTextContent("Pitch");
	});
});
