import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SynthSidebarButtons from "./SynthSidebarButtons";

const setMainPanelMode = vi.fn();
const setPolyMode = vi.fn();
const setPortamentoEnabled = vi.fn();
const setFxSlotType = vi.fn();
const setFxSlotEnabled = vi.fn();

let polyModeValue: "poly8" | "mono" = "poly8";
let portamentoEnabledValue = false;
let fxSlotsValue = Array.from({ length: 6 }, () => ({
	type: "empty",
	params: { enabled: false },
}));

vi.mock("@/components/primitives/CzTabButton", () => ({
	default: ({
		topLabel,
		bottomLabel,
		onClick,
		onLongPress,
	}: {
		topLabel: string;
		bottomLabel?: string;
		onClick?: () => void;
		onLongPress?: () => void;
	}) => (
		<button
			type="button"
			onClick={onClick}
			onContextMenu={(event) => {
				event.preventDefault();
				onLongPress?.();
			}}
		>
			{topLabel} {bottomLabel ?? ""}
		</button>
	),
}));

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(() => ({
		setMainPanelMode,
	})),
}));

vi.mock("@/features/synth/SynthParamController", () => ({
	useSynthParam: vi.fn((key: string) => {
		if (key === "polyMode") {
			return { value: polyModeValue, setValue: setPolyMode };
		}
		return {
			value: portamentoEnabledValue,
			setValue: setPortamentoEnabled,
		};
	}),
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector({
				fxSlots: fxSlotsValue,
				setFxSlotType,
				setFxSlotEnabled,
			}),
	),
}));

describe("SynthSidebarButtons", () => {
	beforeEach(() => {
		setMainPanelMode.mockReset();
		setPolyMode.mockReset();
		setPortamentoEnabled.mockReset();
		setFxSlotType.mockReset();
		setFxSlotEnabled.mockReset();
		polyModeValue = "poly8";
		portamentoEnabledValue = false;
		fxSlotsValue = Array.from({ length: 6 }, () => ({
			type: "empty",
			params: { enabled: false },
		}));
	});

	it("opens global settings when Global is clicked", () => {
		const onOpenGlobal = vi.fn();
		render(
			<SynthSidebarButtons globalOpen={false} onOpenGlobal={onOpenGlobal} />,
		);
		fireEvent.click(screen.getByRole("button", { name: "Global" }));
		expect(onOpenGlobal).toHaveBeenCalledTimes(1);
	});

	it("toggles poly and portamento controls", () => {
		render(<SynthSidebarButtons globalOpen={false} onOpenGlobal={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Poly8" }));
		fireEvent.click(screen.getByRole("button", { name: "Porta Mento" }));
		expect(setPolyMode).toHaveBeenCalledWith("mono");
		expect(setPortamentoEnabled).toHaveBeenCalledWith(true);
	});

	it("toggles enabled fx slots and initializes default empty slots", () => {
		fxSlotsValue[0] = { type: "chorus", params: { enabled: true } };
		render(<SynthSidebarButtons globalOpen={false} onOpenGlobal={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "FX1 Chrs" }));
		fireEvent.click(screen.getByRole("button", { name: "FX4 Vib" }));
		fireEvent.click(screen.getByRole("button", { name: "FX5 PhMd" }));
		expect(setFxSlotEnabled).toHaveBeenCalledWith(0, false);
		expect(setFxSlotType).toHaveBeenCalledWith(3, "vibrato");
		expect(setFxSlotType).toHaveBeenCalledWith(4, "phaseMod");
	});

	it("opens the fx drawer on fx long press", () => {
		render(<SynthSidebarButtons globalOpen={false} onOpenGlobal={vi.fn()} />);
		fireEvent.contextMenu(screen.getByRole("button", { name: "FX1 —" }));
		expect(setMainPanelMode).toHaveBeenCalledWith("fx");
	});
});
