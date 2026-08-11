import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RuntimeVoiceDebugState } from "@/features/synth/hooks/useAudioEngine";
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
	shortLabel: "DCA",
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
		vi.clearAllMocks();
	});

	it("updates from live voice telemetry while the envelope panel is visible", () => {
		const { result, rerender, unmount } = renderHook(
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
		expect(getLiveVoiceStates).toHaveBeenCalledOnce();

		const voiceState = {
			index: 3,
			active: true,
			isReleasing: false,
			modEnv: {
				value: 0,
				phase: "idle",
				releasing: false,
				releaseStart: 0,
			},
			line1: {
				dco: { step: 0, value: 0, releasing: false },
				dcw: { step: 0, value: 0, releasing: false },
				dca: { step: 1, value: 0.5, releasing: false },
			},
			line2: {
				dco: { step: 0, value: 0, releasing: false },
				dcw: { step: 0, value: 0, releasing: false },
				dca: { step: 0, value: 0, releasing: false },
			},
		} as RuntimeVoiceDebugState;
		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-voice-states", {
					detail: [voiceState],
				}),
			);
		});
		expect(result.current).toEqual([
			expect.objectContaining({ id: 3, step: 1, releasing: false }),
		]);

		rerender({ section: "algos" });
		expect(unregister).toHaveBeenCalledOnce();
		expect(result.current).toEqual([]);

		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-voice-states", {
					detail: [voiceState],
				}),
			);
		});
		expect(result.current).toEqual([]);
		unmount();
	});
});
