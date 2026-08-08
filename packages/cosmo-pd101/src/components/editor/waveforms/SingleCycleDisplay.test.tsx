import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SingleCycleDisplay } from "./SingleCycleDisplay";

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
		clearRect: vi.fn((...args: number[]) =>
			commands.push({ name: "clearRect", args }),
		),
		setTransform: vi.fn(),
		lineWidth: 1,
		strokeStyle: "",
	} as unknown as CanvasRenderingContext2D;

	return { context, commands };
}

describe("SingleCycleDisplay", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("draws a non-flat waveform line from sample data", () => {
		const { context, commands } = createMockCanvasContext();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			context,
		);

		render(
			<SingleCycleDisplay
				data={new Float32Array([0, 1, 0, -1])}
				color="#60a5fa"
				label="Wave"
				width={160}
				height={80}
			/>,
		);

		const waveformMoveIndex = commands.findIndex(
			(command) => command.name === "moveTo" && command.args[0] === 0,
		);
		const waveformLineSegments = commands
			.slice(waveformMoveIndex + 1)
			.filter((command) => command.name === "lineTo")
			.slice(0, 3);

		expect(waveformMoveIndex).toBeGreaterThanOrEqual(0);
		expect(waveformLineSegments).toHaveLength(3);
		expect(waveformLineSegments.map((command) => command.args[1])).toEqual([
			4, 40, 76,
		]);
		expect(
			waveformLineSegments.every((command) =>
				command.args.every(Number.isFinite),
			),
		).toBe(true);
	});
});
