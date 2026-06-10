import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModMatrixProvider } from "@/context/ModMatrixContext";
import {
	SynthParamControllerProvider,
	useOptionalSynthController,
	useSynthParam,
	visualModulationScale,
} from "./SynthParamController";
import { useSynthStore } from "./synthStore";

function withController(modMatrix?: { routes: unknown[] }) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<ModMatrixProvider
				modMatrix={(modMatrix ?? { routes: [] }) as never}
				setModMatrix={vi.fn()}
			>
				<SynthParamControllerProvider>{children}</SynthParamControllerProvider>
			</ModMatrixProvider>
		);
	};
}

describe("visualModulationScale", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("uses the full control span whenever min and max are known", () => {
		expect(
			visualModulationScale({
				destination: "line2DetuneNote",
				min: -11,
				max: 11,
			}),
		).toBe(22);
		expect(
			visualModulationScale({
				destination: "line2DetuneFine",
				min: -60,
				max: 60,
			}),
		).toBe(120);
		expect(
			visualModulationScale({
				destination: "line1Octave",
				min: -2,
				max: 2,
			}),
		).toBe(4);
	});

	it("keeps env-step scaling at raw envelope units when no range is provided", () => {
		expect(
			visualModulationScale({ destination: "line1DcaEnvStep1Level" }),
		).toBe(127);
		expect(visualModulationScale({ destination: "line2DcoEnvStep8Rate" })).toBe(
			127,
		);
	});

	it("falls back to unit scale for regular normalized destinations", () => {
		expect(visualModulationScale({ destination: "volume" })).toBe(1);
		expect(visualModulationScale({ destination: "delayMix" })).toBe(1);
	});

	it("throws when useSynthParam is used outside provider", () => {
		expect(() => renderHook(() => useSynthParam("volume"))).toThrow(
			"useSynthParam must be used within SynthParamControllerProvider",
		);
	});

	it("returns null optional controller outside provider", () => {
		const { result } = renderHook(() => useOptionalSynthController());
		expect(result.current).toBeNull();
	});

	it("supports get/set param through provider", () => {
		const { result } = renderHook(() => useSynthParam("volume"), {
			wrapper: withController(),
		});
		act(() => result.current.setValue(0.33));
		expect(useSynthStore.getState().volume).toBe(0.33);
	});

	it("resolves routes and modulation values with runtime events", () => {
		const wrapper = withController({
			routes: [
				{
					source: "lfo1",
					destination: "volume",
					amount: 0.5,
					enabled: true,
				},
			],
		});
		const { result } = renderHook(() => useOptionalSynthController(), {
			wrapper,
		});

		act(() => {
			result.current?.registerLiveModSourcesConsumer();
		});

		expect(result.current?.getRouteCount("volume")).toBe(1);
		expect(result.current?.hasActiveRoutes("volume")).toBe(true);
		expect(
			result.current?.getModulatedValue({
				destination: "volume",
				baseValue: 1,
			}),
		).toBe(1);

		act(() => {
			result.current?.registerLiveModSourcesConsumer();
		});

		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-mod-sources", {
					detail: {
						lfo1: 1,
						lfo2: 0,
						random: 0,
						modEnv: 0,
						velocity: 0,
						modWheel: 0,
						aftertouch: 0,
						macro1: 0,
						macro2: 0,
						macro3: 0,
						macro4: 0,
					},
				}),
			);
		});
		const modulated = result.current?.getModulatedValue({
			destination: "volume",
			baseValue: 1,
		});
		expect(modulated).toBe(1.5);
	});

	it("updates and clears runtime voice states via event lifecycle", () => {
		const { result, unmount } = renderHook(() => useOptionalSynthController(), {
			wrapper: withController(),
		});
		act(() => {
			result.current?.registerLiveVoiceStatesConsumer();
		});
		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-voice-states", {
					detail: [{ voiceId: 1 }],
				}),
			);
		});
		expect(result.current?.getLiveVoiceStates()).toEqual([{ voiceId: 1 }]);
		unmount();
		window.dispatchEvent(
			new CustomEvent("cz-runtime-voice-states", {
				detail: [{ voiceId: 2 }],
			}),
		);
	});
});
