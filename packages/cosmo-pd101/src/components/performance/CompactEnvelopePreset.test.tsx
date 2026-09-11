import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PhaseLineEnvelopeModel } from "@/components/editor/phaseLineTypes";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import CompactEnvelopePreset from "./CompactEnvelopePreset";

const controller = vi.hoisted(() => ({
	handlePresetChange: vi.fn(),
}));
const presetEnvelopes = vi.hoisted(() => ({
	pluck: {
		steps: Array.from({ length: 8 }, () => ({ level: 0, rate: 50 })),
		sustainStep: 0,
		stepCount: 2,
		loop: false,
	},
	swell: {
		steps: Array.from({ length: 8 }, () => ({ level: 0, rate: 50 })),
		sustainStep: 0,
		stepCount: 3,
		loop: false,
	},
}));

vi.mock("../editor/useEnvelopePresetController", () => ({
	useEnvelopePresetController: () => ({
		selectedPreset: "pluck",
		presetOptions: [
			{ id: "pluck", label: "Pluck", envelope: presetEnvelopes.pluck },
			{ id: "swell", label: "Swell", envelope: presetEnvelopes.swell },
		],
		handlePresetChange: controller.handlePresetChange,
	}),
}));

vi.mock("./EnvelopeCanvas", () => ({
	default: ({ envelope }: { envelope: StepEnvData }) => (
		<div data-testid="envelope-preview" data-step-count={envelope.stepCount} />
	),
}));

vi.mock("@/components/editor/StepEnvelopeEditor", () => ({
	default: ({ title }: { title: string }) => <div>{title}</div>,
}));

function createEnvelope(stepCount: number): StepEnvData {
	return {
		steps: Array.from({ length: 8 }, () => ({ level: 0, rate: 50 })),
		sustainStep: 0,
		stepCount,
		loop: false,
	};
}

const envelope = createEnvelope(2);
const envelopes = {
	envs: {
		dco: {
			title: "Line 1 DCO",
			env: envelope,
			setEnv: vi.fn(),
			envColor: "#9cb937",
		},
		dcw: {
			title: "Line 1 DCW",
			env: envelope,
			setEnv: vi.fn(),
			envColor: "#60a5fa",
		},
		dca: {
			title: "Line 1 DCA",
			env: envelope,
			setEnv: vi.fn(),
			envColor: "#f97316",
		},
	},
	targets: [],
	dcwKeyFollow: 0,
	setDcwKeyFollow: vi.fn(),
	dcaKeyFollow: 0,
	setDcaKeyFollow: vi.fn(),
} satisfies PhaseLineEnvelopeModel;

function renderCard({ editorOpen = false } = {}) {
	const onEditorToggle = vi.fn();
	const onPresetOpen = vi.fn();
	render(
		<CompactEnvelopePreset
			envKind="dco"
			envelope={envelope}
			color="#9cb937"
			onApply={vi.fn()}
			lineIndex={1}
			lineColor="#9cb937"
			envelopes={envelopes}
			editorOpen={editorOpen}
			onEditorToggle={onEditorToggle}
			onPresetOpen={onPresetOpen}
			large
		/>,
	);
	return { onEditorToggle, onPresetOpen };
}

describe("CompactEnvelopePreset", () => {
	it("opens a visual preset list from the graph and requests editor dismissal", () => {
		const { onPresetOpen } = renderCard({ editorOpen: true });

		fireEvent.click(
			screen.getByRole("button", { name: "DCO envelope preset: Pluck" }),
		);

		const listbox = screen.getByRole("listbox", {
			name: "DCO envelope presets",
		});
		expect(within(listbox).getAllByTestId("envelope-preview")).toHaveLength(2);
		expect(onPresetOpen).toHaveBeenCalledOnce();
		expect(
			within(listbox).getByRole("option", { name: "Pluck" }),
		).toBeVisible();
		expect(
			within(listbox).getByRole("option", { name: "Swell" }),
		).toBeVisible();

		fireEvent.click(within(listbox).getByRole("option", { name: "Swell" }));
		expect(controller.handlePresetChange).toHaveBeenCalledWith("swell");
		expect(screen.queryByRole("listbox")).toBeNull();
	});

	it("uses the cog exclusively for editor activation", () => {
		const { onEditorToggle } = renderCard();

		fireEvent.click(
			screen.getByRole("button", { name: "Edit Line 1 DCO envelope" }),
		);

		expect(onEditorToggle).toHaveBeenCalledOnce();
		expect(screen.queryByRole("listbox")).toBeNull();
	});
});
