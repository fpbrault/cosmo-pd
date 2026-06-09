import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import StepEnvelopeEditor from "./StepEnvelopeEditor";

type CanvasCommand = {
	name: string;
	args: number[];
};

function createMockCanvasContext() {
	const commands: CanvasCommand[] = [];
	const context = {
		beginPath: vi.fn(() => commands.push({ name: "beginPath", args: [] })),
		moveTo: vi.fn((...args: number[]) =>
			commands.push({ name: "moveTo", args }),
		),
		lineTo: vi.fn((...args: number[]) =>
			commands.push({ name: "lineTo", args }),
		),
		stroke: vi.fn(() => commands.push({ name: "stroke", args: [] })),
		fill: vi.fn(() => commands.push({ name: "fill", args: [] })),
		arc: vi.fn((...args: number[]) => commands.push({ name: "arc", args })),
		clearRect: vi.fn((...args: number[]) =>
			commands.push({ name: "clearRect", args }),
		),
		fillRect: vi.fn((...args: number[]) =>
			commands.push({ name: "fillRect", args }),
		),
		setLineDash: vi.fn(),
		setTransform: vi.fn(),
		fillStyle: "",
		globalAlpha: 1,
		lineWidth: 1,
		strokeStyle: "",
	} as unknown as CanvasRenderingContext2D;

	return { context, commands };
}

vi.mock("@/components/controls/ControlKnob", () => ({
	default: ({ label, disabled }: { label?: string; disabled?: boolean }) => (
		<button type="button" disabled={disabled}>
			{label}
		</button>
	),
}));

const createEnv = (overrides: Partial<StepEnvData> = {}): StepEnvData => ({
	steps: Array.from({ length: 8 }, (_, index) => ({
		level: Math.max(0, 99 - index * 10),
		rate: 40 + index,
	})),
	sustainStep: 1,
	stepCount: 4,
	loop: false,
	...overrides,
});

describe("StepEnvelopeEditor", () => {
	beforeEach(() => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		vi.spyOn(
			HTMLCanvasElement.prototype,
			"setPointerCapture",
		).mockImplementation(() => {});
		Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", {
			configurable: true,
			value: 1200,
		});
		Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", {
			configurable: true,
			value: 250,
		});
	});

	it("renders all 8 step panels and removes the old dropdown/footer UI", () => {
		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getAllByRole("group", { name: /Step / })).toHaveLength(8);
		expect(screen.queryAllByRole("combobox")).toHaveLength(0);
		expect(screen.queryByText(/Release:/i)).not.toBeInTheDocument();
		// SUS cannot be set beyond END
		expect(
			within(screen.getByRole("group", { name: "Step 8" })).getByRole(
				"button",
				{ name: "SUS" },
			),
		).toBeDisabled();
	});

	it("sets sustain from the SUS button on an active step", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 3" })).getByRole(
				"button",
				{ name: "SUS" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				sustainStep: 2,
				stepCount: 4,
			}),
		);
	});

	it("sets END on a later step and extends the active envelope range", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv()}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 6" })).getByRole(
				"button",
				{ name: "END" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				stepCount: 6,
				sustainStep: 1,
			}),
		);
	});

	it("clamps sustain when END moves earlier than the current sustain step", () => {
		const onChange = vi.fn();

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv({ stepCount: 6, sustainStep: 4 })}
				onChange={onChange}
			/>,
		);

		fireEvent.click(
			within(screen.getByRole("group", { name: "Step 3" })).getByRole(
				"button",
				{ name: "END" },
			),
		);

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				stepCount: 3,
				sustainStep: 2,
			}),
		);
	});

	it("draws the active step envelope line on the canvas", () => {
		const { context, commands } = createMockCanvasContext();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			context,
		);

		render(
			<StepEnvelopeEditor
				title="Line 1 DCW"
				env={createEnv({
					steps: [
						{ level: 20, rate: 50 },
						{ level: 70, rate: 50 },
						{ level: 40, rate: 50 },
						{ level: 99, rate: 50 },
					],
					stepCount: 4,
				})}
				onChange={vi.fn()}
			/>,
		);

		const envelopeMove = commands.find(
			(command) =>
				command.name === "moveTo" &&
				command.args[0] === 12 &&
				command.args[1] > 100,
		);
		const envelopeIndex = envelopeMove ? commands.indexOf(envelopeMove) : -1;
		const envelopeLineSegments = commands
			.slice(envelopeIndex + 1)
			.filter((command) => command.name === "lineTo")
			.slice(0, 4);

		expect(envelopeIndex).toBeGreaterThanOrEqual(0);
		expect(envelopeLineSegments).toHaveLength(4);
		expect(envelopeLineSegments.at(-1)?.args[1]).toBe(194.72727272727275);
		expect(
			envelopeLineSegments.every((command) =>
				command.args.every(Number.isFinite),
			),
		).toBe(true);
	});

	it("maps pointer coordinates correctly when the canvas is transform-scaled", () => {
		const onChange = vi.fn();
		const env = createEnv({
			steps: Array.from({ length: 8 }, () => ({ level: 50, rate: 0 })),
			stepCount: 4,
		});

		render(
			<StepEnvelopeEditor title="Line 1 DCW" env={env} onChange={onChange} />,
		);

		const canvas = document.querySelector("canvas") as HTMLCanvasElement;
		Object.defineProperty(canvas, "clientWidth", {
			configurable: true,
			value: 1200,
		});
		Object.defineProperty(canvas, "clientHeight", {
			configurable: true,
			value: 250,
		});
		vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
			x: 10,
			y: 20,
			left: 10,
			top: 20,
			right: 610,
			bottom: 120,
			width: 600,
			height: 100,
			toJSON: () => ({}),
		});

		fireEvent.pointerDown(canvas, {
			clientX: 457,
			clientY: 70,
			pointerId: 1,
		});
		fireEvent.pointerMove(canvas, {
			clientX: 457,
			clientY: 60,
			pointerId: 1,
		});

		const changed = onChange.mock.calls.at(-1)?.[0] as StepEnvData;
		expect(changed.steps[0]?.level).toBe(50);
		expect(changed.steps[1]?.level).toBe(50);
		expect(changed.steps[2]?.level).toBeCloseTo(60, 0);
	});

	it("does not render line-specific key follow controls", () => {
		render(
			<StepEnvelopeEditor
				title="Line 1 DCO"
				env={createEnv()}
				onChange={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Key Follow")).not.toBeInTheDocument();
	});
});
