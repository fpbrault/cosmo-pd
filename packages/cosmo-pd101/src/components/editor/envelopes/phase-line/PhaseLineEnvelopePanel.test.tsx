import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhaseLineEnvelopePanel } from "./PhaseLineEnvelopePanel";

const setActiveEnvTab = vi.fn();

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn(
		(
			selector: (s: {
				activeEnvTab: "dcw";
				setActiveEnvTab: typeof setActiveEnvTab;
			}) => unknown,
		) => selector({ activeEnvTab: "dcw", setActiveEnvTab }),
	),
}));

vi.mock("../step/StepEnvelopePreview", () => ({
	StepEnvelopePreview: ({
		title,
		onClick,
	}: {
		title: string;
		onClick: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{title}
		</button>
	),
}));

vi.mock("../step/StepEnvelopeEditor", () => ({
	default: ({
		title,
		headerActions,
		headerRightActions,
	}: {
		title: string;
		headerActions?: React.ReactNode;
		headerRightActions?: React.ReactNode;
	}) => (
		<div data-testid="step-env-editor">
			{title}
			{headerActions}
			{headerRightActions}
		</div>
	),
}));

vi.mock("../presets/EnvelopePresetControls", () => ({
	EnvelopePresetControls: () => (
		<div data-testid="envelope-preset-controls">Envelope presets</div>
	),
}));

vi.mock("./EnvelopeKeyFollowControl", () => ({
	EnvelopeKeyFollowControl: ({ envKind }: { envKind: string }) => (
		<div data-testid="key-follow">{envKind}</div>
	),
}));

vi.mock("./usePhaseLineEnvelopeMarkers", () => ({
	usePhaseLineEnvelopeMarkers: () => [],
}));

const env = { steps: [], sustainStep: 0, stepCount: 0, loop: false };

describe("PhaseLineEnvelopePanel", () => {
	it("renders previews, key follow, and active editor", () => {
		render(
			<PhaseLineEnvelopePanel
				envelopes={{
					envs: {
						dco: { title: "DCO", env, setEnv: vi.fn(), envColor: "#fff" },
						dcw: { title: "DCW", env, setEnv: vi.fn(), envColor: "#fff" },
						dca: { title: "DCA", env, setEnv: vi.fn(), envColor: "#fff" },
					},
					targets: [],
					dcwKeyFollow: 0,
					setDcwKeyFollow: vi.fn(),
					dcaKeyFollow: 0,
					setDcaKeyFollow: vi.fn(),
				}}
				lineIndex={1}
				lineColor="#fff"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "DCA" }));
		expect(setActiveEnvTab).toHaveBeenCalledWith("dca");
		expect(screen.getByTestId("key-follow")).toHaveTextContent("dcw");
		expect(screen.getByTestId("step-env-editor")).toHaveTextContent("DCW");
		expect(screen.getByTestId("step-env-editor")).toContainElement(
			screen.getByTestId("envelope-preset-controls"),
		);
		expect(screen.getByTestId("step-env-editor")).toContainElement(
			screen.getByTestId("key-follow"),
		);
	});
});
