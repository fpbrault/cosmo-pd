import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModulatableControl from "./ModulatableControl";

const useModMatrixMock = vi.fn();
const modulationMenuPropsSpy = vi.fn();
const useModulationTargetMock = vi.fn();

vi.mock("@/context/ModMatrixContext", () => ({
	useModMatrix: () => useModMatrixMock(),
}));

vi.mock("@/features/synth/hooks/useModulationTarget", () => ({
	useModulationTarget: (args: Record<string, unknown>) =>
		useModulationTargetMock(args),
}));

vi.mock("./ModulationMenu", () => ({
	default: (props: Record<string, unknown>) => {
		modulationMenuPropsSpy(props);
		return (
			<div data-testid="modulation-menu">
				<button type="button" onClick={props.onClose as () => void}>
					close menu
				</button>
			</div>
		);
	},
}));

describe("ModulatableControl", () => {
	beforeEach(() => {
		useModMatrixMock.mockReset();
		modulationMenuPropsSpy.mockReset();
		useModulationTargetMock.mockReset();
		useModulationTargetMock.mockReturnValue({
			modMode: false,
			modulationTargetState: null,
			interactionLocked: false,
			isTargeted: false,
			onTarget: vi.fn(),
			onClose: vi.fn(),
		});
	});

	it("shows route count only while modulation targeting is active", () => {
		useModMatrixMock.mockReturnValue({
			modMatrix: {
				routes: [
					{ source: "lfo1", destination: "volume", amount: 0.4, enabled: true },
					{
						source: "velocity",
						destination: "volume",
						amount: 0.2,
						enabled: true,
					},
					{
						source: "modWheel",
						destination: "line1Level",
						amount: 0.3,
						enabled: true,
					},
				],
			},
			setModMatrix: vi.fn(),
		});

		render(
			<ModulatableControl destinationId="volume" label="Volume">
				<div>child</div>
			</ModulatableControl>,
		);

		expect(screen.queryByText("2")).not.toBeInTheDocument();

		useModulationTargetMock.mockReturnValue({
			modMode: true,
			modulationTargetState: "available",
			interactionLocked: true,
			isTargeted: false,
			onTarget: vi.fn(),
			onClose: vi.fn(),
		});

		render(
			<ModulatableControl destinationId="volume" label="Volume">
				<div>child</div>
			</ModulatableControl>,
		);

		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("shows the focused menu in mod mode and supports route mutations", () => {
		const setModMatrix = vi.fn();
		useModMatrixMock.mockReturnValue({
			modMatrix: {
				routes: [
					{ source: "lfo1", destination: "volume", amount: 0.4, enabled: true },
					{
						source: "modWheel",
						destination: "line1Level",
						amount: 0.3,
						enabled: true,
					},
				],
			},
			setModMatrix,
		});
		useModulationTargetMock.mockReturnValue({
			modMode: true,
			modulationTargetState: "targeted",
			interactionLocked: true,
			isTargeted: true,
			onTarget: vi.fn(),
			onClose: vi.fn(),
		});

		render(
			<ModulatableControl destinationId="volume" label="Volume">
				<div>child</div>
			</ModulatableControl>,
		);

		expect(screen.getByTestId("modulation-menu")).toBeInTheDocument();

		const menuProps = modulationMenuPropsSpy.mock.calls[0][0] as {
			onAddRoute: (source: "velocity") => void;
			onToggleEnabled: (index: number) => void;
			onAmountChange: (index: number, amount: number) => void;
			onRemoveRoute: (index: number) => void;
		};
		menuProps.onAddRoute("velocity");
		menuProps.onToggleEnabled(0);
		menuProps.onAmountChange(0, 0.9);
		menuProps.onRemoveRoute(0);

		expect(setModMatrix).toHaveBeenCalledTimes(4);
		fireEvent.click(screen.getByText("close menu"));
	});
});
