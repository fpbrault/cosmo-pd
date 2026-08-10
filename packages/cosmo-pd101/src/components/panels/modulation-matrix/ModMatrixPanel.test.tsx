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

function emptyPage(): NonNullable<ModMatrix["layout"]>["pages"][number] {
	return {
		sources: [null, null, null, null, null, null, null, null],
		destinations: [null, null, null, null, null, null, null, null],
	};
}

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
			emptyPage(),
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

	it("renders a fixed 8 by 8 page with three page tabs", () => {
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
		expect(
			screen.getByRole("button", { name: "Open modulation matrix page 3" }),
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

	it("allows an active source to be selected for another row", () => {
		const { setModMatrix } = renderPanel({
			routes: [],
			layout: layoutWithSlots(),
		});

		fireEvent.click(
			screen.getByRole("button", { name: "Choose source for row 2" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "LFO 1" }));

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({
				layout: expect.objectContaining({
					pages: expect.arrayContaining([
						expect.objectContaining({
							sources: ["lfo1", "lfo1", null, null, null, null, null, null],
						}),
					]),
				}),
			}),
		);
	});

	it("allows an active destination to be selected for another column", () => {
		const { setModMatrix } = renderPanel({
			routes: [],
			layout: layoutWithSlots(),
		});

		fireEvent.click(
			screen.getByRole("button", { name: "Choose destination for column 2" }),
		);
		fireEvent.click(screen.getByRole("button", { name: /^Global/ }));
		fireEvent.click(screen.getByRole("button", { name: "Volume" }));

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({
				layout: expect.objectContaining({
					pages: expect.arrayContaining([
						expect.objectContaining({
							destinations: [
								"volume",
								"volume",
								null,
								null,
								null,
								null,
								null,
								null,
							],
						}),
					]),
				}),
			}),
		);
	});

	it("creates a zero-depth route when an assigned empty cell is activated", () => {
		const { setModMatrix } = renderPanel({
			routes: [],
			layout: layoutWithSlots(),
		});

		fireEvent.pointerDown(
			screen.getByRole("button", { name: "LFO 1 to Volume modulation cell" }),
			{ pointerId: 1, pointerType: "mouse", button: 0, clientY: 100 },
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

	it("preserves routes that are not represented in the visible grid", () => {
		const representedRoute = {
			source: "lfo1" as const,
			destination: "volume" as const,
			amount: 0.2,
			enabled: true,
		};
		const unassignedRoute = {
			source: "lfo1" as const,
			destination: "volume" as const,
			amount: 0.4,
			enabled: true,
		};
		const { setModMatrix } = renderPanel({
			routes: [representedRoute, unassignedRoute],
			layout: layoutWithSlots(),
		});

		const cell = screen.getByRole("button", {
			name: "LFO 1 to Volume modulation cell",
		});
		fireEvent.pointerDown(cell, {
			pointerId: 1,
			pointerType: "mouse",
			button: 0,
			clientY: 100,
		});
		fireEvent.pointerMove(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});
		fireEvent.pointerUp(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({
				routes: [
					expect.objectContaining({
						source: "lfo1",
						destination: "volume",
					}),
					unassignedRoute,
				],
			}),
		);
	});

	it("adjusts route depth with a vertical pointer drag", () => {
		const { setModMatrix } = renderPanel({
			routes: [
				{ source: "lfo1", destination: "volume", amount: 0, enabled: true },
			],
			layout: layoutWithSlots(),
		});
		const cell = screen.getByRole("button", {
			name: "LFO 1 to Volume modulation cell",
		});

		fireEvent.pointerDown(cell, {
			pointerId: 1,
			pointerType: "mouse",
			button: 0,
			clientY: 100,
		});
		fireEvent.pointerMove(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});
		fireEvent.pointerUp(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({
				routes: [expect.objectContaining({ amount: expect.closeTo(0.5, 1) })],
			}),
		);
	});

	it("uses continuous route depth opacity independently of source activity steps", () => {
		renderPanel({
			routes: [
				{ source: "lfo1", destination: "volume", amount: 0.35, enabled: true },
			],
			layout: layoutWithSlots(),
		});

		const cell = screen.getByRole("button", {
			name: "LFO 1 to Volume modulation cell",
		});
		const fill = cell.querySelector(".mod-matrix-route-fill");

		expect(fill).toHaveStyle({ opacity: "0.2005" });
		expect(fill).toHaveAttribute("data-mod-depth", "0.35");
	});

	it("clears a route with a double click instead of opening an inspector", () => {
		const { setModMatrix } = renderPanel({
			routes: [
				{ source: "lfo1", destination: "volume", amount: 0.35, enabled: true },
			],
			layout: layoutWithSlots(),
		});
		const cell = screen.getByRole("button", {
			name: "LFO 1 to Volume modulation cell",
		});

		fireEvent.doubleClick(cell);

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({ routes: [] }),
		);
		expect(screen.queryByText("Route inspector")).not.toBeInTheDocument();
	});

	it("keeps cell values when a row source is cleared and restored", () => {
		const { setModMatrix } = renderPanel({
			routes: [
				{ source: "lfo1", destination: "volume", amount: 0.35, enabled: true },
			],
			layout: layoutWithSlots(),
		});

		fireEvent.click(
			screen.getByRole("button", { name: "Choose source for row 1" }),
		);
		fireEvent.click(screen.getByRole("button", { name: /^None$/ }));

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({ routes: [] }),
		);
		const clearedLayout = setModMatrix.mock.lastCall?.[0].layout;
		expect(clearedLayout.pages[0].sources[0]).toBe(null);
		expect(clearedLayout.pages[0].cells[0][0]).toEqual({
			amount: 0.35,
			enabled: true,
		});
	});

	it("allows editing a cell before assigning its source or destination", () => {
		const { setModMatrix } = renderPanel();
		const cell = screen.getAllByRole("button", {
			name: "None to None modulation cell",
		})[0];

		fireEvent.pointerDown(cell, {
			pointerId: 1,
			pointerType: "mouse",
			button: 0,
			clientY: 100,
		});
		fireEvent.pointerMove(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});
		fireEvent.pointerUp(cell, {
			pointerId: 1,
			pointerType: "mouse",
			clientY: 58,
		});

		expect(setModMatrix).toHaveBeenLastCalledWith(
			expect.objectContaining({
				routes: [],
				layout: expect.objectContaining({
					pages: expect.arrayContaining([
						expect.objectContaining({
							cells: expect.arrayContaining([
								expect.arrayContaining([
									expect.objectContaining({ amount: expect.closeTo(0.5, 1) }),
								]),
							]),
						}),
					]),
				}),
			}),
		);
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
