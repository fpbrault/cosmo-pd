import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { EnvelopePresetControls } from "./EnvelopePresetControls";
import type {
	PhaseLineEnvelopeModel,
	PhaseLineEnvelopeTarget,
} from "./phaseLineTypes";

const controller = vi.hoisted(() => ({
	handleDeletePreset: vi.fn(),
	handlePresetChange: vi.fn(),
	handleSavePreset: vi.fn(),
}));

vi.mock("./useEnvelopePresetController", () => ({
	useEnvelopePresetController: () => ({
		selectedPreset: "",
		presetOptions: [{ id: "pluck", label: "Pluck" }],
		builtinPresetIds: new Set(["pluck"]),
		...controller,
	}),
}));

const env: StepEnvData = {
	steps: Array.from({ length: 8 }, (_, index) => ({
		level: index,
		rate: index + 10,
	})),
	sustainStep: 1,
	stepCount: 4,
	loop: false,
};

function createTarget(
	lineIndex: 1 | 2,
	envKind: "dco" | "dcw" | "dca",
	setEnv = vi.fn(),
): PhaseLineEnvelopeTarget {
	return {
		id: `line${lineIndex}-${envKind}`,
		lineIndex,
		envKind,
		label: `Line ${lineIndex} ${envKind.toUpperCase()}`,
		env,
		setEnv,
	};
}

function createModel(
	targets: PhaseLineEnvelopeTarget[],
): PhaseLineEnvelopeModel {
	return {
		envs: {
			dco: {
				title: "Line 1 DCO",
				shortLabel: "DCO",
				env,
				setEnv: vi.fn(),
				envColor: "#9cb937",
			},
			dcw: {
				title: "Line 1 DCW",
				shortLabel: "DCW",
				env,
				setEnv: vi.fn(),
				envColor: "#60a5fa",
			},
			dca: {
				title: "Line 1 DCA",
				shortLabel: "DCA",
				env,
				setEnv: vi.fn(),
				envColor: "#f97316",
			},
		},
		targets,
		dcwKeyFollow: 4,
		setDcwKeyFollow: vi.fn(),
		dcaKeyFollow: 5,
		setDcaKeyFollow: vi.fn(),
	};
}

describe("EnvelopePresetControls", () => {
	it("keeps the first-save action available with no existing presets", () => {
		render(
			<EnvelopePresetControls
				envKind="dcw"
				lineIndex={1}
				envelopes={createModel([createTarget(1, "dcw")])}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Envelope presets" }));
		fireEvent.click(screen.getByRole("button", { name: "+ Save" }));

		expect(
			screen.getByRole("heading", { name: "Save Envelope Preset As" }),
		).toBeInTheDocument();
		fireEvent.change(screen.getByPlaceholderText("Preset name"), {
			target: { value: "Pluck" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(controller.handleSavePreset).toHaveBeenCalledWith("Pluck");
	});

	it("offers all six targets and disables the current envelope", () => {
		const targets = [
			createTarget(1, "dco"),
			createTarget(1, "dcw"),
			createTarget(1, "dca"),
			createTarget(2, "dco"),
			createTarget(2, "dcw"),
			createTarget(2, "dca"),
		];
		const otherTarget = targets[5];

		render(
			<EnvelopePresetControls
				envKind="dcw"
				lineIndex={1}
				envelopes={createModel(targets)}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Copy envelope shape" }),
		);

		const current = screen.getByRole("menuitem", { name: /Line 1 DCW/ });
		expect(current).toBeDisabled();
		expect(screen.getAllByRole("menuitem")).toHaveLength(6);

		fireEvent.click(screen.getByRole("menuitem", { name: "Line 2 DCA" }));
		expect(otherTarget.setEnv).toHaveBeenCalledWith(
			expect.objectContaining({ stepCount: 4, sustainStep: 1 }),
		);
	});
});
