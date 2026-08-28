import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FxSlotConfig } from "@/lib/synth/bindings/synth";
import { createDefaultFxSlotConfig } from "@/lib/synth/fxSlotSanitizer";
import PerformanceEffectSlot from "./PerformanceEffectSlot";

const setFxSlotType = vi.fn();
const setFxSlotEnabled = vi.fn();
const setFxSlotParams = vi.fn();
let fxSlots: FxSlotConfig[] = [];

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn((selector) =>
		selector({
			fxSlots,
			setFxSlotType,
			setFxSlotEnabled,
			setFxSlotParams,
		}),
	),
}));

vi.mock("@/components/controls/ControlKnob", () => ({
	default: ({
		label,
		onChange,
	}: {
		label: string;
		onChange: (v: number) => void;
	}) => (
		<button type="button" aria-label={label} onClick={() => onChange(0.75)}>
			Quick control
		</button>
	),
}));

vi.mock("@/components/panels/FxTypeSelectorPopover", () => ({
	default: ({
		open,
		onSelect,
	}: {
		open: boolean;
		onSelect: (type: "delay") => void;
	}) =>
		open ? (
			<div role="dialog" aria-label="Select effect type">
				<button type="button" onClick={() => onSelect("delay")}>
					Delay
				</button>
			</div>
		) : null,
}));

vi.mock("@/components/panels/drawer-modules/FxSlotModuleRenderer", () => ({
	default: ({ slot }: { slot: number }) => (
		<div data-testid="effect-editor-controls">Slot {slot + 1} controls</div>
	),
}));

vi.mock("@/components/primitives/Popover", () => ({
	default: ({
		open,
		ariaLabel,
		children,
	}: {
		open: boolean;
		ariaLabel: string;
		children: ReactNode;
	}) =>
		open ? (
			<div role="dialog" aria-label={ariaLabel}>
				{children}
			</div>
		) : null,
}));

describe("PerformanceEffectSlot", () => {
	beforeEach(() => {
		setFxSlotType.mockReset();
		setFxSlotEnabled.mockReset();
		setFxSlotParams.mockReset();
	});

	it("selects an effect from an empty slot", () => {
		fxSlots = [{ type: "empty" }];
		render(<PerformanceEffectSlot slot={0} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Add effect in slot 1" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "Delay" }));

		expect(setFxSlotType).toHaveBeenCalledWith(0, "delay");
	});

	it("keeps populated quick controls, bypass, editor, and removal behavior", () => {
		fxSlots = [createDefaultFxSlotConfig("delay")];
		render(<PerformanceEffectSlot slot={0} />);

		fireEvent.click(screen.getByRole("switch", { name: "Bypass Delay" }));
		expect(setFxSlotEnabled).toHaveBeenCalledWith(0, false);

		fireEvent.click(screen.getByRole("button", { name: "1 · Delay" }));
		expect(setFxSlotParams).toHaveBeenCalledWith(0, { mix: 0.75 });

		fireEvent.click(screen.getByRole("button", { name: "Edit Delay" }));
		expect(screen.getByRole("dialog", { name: "Edit Delay" })).toBeVisible();
		expect(screen.getByTestId("effect-editor-controls")).toBeVisible();

		fireEvent.click(screen.getByRole("button", { name: "Close Delay editor" }));
		expect(screen.queryByRole("dialog", { name: "Edit Delay" })).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Edit Delay" }));
		fireEvent.click(screen.getByRole("button", { name: "Remove Delay" }));
		expect(setFxSlotType).toHaveBeenCalledWith(0, "empty");
		expect(screen.queryByRole("dialog", { name: "Edit Delay" })).toBeNull();
	});
});
