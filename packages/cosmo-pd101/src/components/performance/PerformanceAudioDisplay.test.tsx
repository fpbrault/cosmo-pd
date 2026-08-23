import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutoScopePhaseLock } from "@/components/panels/analysis/scope-visualizations/autoScopePhaseLock";
import { ScopeProvider } from "@/context/ScopeContext";
import PerformanceAudioDisplay from "./PerformanceAudioDisplay";

const analyserNodeRef = { current: null };
const audioCtxRef = { current: null };

function renderDisplay(effectivePitchHz: number) {
	return (
		<ScopeProvider
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			effectivePitchHz={effectivePitchHz}
		>
			<PerformanceAudioDisplay mode="scope" />
		</ScopeProvider>
	);
}

describe("PerformanceAudioDisplay", () => {
	beforeEach(() => {
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("keeps scope history intact when the played note changes", () => {
		const reset = vi.spyOn(AutoScopePhaseLock.prototype, "reset");
		const { rerender } = render(renderDisplay(220));
		const resetsAfterMount = reset.mock.calls.length;

		rerender(renderDisplay(440));

		expect(resetsAfterMount).toBeGreaterThan(0);
		expect(reset).toHaveBeenCalledTimes(resetsAfterMount);
	});
});
