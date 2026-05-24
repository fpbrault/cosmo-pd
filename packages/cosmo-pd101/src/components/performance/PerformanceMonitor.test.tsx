import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PerformanceMonitor } from "./PerformanceMonitor";

describe("PerformanceMonitor", () => {
	it("renders toggle button when disabled", () => {
		render(
			<PerformanceMonitor
				enabled={false}
				metrics={null}
				modeLabel="TEST"
				onToggle={vi.fn()}
			/>,
		);
		expect(screen.getByRole("button", { name: "Perf" })).toBeInTheDocument();
	});

	it("shows panel when enabled and calls toggle", () => {
		const onToggle = vi.fn();
		render(
			<PerformanceMonitor
				enabled
				metrics={{
					enabled: true,
					blockCount: 1,
					lastMs: 0.1,
					avgMs: 0.2,
					maxMs: 0.3,
					blockBudgetMs: 1,
					lastRtPercent: 30,
					avgRtPercent: 20,
					maxRtPercent: 40,
					blockSamples: 64,
					sampleRate: 48000,
					activeVoices: 2,
				}}
				modeLabel="TEST"
				onToggle={onToggle}
			/>,
		);
		expect(screen.getByText("Performance Monitor")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Perf" }));
		expect(onToggle).toHaveBeenCalled();
	});
});
