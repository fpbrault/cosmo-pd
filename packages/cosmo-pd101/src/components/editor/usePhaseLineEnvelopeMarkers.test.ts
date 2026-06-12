import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PhaseLineEnvelopeEntry } from "./phaseLineTypes";
import { usePhaseLineEnvelopeMarkers } from "./usePhaseLineEnvelopeMarkers";

const unregister = vi.fn();
const registerLiveVoiceStatesConsumer = vi.fn(() => unregister);
const getLiveVoiceStates = vi.fn(() => []);
const synthController = {
	registerLiveVoiceStatesConsumer,
	getLiveVoiceStates,
};

vi.mock("@/features/synth/SynthParamController", () => ({
	useOptionalSynthController: () => synthController,
}));

const activeEnv: PhaseLineEnvelopeEntry = {
	title: "DCA",
	env: {
		steps: Array.from({ length: 8 }, () => ({ level: 0, rate: 0 })),
		sustainStep: 0,
		stepCount: 2,
		loop: false,
	},
	setEnv: vi.fn(),
	envColor: "#fff",
};

describe("usePhaseLineEnvelopeMarkers", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("subscribes to live voice telemetry while the envelope panel is visible", () => {
		vi.useFakeTimers();
		const { rerender, unmount } = renderHook(
			({ section }: { section: "algos" | "envelopes" }) =>
				usePhaseLineEnvelopeMarkers({
					lineIndex: 1,
					section,
					activeEnvTab: "dca",
					activeEnv,
				}),
			{ initialProps: { section: "envelopes" } },
		);

		expect(registerLiveVoiceStatesConsumer).toHaveBeenCalledOnce();
		act(() => {
			vi.advanceTimersByTime(16);
		});
		expect(getLiveVoiceStates).toHaveBeenCalled();

		rerender({ section: "algos" });
		expect(unregister).toHaveBeenCalledOnce();
		unmount();
	});
});
